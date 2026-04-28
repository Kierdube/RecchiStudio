import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { productImageUrls } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";
import {
  plainTextFromProductDescriptionHtml,
  sanitizeProductDescriptionHtml,
} from "@/lib/sanitize-product-description";

const bodySchema = z.object({
  productId: z.string().min(1),
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
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const product = await prisma.product.findFirst({
    where: { id: parsed.data.productId, published: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (!appUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_APP_URL is not set" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(secretKey);
  const checkoutImages = productImageUrls(product.imageUrls).slice(0, 8);
  const stripeDescription = product.description
    ? plainTextFromProductDescriptionHtml(sanitizeProductDescriptionHtml(product.description)).slice(
        0,
        500,
      )
    : undefined;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: product.priceCents,
          product_data: {
            name: product.name,
            description: stripeDescription || undefined,
            images: checkoutImages.length > 0 ? checkoutImages : undefined,
            metadata: { productId: product.id, slug: product.slug },
          },
        },
      },
    ],
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/catalog`,
    metadata: { productId: product.id },
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Could not create checkout session" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
