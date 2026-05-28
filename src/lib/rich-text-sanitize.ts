import sanitizeHtml from "sanitize-html";

const FONT_FAMILY_PATTERN =
  /^('Inter Tight'|'Georgia'|'Times New Roman'|Arial|system-ui|inherit|[a-zA-Z0-9\s,'"-]+)$/;

export const RICH_TEXT_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
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
    "span",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    span: ["style"],
  },
  allowedStyles: {
    span: {
      "font-family": [FONT_FAMILY_PATTERN],
      "font-weight": [/^(normal|bold|500|600|700)$/],
      "font-style": [/^(normal|italic)$/],
      "text-decoration": [/^(none|underline|line-through)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
};

/** Safe HTML for storage and storefront rendering. */
export function sanitizeRichTextHtml(input: string): string {
  return sanitizeHtml(input.trim(), RICH_TEXT_SANITIZE_OPTIONS).trim();
}

export function plainTextFromRichTextHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

/** Strip a single wrapper `<p>` for inline headings / labels. */
export function richTextForInlineDisplay(html: string): string {
  const sanitized = sanitizeRichTextHtml(html);
  const singleParagraph = /^<p>([\s\S]*)<\/p>$/i.exec(sanitized);
  if (singleParagraph && !/<\/?p>/i.test(singleParagraph[1] ?? "")) {
    return singleParagraph[1] ?? "";
  }
  return sanitized;
}
