import {
  isRichTextHtmlEmpty,
  sanitizeRichTextHtml,
} from "@/lib/rich-text-sanitize";

/** Renders sanitized marketing HTML (same rules as product descriptions). */
export function SiteCopyHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  if (isRichTextHtmlEmpty(html)) return null;

  const safe = sanitizeRichTextHtml(html);
  if (!safe) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
