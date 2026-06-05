import { randomBytes } from "crypto";

import { absoluteUrl } from "@/lib/seo";

export function generatePreviewToken(): string {
  return randomBytes(24).toString("hex");
}

export function productPreviewUrl(slug: string, previewToken: string): string {
  return absoluteUrl(`/products/${slug}/preview?token=${encodeURIComponent(previewToken)}`);
}
