import { STRIPE_CHECKOUT_CURRENCY } from "@/lib/currency";
import { productImageUrls } from "@/lib/product-images";
import { parseSizesJson } from "@/lib/product-sizes";
import { prisma } from "@/lib/prisma";
import {
  plainTextFromProductDescriptionHtml,
  sanitizeProductDescriptionHtml,
} from "@/lib/sanitize-product-description";

export type CheckoutRequestItem = {
  productId: string;
  size?: string;
  quantity: number;
};

export type ResolvedCheckoutLine = {
  productId: string;
  slug: string;
  name: string;
  size: string | null;
  quantity: number;
  priceCents: number;
  stripeLineItem: {
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
        metadata: Record<string, string>;
      };
    };
  };
};

export async function resolveCheckoutLines(
  items: CheckoutRequestItem[],
): Promise<{ ok: true; lines: ResolvedCheckoutLine[] } | { ok: false; error: string }> {
  if (items.length === 0) {
    return { ok: false, error: "Cart is empty" };
  }

  const lines: ResolvedCheckoutLine[] = [];

  for (const item of items) {
    const product = await prisma.product.findFirst({
      where: { id: item.productId, published: true },
    });
    if (!product) {
      return { ok: false, error: "A product in your cart is no longer available" };
    }

    const sizes = parseSizesJson(product.sizesJson);
    const size = item.size?.trim() || null;
    if (sizes.length > 0) {
      if (!size || !sizes.includes(size)) {
        return { ok: false, error: `Please select a valid size for ${product.name}` };
      }
    }

    const checkoutImages = productImageUrls(product.imageUrls).slice(0, 8);
    const stripeDescription = product.description
      ? plainTextFromProductDescriptionHtml(
          sanitizeProductDescriptionHtml(product.description),
        ).slice(0, 500)
      : undefined;

    const lineItemName = size ? `${product.name} (${size})` : product.name;

    lines.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size,
      quantity: item.quantity,
      priceCents: product.priceCents,
      stripeLineItem: {
        quantity: item.quantity,
        price_data: {
          currency: STRIPE_CHECKOUT_CURRENCY,
          unit_amount: product.priceCents,
          product_data: {
            name: lineItemName,
            description: stripeDescription || undefined,
            images: checkoutImages.length > 0 ? checkoutImages : undefined,
            metadata: {
              productId: product.id,
              slug: product.slug,
              size: size ?? "",
            },
          },
        },
      },
    });
  }

  return { ok: true, lines };
}
