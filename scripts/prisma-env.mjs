import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filename) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    if (process.env[key]) continue;

    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

/** Load local env files without overriding variables already set by the host (e.g. Vercel). */
export function loadProjectEnv() {
  loadEnvFile(".env");
  loadEnvFile(".env.local");
  loadEnvFile(".env.production");
  loadEnvFile(".env.production.local");
}

/** Neon migrate deploy needs a direct (non-pooler) connection. */
export function ensureDirectDatabaseUrl() {
  loadProjectEnv();

  if (process.env.DIRECT_URL?.trim()) return;

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return;

  process.env.DIRECT_URL = databaseUrl.includes("-pooler")
    ? databaseUrl.replace("-pooler", "")
    : databaseUrl;

  if (databaseUrl.includes("-pooler")) {
    console.log("> Using derived DIRECT_URL for Prisma (non-pooler Neon host)");
  }
}
