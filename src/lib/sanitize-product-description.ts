import {
  plainTextFromRichTextHtml,
  sanitizeRichTextHtml,
} from "@/lib/rich-text-sanitize";

/** Visible text limit (matches editor character cap). */
export const PRODUCT_DESCRIPTION_MAX_TEXT = 8000;

/** Stored HTML can be larger than plain text; guard against abuse. */
export const PRODUCT_DESCRIPTION_MAX_HTML = 24000;

/** Safe HTML for storage and for `dangerouslySetInnerHTML`. */
export function sanitizeProductDescriptionHtml(input: string): string {
  return sanitizeRichTextHtml(input);
}

/** Strip tags for Stripe, metadata, previews. */
export function plainTextFromProductDescriptionHtml(html: string): string {
  return plainTextFromRichTextHtml(html);
}
