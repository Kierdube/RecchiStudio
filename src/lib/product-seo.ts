import type { Product } from "@prisma/client";

import { primaryProductImage } from "@/lib/product-images";
import { productOpenGraph } from "@/lib/seo";
import {
  plainTextFromProductDescriptionHtml,
  sanitizeProductDescriptionHtml,
} from "@/lib/sanitize-product-description";

export function resolveProductSeo(product: Pick<Product, "name" | "description" | "metaTitle" | "metaDescription" | "slug" | "imageUrls">) {
  const fallbackDescription = product.description
    ? plainTextFromProductDescriptionHtml(sanitizeProductDescriptionHtml(product.description)).slice(
        0,
        160,
      )
    : `${product.name} — Recchi Studio`;

  const title = product.metaTitle?.trim() || product.name;
  const description =
    product.metaDescription?.trim() || fallbackDescription || `${product.name} — Recchi Studio`;

  return productOpenGraph({
    title,
    description,
    slug: product.slug,
    imageUrl: primaryProductImage(product.imageUrls),
  });
}
