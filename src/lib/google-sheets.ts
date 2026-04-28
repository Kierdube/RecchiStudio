import { google } from "googleapis";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function readServiceAccountJson(): { client_email: string; private_key: string } {
  const raw = requiredEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
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
  // When stored in env vars, private_key often contains escaped newlines.
  private_key = private_key.replace(/\\n/g, "\n");
  return { client_email, private_key };
}

export async function readSheetValues(range: string): Promise<string[][]> {
  const { client_email, private_key } = readServiceAccountJson();
  const sheetsId = requiredEnv("GOOGLE_SHEETS_ID");

  const auth = new google.auth.JWT({
    email: client_email,
    key: private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetsId,
    range,
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  const values = res.data.values ?? [];
  return values.map((row) => row.map((cell) => (cell == null ? "" : String(cell))));
}
