import {
  isRichTextHtmlEmpty,
  richTextForInlineDisplay,
  sanitizeRichTextHtml,
} from "@/lib/rich-text-sanitize";

type SiteCopyTextProps = {
  value: string;
  className?: string;
  /** When true, unwrap a single `<p>` wrapper (for headings and labels). */
  inline?: boolean;
};

/** Renders site copy that may be plain text or sanitized rich HTML. */
export function SiteCopyText({ value, className, inline = false }: SiteCopyTextProps) {
  const raw = value.trim();
  if (!raw || isRichTextHtmlEmpty(raw)) return null;

  const looksLikeHtml = /[<>&]/.test(raw);
  if (!looksLikeHtml) {
    return <span className={className}>{raw}</span>;
  }

  const html = inline ? richTextForInlineDisplay(raw) : sanitizeRichTextHtml(raw);
  if (!html || isRichTextHtmlEmpty(html)) return null;

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
