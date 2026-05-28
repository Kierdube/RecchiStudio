/** Temporary: set ADMIN_BYPASS_AUTH=true to skip /admin login (middleware + server actions). */
export function isAdminAuthBypassed(): boolean {
  const v = process.env.ADMIN_BYPASS_AUTH?.trim().toLowerCase();
  return v === "true" || v === "1";
}
