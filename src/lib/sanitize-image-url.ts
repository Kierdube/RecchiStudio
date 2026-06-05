/** Accept HTTPS URLs or site paths served from /images or /uploads. */
export function sanitizeStoredImageUrl(raw: string): string {
  const value = raw.trim().slice(0, 2000);
  if (/^https?:\/\//i.test(value)) return value;
  if (/^\/(images|uploads)\/[\w./-]+$/.test(value)) return value;
  return "";
}
