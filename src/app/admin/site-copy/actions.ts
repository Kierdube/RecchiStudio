"use server";

import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";

import { prisma } from "@/lib/prisma";
import { siteCopyDefinitionOrThrow } from "@/lib/site-copy-definitions";
import { sanitizeProductDescriptionHtml } from "@/lib/sanitize-product-description";
import { assertAdminSession } from "@/lib/verify-admin-session";

const MAX_PLAIN = 8000;
const MAX_HTML = 48000;
const MAX_MDX = 200000;

function sanitizePlain(input: string): string {
  return sanitizeHtml(input.trim(), { allowedTags: [], allowedAttributes: {} }).slice(0, MAX_PLAIN);
}

export type SiteCopyActionState = { ok?: true; error?: string } | null;

export async function saveSiteCopyBlock(
  _prev: SiteCopyActionState,
  formData: FormData,
): Promise<SiteCopyActionState> {
  try {
    await assertAdminSession();
  } catch {
    return { error: "Unauthorized" };
  }

  const key = String(formData.get("key") ?? "").trim();
  if (!key) return { error: "Missing key" };

  let def;
  try {
    def = siteCopyDefinitionOrThrow(key);
  } catch {
    return { error: "Unknown content key" };
  }

  let value = String(formData.get("value") ?? "");

  if (def.format === "html") {
    value = sanitizeProductDescriptionHtml(value).slice(0, MAX_HTML);
  } else if (def.format === "plain") {
    value = sanitizePlain(value);
  } else {
    value = value.trim().slice(0, MAX_MDX);
  }

  await prisma.siteCopyBlock.upsert({
    where: { key },
    create: { key, label: def.label, format: def.format, value },
    update: { value, label: def.label, format: def.format },
  });

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/policies");
  revalidatePath("/shipping");
  revalidatePath("/admin/site-copy");

  return { ok: true };
}
