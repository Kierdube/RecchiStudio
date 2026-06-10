#!/usr/bin/env node
/**
 * Send a one-off test email through Resend using .env vars.
 *
 * Requires RESEND_API_KEY and CONTACT_TO_EMAIL.
 * RESEND_FROM_EMAIL is optional (defaults to onboarding@resend.dev).
 *
 * Usage: npm run test:resend
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(path, override = false) {
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
    if (override || process.env[key] == null || process.env[key] === "") {
      process.env[key] = val;
    }
  }
}

loadEnvFile(resolve(root, ".env"));
loadEnvFile(resolve(root, ".env.local"), true);

const key = process.env.RESEND_API_KEY?.trim();
const to = process.env.CONTACT_TO_EMAIL?.trim();
const from =
  process.env.RESEND_FROM_EMAIL?.trim() || "Recchi Studio <onboarding@resend.dev>";

if (!key) {
  console.error("FAIL: RESEND_API_KEY is missing or empty in .env");
  process.exit(1);
}
if (!to) {
  console.error("FAIL: CONTACT_TO_EMAIL is missing or empty in .env");
  process.exit(1);
}

console.log("Sending Resend test email…");
console.log("  from:", from);
console.log("  to:  ", to);

const resend = new Resend(key);
const testHtml = `<!DOCTYPE html><html><body style="margin:0;padding:32px;background:#fdfcf8;font-family:sans-serif;">
  <table width="100%" style="max-width:560px;margin:0 auto;"><tr><td style="padding:28px 32px;background:#19371E;border-radius:20px 20px 0 0;">
    <p style="margin:0;font-size:22px;font-weight:600;color:#C5E6A6;">Recchi Studio</p>
  </td></tr><tr><td style="padding:32px;background:#fff;border:1px solid #19371E1a;">
    <h1 style="margin:0 0 12px;font-size:24px;color:#19371E;">Resend test</h1>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#4a5c4e;">If you received this styled email, HTML + Resend are working.</p>
  </td></tr></table></body></html>`;
const { data, error } = await resend.emails.send({
  from,
  to: [to],
  subject: "Recchi Studio — Resend test",
  text: [
    "This is a test email from scripts/test-resend.mjs.",
    "",
    "If you received it, Resend is configured correctly.",
    `Time: ${new Date().toISOString()}`,
  ].join("\n"),
  html: testHtml,
});

if (error) {
  console.error("FAIL:", error);
  process.exit(1);
}

console.log("OK: sent. Resend id:", data?.id);
console.log("Check the inbox for", to);
