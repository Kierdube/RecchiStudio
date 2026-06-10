/**
 * Send preview copies of every branded transactional email to CONTACT_TO_EMAIL.
 *
 * Usage: npm run test:emails
 * Optional: npm run test:emails -- .env.vercel.prod.tmp
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import { sendEmailPreviews } from "../src/lib/send-email-previews";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(path: string, override = false) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (override || !process.env[key] || process.env[key] === "") {
      process.env[key] = val;
    }
  }
}

const extraEnv = process.argv[2];
if (extraEnv) loadEnvFile(resolve(process.cwd(), extraEnv), true);

loadEnvFile(resolve(root, ".env"));
loadEnvFile(resolve(root, ".env.local"), true);
loadEnvFile(resolve(root, ".env.production.local"), true);

try {
  const result = await sendEmailPreviews();
  for (const row of result.results) {
    if (row.ok) {
      console.log(`OK (${row.label}):`, row.id);
    } else {
      console.error(`FAIL (${row.label}):`, row.error);
    }
  }
  console.log(`\nDone: ${result.results.filter((r) => r.ok).length}/${result.results.length} sent to ${result.to}`);
  process.exit(result.ok ? 0 : 1);
} catch (err) {
  console.error("FAIL:", err instanceof Error ? err.message : err);
  process.exit(1);
}
