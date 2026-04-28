/**
 * Legacy product descriptions were plain text. TipTap expects HTML.
 */
export function descriptionHtmlForEditor(stored: string | null | undefined): string {
  const s = (stored ?? "").trim();
  if (!s) return "<p></p>";
  if (s.includes("<") && s.includes(">")) return s;

  function escapeHtml(t: string): string {
    return t
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  return escapeHtml(s)
    .split(/\n\n+/)
    .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
    .join("");
}
