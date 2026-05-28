export function readGoogleServiceAccountJson(): { client_email: string; private_key: string } {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must be valid JSON");
  }
  const p = parsed as { client_email?: unknown; private_key?: unknown };
  const client_email = String(p.client_email ?? "");
  let private_key = String(p.private_key ?? "");
  if (!client_email || !private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must contain client_email and private_key");
  }
  private_key = private_key.replace(/\\n/g, "\n");
  return { client_email, private_key };
}
