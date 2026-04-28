/**
 * Normalize values from .env / deployment dashboards (quotes, BOM, CRLF, spaces).
 */
export function normalizeAdminCredential(raw: string | undefined): string {
  if (raw == null) return "";
  let s = raw.replace(/^\uFEFF/, "").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s.replace(/\r$/, "");
}

export function readAdminUsername(): string | null {
  const v = normalizeAdminCredential(process.env.ADMIN_USERNAME);
  return v.length > 0 ? v : null;
}

export function readAdminPassword(): string | null {
  const v = normalizeAdminCredential(process.env.ADMIN_PASSWORD);
  return v.length > 0 ? v : null;
}
