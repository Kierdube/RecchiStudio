import { sanitizeProductDescriptionHtml } from "@/lib/sanitize-product-description";

/** Renders sanitized marketing HTML (same rules as product descriptions). */
export function SiteCopyHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeProductDescriptionHtml(html) }}
    />
  );
}
