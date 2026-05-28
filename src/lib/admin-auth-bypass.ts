/** Temporary: skip /admin login on Vercel production until auth is re-enabled. */
export function isAdminAuthBypassed(): boolean {
  const v = process.env.ADMIN_BYPASS_AUTH?.trim().toLowerCase();
  if (v === "false" || v === "0") return false;
  if (v === "true" || v === "1") return true;
  // Default open on live Vercel production (recchistudio.com). Preview/local still require login.
  return process.env.VERCEL_ENV === "production";
}
