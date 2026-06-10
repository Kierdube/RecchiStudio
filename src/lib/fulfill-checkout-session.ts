import { Resend } from "resend";
import type Stripe from "stripe";

import {
  type OrderLineItem,
  serializeOrderLineItems,
} from "@/lib/cart";
import { orderNotificationEmail } from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";

function formatMoney(cents: number, currency: string): string {
  const code = currency.toUpperCase();
  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${code}`;
  }
}

function shippingLines(session: Stripe.Checkout.Session): string {
  const details = session.customer_details;
  const addr = details?.address;
  if (!addr) return "—";
  const parts = [
    details?.name,
    addr.line1,
    addr.line2,
    [addr.city, addr.state, addr.postal_code].filter(Boolean).join(", "),
    addr.country,
  ].filter((p) => p && String(p).trim());
  return parts.length ? parts.join("\n") : "—";
}

function lineItemsFromSession(session: Stripe.Checkout.Session): OrderLineItem[] {
  const rows = session.line_items?.data ?? [];
  const out: OrderLineItem[] = [];

  for (const line of rows) {
    const quantity = line.quantity ?? 1;
    const amountCents = line.amount_total ?? 0;
    const price = line.price;
    const product =
      price && typeof price.product === "object" && price.product !== null
        ? (price.product as Stripe.Product)
        : null;
    const metadata = product?.metadata ?? {};
    const size = metadata.size?.trim() || null;

    out.push({
      productId: metadata.productId?.trim() || null,
      productName: line.description ?? product?.name ?? "Item",
      productSlug: metadata.slug?.trim() || null,
      size,
      quantity,
      amountCents,
    });
  }

  return out;
}

function orderSummaryName(lineItems: OrderLineItem[]): string {
  if (lineItems.length === 0) return "Order";
  if (lineItems.length === 1) {
    const only = lineItems[0]!;
    return only.size ? `${only.productName} (${only.size})` : only.productName;
  }
  const totalQty = lineItems.reduce((sum, i) => sum + i.quantity, 0);
  return `${lineItems.length} products (${totalQty} items)`;
}

async function sendOrderNotificationEmail(order: {
  productName: string;
  lineItems: OrderLineItem[];
  amountCents: number;
  currency: string;
  customerEmail: string | null;
  customerName: string | null;
  stripeSessionId: string;
  shippingJson: string | null;
}): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Recchi Studio <onboarding@resend.dev>";
  if (!resendKey || !to) return;

  let shipping = "—";
  if (order.shippingJson) {
    try {
      const parsed = JSON.parse(order.shippingJson) as { lines?: string };
      shipping = parsed.lines ?? order.shippingJson;
    } catch {
      shipping = order.shippingJson;
    }
  }

  const lineItemsForMail =
    order.lineItems.length > 0
      ? order.lineItems.map((item) => ({
          productName: item.productName,
          size: item.size,
          quantity: item.quantity,
          amountLabel: formatMoney(item.amountCents, order.currency),
        }))
      : [
          {
            productName: order.productName,
            size: null as string | null,
            quantity: 1,
            amountLabel: formatMoney(order.amountCents, order.currency),
          },
        ];

  const mail = orderNotificationEmail({
    productName: order.productName,
    lineItems: lineItemsForMail,
    totalLabel: formatMoney(order.amountCents, order.currency),
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    shipping,
    stripeSessionId: order.stripeSessionId,
  });

  try {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: order.customerEmail ?? undefined,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) {
      console.error("Order notification email failed:", error);
    }
  } catch (err) {
    console.error("Order notification email failed:", err);
  }
}

/**
 * Idempotent: creates an Order and sends notification email on first successful payment.
 */
export async function fulfillCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<{ created: boolean; orderId?: string }> {
  if (session.payment_status !== "paid") {
    return { created: false };
  }

  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
    select: { id: true },
  });
  if (existing) {
    return { created: false, orderId: existing.id };
  }

  const metadata = session.metadata ?? {};
  const lineItems = lineItemsFromSession(session);
  const amountCents = session.amount_total ?? 0;
  const currency = (session.currency ?? "cad").toLowerCase();
  const itemCount = lineItems.reduce((sum, i) => sum + i.quantity, 0) || 1;

  let productName = orderSummaryName(lineItems);
  let productId = metadata.productId?.trim() || lineItems[0]?.productId || null;
  let productSlug = metadata.productSlug?.trim() || lineItems[0]?.productSlug || null;
  let size = metadata.size?.trim() || lineItems[0]?.size || null;

  if (lineItems.length === 0) {
    productName = metadata.productName?.trim() || "Order";
    productId = metadata.productId?.trim() || null;
    productSlug = metadata.productSlug?.trim() || null;
    size = metadata.size?.trim() || null;
  }

  const customerEmail =
    session.customer_email ?? session.customer_details?.email ?? null;
  const customerName = session.customer_details?.name ?? null;

  const shippingText = shippingLines(session);
  const shippingJson =
    shippingText !== "—"
      ? JSON.stringify({ lines: shippingText })
      : null;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const order = await prisma.order.create({
    data: {
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      productId,
      productName,
      productSlug,
      size: lineItems.length === 1 ? size : null,
      itemCount,
      lineItemsJson:
        lineItems.length > 0 ? serializeOrderLineItems(lineItems) : null,
      amountCents,
      currency,
      customerEmail,
      customerName,
      shippingJson,
      status: "paid",
    },
  });

  await sendOrderNotificationEmail({
    productName: order.productName,
    lineItems:
      lineItems.length > 0
        ? lineItems
        : [
            {
              productId,
              productName,
              productSlug,
              size,
              quantity: 1,
              amountCents,
            },
          ],
    amountCents: order.amountCents,
    currency: order.currency,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    stripeSessionId: order.stripeSessionId,
    shippingJson: order.shippingJson,
  });

  return { created: true, orderId: order.id };
}
