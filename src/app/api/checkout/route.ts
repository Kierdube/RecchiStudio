import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { STRIPE_CHECKOUT_CURRENCY } from "@/lib/currency";
import { productImageUrls } from "@/lib/product-images";
import { parseSizesJson } from "@/lib/product-sizes";
import { prisma } from "@/lib/prisma";
import {
  plainTextFromProductDescriptionHtml,
  sanitizeProductDescriptionHtml,
} from "@/lib/sanitize-product-description";

const bodySchema = z.object({
  productId: z.string().min(1),
  size: z.string().trim().max(50).optional(),
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

  const sizes = parseSizesJson(product.sizesJson);
  const size = parsed.data.size?.trim();
  if (sizes.length > 0) {
    if (!size || !sizes.includes(size)) {
      return NextResponse.json({ error: "Please select a valid size" }, { status: 400 });
    }
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

  const lineItemName = size ? `${product.name} (${size})` : product.name;
  const sessionMetadata: Record<string, string> = {
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
  };
  if (size) sessionMetadata.size = size;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: STRIPE_CHECKOUT_CURRENCY,
          unit_amount: product.priceCents,
          product_data: {
            name: lineItemName,
            description: stripeDescription || undefined,
            images: checkoutImages.length > 0 ? checkoutImages : undefined,
            metadata: { productId: product.id, slug: product.slug },
          },
        },
      },
    ],
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/products/${product.slug}`,
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
