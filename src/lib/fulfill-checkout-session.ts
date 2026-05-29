import { Resend } from "resend";
import type Stripe from "stripe";

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

async function sendOrderNotificationEmail(order: {
  productName: string;
  size: string | null;
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

  const sizeLine = order.size ? `\nSize: ${order.size}` : "";
  const text = [
    "New order — Recchi Studio",
    "",
    `Product: ${order.productName}${sizeLine}`,
    `Total: ${formatMoney(order.amountCents, order.currency)}`,
    "",
    `Customer: ${order.customerName ?? "—"}`,
    `Email: ${order.customerEmail ?? "—"}`,
    "",
    "Shipping:",
    shipping,
    "",
    `Stripe session: ${order.stripeSessionId}`,
  ].join("\n");

  try {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from,
      to: [to],
      replyTo: order.customerEmail ?? undefined,
      subject: `New order: ${order.productName}${order.size ? ` (${order.size})` : ""}`,
      text,
    });
  } catch {
    // Order is saved; email is best-effort
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
  const productId = metadata.productId?.trim() || null;
  const size = metadata.size?.trim() || null;
  const amountCents = session.amount_total ?? 0;
  const currency = (session.currency ?? "cad").toLowerCase();

  let productName = metadata.productName?.trim() || "Order";
  let productSlug = metadata.productSlug?.trim() || null;

  if (productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true, slug: true },
    });
    if (product) {
      productName = product.name;
      productSlug = product.slug;
    }
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
      size,
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
    size: order.size,
    amountCents: order.amountCents,
    currency: order.currency,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    stripeSessionId: order.stripeSessionId,
    shippingJson: order.shippingJson,
  });

  return { created: true, orderId: order.id };
}
