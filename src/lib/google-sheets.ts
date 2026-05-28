import { google } from "googleapis";

import { readGoogleServiceAccountJson } from "@/lib/google-service-account";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

export async function readSheetValues(range: string): Promise<string[][]> {
  const { client_email, private_key } = readGoogleServiceAccountJson();
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
