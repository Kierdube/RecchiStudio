#!/usr/bin/env node
/**
 * Send a signed checkout.session.completed test event to your webhook URL.
 * Requires STRIPE_WEBHOOK_SECRET and NEXT_PUBLIC_APP_URL in .env (or env).
 *
 * Usage: node scripts/send-test-webhook.mjs
 */
import crypto from "crypto";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(path, override = false) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const key = t.slice(0, i);
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    val = val.replace(/\\n$/g, "").trim();
    if (!val && !override) continue;
    if (override || !(key in process.env) || !process.env[key]) {
      process.env[key] = val;
    }
  }
}

const extraEnv = process.argv[2];
if (extraEnv) loadEnvFile(resolve(process.cwd(), extraEnv), true);

loadEnvFile(resolve(root, ".env"));
loadEnvFile(resolve(root, ".env.local"));
loadEnvFile(resolve(root, ".env.production.local"));

const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

if (!secret || !secret.startsWith("whsec_")) {
  console.error(
    "Missing STRIPE_WEBHOOK_SECRET in .env — copy the signing secret from Stripe Dashboard → Webhooks → your endpoint → Signing secret.",
  );
  process.exit(1);
}
if (!baseUrl) {
  console.error("Missing NEXT_PUBLIC_APP_URL");
  process.exit(1);
}

const sessionId = `cs_test_${Date.now()}`;
const event = {
  id: `evt_test_${Date.now()}`,
  object: "event",
  type: "checkout.session.completed",
  created: Math.floor(Date.now() / 1000),
  livemode: true,
  data: {
    object: {
      id: sessionId,
      object: "checkout.session",
      amount_total: 4200,
      currency: "cad",
      customer_email: "test-webhook@recchi.studio",
      payment_status: "paid",
      status: "complete",
      metadata: {
        productId: "webhook_test",
        productSlug: "webhook-test",
        productName: "Webhook test item",
        size: "M",
      },
      customer_details: {
        email: "test-webhook@recchi.studio",
        name: "Stripe Test",
        address: {
          line1: "123 Test St",
          city: "Toronto",
          state: "ON",
          postal_code: "M5V 1A1",
          country: "CA",
        },
      },
    },
  },
};

const payload = JSON.stringify(event);
const timestamp = Math.floor(Date.now() / 1000);
const signed = crypto
  .createHmac("sha256", secret)
  .update(`${timestamp}.${payload}`)
  .digest("hex");

const url = `${baseUrl}/api/webhooks/stripe`;
const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Stripe-Signature": `t=${timestamp},v1=${signed}`,
  },
  body: payload,
});

const text = await res.text();
console.log("POST", url);
console.log("Status:", res.status);
console.log("Body:", text);
process.exit(res.ok ? 0 : 1);
