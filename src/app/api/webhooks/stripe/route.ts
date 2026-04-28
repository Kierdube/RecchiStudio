import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Optional: confirm payments, send emails, decrement inventory.
 * Configure STRIPE_WEBHOOK_SECRET and point Stripe CLI or Dashboard to /api/webhooks/stripe
 */
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 503 },
    );
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      // const session = event.data.object as Stripe.Checkout.Session;
      // TODO: mark order paid, notify fulfillment, etc.
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
