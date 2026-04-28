"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { serializeImageUrls } from "@/lib/product-images";
import {
  PRODUCT_DESCRIPTION_MAX_HTML,
  PRODUCT_DESCRIPTION_MAX_TEXT,
  plainTextFromProductDescriptionHtml,
  sanitizeProductDescriptionHtml,
} from "@/lib/sanitize-product-description";

const productFields = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers, hyphens only"),
  description: z.string().max(PRODUCT_DESCRIPTION_MAX_HTML).optional(),
  priceDollars: z.coerce.number().min(0.01, "Price must be at least 0.01").max(99999),
  categorySlug: z.enum(["birds", "flamingos", "cats", "abstract", "other"]),
  published: z.enum(["on", "off"]).optional(),
});

function readProductForm(formData: FormData) {
  const publishedRaw = formData.get("published");
  const published = publishedRaw === "on" ? "on" : "off";
  const descRaw = String(formData.get("description") ?? "").trim();
  return productFields.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: descRaw.length > 0 ? descRaw : undefined,
    priceDollars: formData.get("priceDollars"),
    categorySlug: formData.get("categorySlug"),
    published,
  });
}

function normalizeDescription(
  raw: string | undefined,
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (raw == null || raw.trim() === "") return { ok: true, value: null };
  const sanitized = sanitizeProductDescriptionHtml(raw);
  const plain = plainTextFromProductDescriptionHtml(sanitized);
  if (plain.length > PRODUCT_DESCRIPTION_MAX_TEXT) {
    return {
      ok: false,
      error: `Description must be at most ${PRODUCT_DESCRIPTION_MAX_TEXT.toLocaleString()} characters of text (formatting does not count toward that limit).`,
    };
  }
  if (!plain) return { ok: true, value: null };
  return { ok: true, value: sanitized };
}

const MAX_IMAGE_URLS = 20;

function parseImageUrls(formData: FormData): { ok: true; value: string[] } | { ok: false; error: string } {
  const raw = String(formData.get("imageUrls") ?? "");
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > MAX_IMAGE_URLS) {
    return { ok: false, error: `At most ${MAX_IMAGE_URLS} image URLs` };
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    if (seen.has(line)) continue;
    seen.add(line);
    try {
      const u = new URL(line);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return { ok: false, error: "Each image URL must start with http:// or https://" };
      }
    } catch {
      return { ok: false, error: "Each line must be a valid http(s) URL" };
    }
    out.push(line);
  }
  return { ok: true, value: out };
}

export type ProductActionState = { error: string } | null;

export async function createProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const parsed = readProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(" ") };
  }
  const imgs = parseImageUrls(formData);
  if (!imgs.ok) return { error: imgs.error };
  const descNorm = normalizeDescription(parsed.data.description);
  if (!descNorm.ok) return { error: descNorm.error };
  const { name, slug, priceDollars, categorySlug } = parsed.data;
  const published = parsed.data.published === "on";
  const priceCents = Math.round(priceDollars * 100);

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        description: descNorm.value,
        priceCents,
        imageUrls: serializeImageUrls(imgs.value),
        categorySlug,
        published,
      },
    });
  } catch {
    return { error: "Could not create product (duplicate slug?)" };
  }

  revalidatePath("/");
  revalidatePath("/catalog");
  redirect("/admin/products");
}

export async function updateProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing product id" };

  const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });

  const parsed = readProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(" ") };
  }
  const imgs = parseImageUrls(formData);
  if (!imgs.ok) return { error: imgs.error };
  const descNorm = normalizeDescription(parsed.data.description);
  if (!descNorm.ok) return { error: descNorm.error };
  const { name, slug, priceDollars, categorySlug } = parsed.data;
  const published = parsed.data.published === "on";
  const priceCents = Math.round(priceDollars * 100);

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description: descNorm.value,
        priceCents,
        imageUrls: serializeImageUrls(imgs.value),
        categorySlug,
        published,
      },
    });
  } catch {
    return { error: "Could not update product (duplicate slug?)" };
  }

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath(`/products/${slug}`);
  if (existing && existing.slug !== slug) {
    revalidatePath(`/products/${existing.slug}`);
  }
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.product.delete({ where: { id } }).catch(() => null);
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/products");
}
