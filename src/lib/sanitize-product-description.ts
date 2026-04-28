import sanitizeHtml from "sanitize-html";

/** Visible text limit (matches editor character cap). */
export const PRODUCT_DESCRIPTION_MAX_TEXT = 8000;

/** Stored HTML can be larger than plain text; guard against abuse. */
export const PRODUCT_DESCRIPTION_MAX_HTML = 24000;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "blockquote",
    "a",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {},
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
};

/** Safe HTML for storage and for `dangerouslySetInnerHTML`. */
export function sanitizeProductDescriptionHtml(input: string): string {
  return sanitizeHtml(input.trim(), SANITIZE_OPTIONS).trim();
}

/** Strip tags for Stripe, metadata, previews. */
export function plainTextFromProductDescriptionHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}
