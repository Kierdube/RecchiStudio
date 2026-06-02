import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { MAX_CART_LINE_QUANTITY, MAX_CART_LINES } from "@/lib/cart";
import { resolveCheckoutLines } from "@/lib/checkout-line-items";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  size: z.string().trim().max(50).optional(),
  quantity: z.number().int().min(1).max(MAX_CART_LINE_QUANTITY),
});

const bodySchema = z.object({
  items: z.array(cartItemSchema).min(1).max(MAX_CART_LINES),
});

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured (missing STRIPE_SECRET_KEY)" },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  }

  const resolved = await resolveCheckoutLines(parsed.data.items);
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (!appUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_APP_URL is not set" },
      { status: 500 },
    );
  }

  const lines = resolved.lines;
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const sessionMetadata: Record<string, string> = {
    cartCheckout: "true",
    itemCount: String(itemCount),
  };

  if (lines.length === 1) {
    const only = lines[0]!;
    sessionMetadata.productId = only.productId;
    sessionMetadata.productSlug = only.slug;
    sessionMetadata.productName = only.name;
    if (only.size) sessionMetadata.size = only.size;
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lines.map((l) => l.stripeLineItem),
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cart`,
    metadata: sessionMetadata,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Could not create checkout session" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
