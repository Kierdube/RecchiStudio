import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminSession } from "@/lib/verify-admin-session";
import { serializeImageUrls } from "@/lib/product-images";
import { parseSizesFromSheet, serializeSizesJson } from "@/lib/product-sizes";
import { sanitizeProductDescriptionHtml } from "@/lib/sanitize-product-description";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

const RowSchema = z.object({
  name: z.string().trim().min(1, "Products is required").max(200),
  status: z.string().trim().optional(),
  finalRetailPrice: z.string().trim().min(1, "Final Retail Price is required"),
  description: z.string().optional(),
  image1: z.string().optional(),
  image2: z.string().optional(),
  image3: z.string().optional(),
  sizeOption: z.string().optional(),
});

function normalizeHeaderKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function toHeaderMap(headerRow: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  headerRow.forEach((h, idx) => {
    const key = normalizeHeaderKey(String(h ?? "").trim());
    if (!key) return;
    if (map[key] != null) return;
    map[key] = idx;
  });
  return map;
}

function readCell(row: string[], header: Record<string, number>, key: string): string {
  const idx = header[key];
  if (idx == null) return "";
  return String(row[idx] ?? "");
}

function parseImageUrl(raw: string): { ok: true; value: string } | { ok: false; error: string } {
  const s = raw.trim();
  if (!s) return { ok: false, error: "empty" };
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { ok: false, error: "Image URL must be http(s)" };
    }
    return { ok: true, value: s };
  } catch {
    return { ok: false, error: "Image URL is invalid" };
  }
}

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function parseUsdToCents(raw: string): { ok: true; cents: number } | { ok: false; error: string } {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return { ok: false, error: "Final Retail Price is invalid" };
  const cents = Math.round(n * 100);
  if (cents < 1) return { ok: false, error: "Final Retail Price must be >= 0.01" };
  return { ok: true, cents };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    // Drop trailing completely-empty rows.
    if (row.length === 1 && row[0] === "" && rows.length > 0) {
      row = [];
      return;
    }
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;

    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      pushField();
      continue;
    }

    if (ch === "\n") {
      pushField();
      pushRow();
      continue;
    }

    if (ch === "\r") {
      // Handle CRLF
      const next = text[i + 1];
      if (next === "\n") i++;
      pushField();
      pushRow();
      continue;
    }

    field += ch;
  }

  pushField();
  pushRow();

  return rows;
}

export async function POST() {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let csvText: string;
  try {
    const url = requiredEnv("PRODUCTS_CSV_URL");
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`CSV fetch failed (${res.status})`);
    csvText = await res.text();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch CSV" },
      { status: 500 },
    );
  }

  const values = parseCsv(csvText).map((r) => r.map((c) => String(c ?? "")));

  if (values.length < 2) {
    return NextResponse.json({ ok: true, created: 0, updated: 0, skipped: 0, errors: [] });
  }

  const header = toHeaderMap(values[0] ?? []);
  const requiredCols = [
    normalizeHeaderKey("Products"),
    normalizeHeaderKey("Final Retail Price"),
    normalizeHeaderKey("Status"),
  ];
  const missing = requiredCols.filter((c) => header[c] == null);
  if (missing.length) {
    return NextResponse.json(
      {
        error: "Missing required columns in sheet header. Expected: Products, Final Retail Price, Status.",
      },
      { status: 400 },
    );
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: Array<{ row: number; slug?: string; error: string }> = [];
  const seenSlugs = new Set<string>();

  for (let i = 1; i < values.length; i++) {
    const rowIndex = i + 1;
    const row = values[i] ?? [];

    const raw = {
      name: readCell(row, header, normalizeHeaderKey("Products")),
      finalRetailPrice: readCell(row, header, normalizeHeaderKey("Final Retail Price")),
      status: readCell(row, header, normalizeHeaderKey("Status")),
      description: readCell(row, header, normalizeHeaderKey("Description")) || undefined,
      image1: readCell(row, header, normalizeHeaderKey("Image 1")) || undefined,
      image2: readCell(row, header, normalizeHeaderKey("Image 2")) || undefined,
      image3: readCell(row, header, normalizeHeaderKey("Image 3")) || undefined,
      sizeOption: readCell(row, header, normalizeHeaderKey("Size Options")) || undefined,
    };

    const parsed = RowSchema.safeParse(raw);
    if (!parsed.success) {
      skipped++;
      errors.push({
        row: rowIndex,
        slug: raw.name ? slugifyName(raw.name) : undefined,
        error: parsed.error.issues.map((x) => x.message).join(" "),
      });
      continue;
    }

    const status = (parsed.data.status || "").trim().toLowerCase();
    if (status !== "active") {
      skipped++;
      continue;
    }

    const slug = slugifyName(parsed.data.name);
    if (!slug) {
      skipped++;
      errors.push({ row: rowIndex, error: "Could not generate slug from Products" });
      continue;
    }
    if (seenSlugs.has(slug)) {
      skipped++;
      errors.push({ row: rowIndex, slug, error: "Duplicate product name/slug in sheet" });
      continue;
    }
    seenSlugs.add(slug);

    const price = parseUsdToCents(parsed.data.finalRetailPrice);
    if (!price.ok) {
      skipped++;
      errors.push({ row: rowIndex, slug, error: price.error });
      continue;
    }

    const imageCandidates = [parsed.data.image1, parsed.data.image2, parsed.data.image3]
      .map((x) => String(x ?? "").trim())
      .filter(Boolean);
    const imageUrls: string[] = [];
    for (const candidate of imageCandidates) {
      const u = parseImageUrl(candidate);
      if (!u.ok) continue;
      if (!imageUrls.includes(u.value)) imageUrls.push(u.value);
    }

    const descriptionRaw = String(parsed.data.description ?? "").trim();
    const description =
      descriptionRaw.length === 0
        ? null
        : descriptionRaw.includes("<")
          ? sanitizeProductDescriptionHtml(descriptionRaw)
          : sanitizeProductDescriptionHtml(`<p>${escapeHtml(descriptionRaw)}</p>`);

    const sizes = parseSizesFromSheet(parsed.data.sizeOption);

    try {
      const existing = await prisma.product.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing) {
        await prisma.product.create({
          data: {
            slug,
            name: parsed.data.name,
            description,
            priceCents: price.cents,
            categorySlug: "other",
            published: true,
            imageUrls: serializeImageUrls(imageUrls),
            sizesJson: serializeSizesJson(sizes),
          },
        });
        created++;
      } else {
        await prisma.product.update({
          where: { slug },
          data: {
            name: parsed.data.name,
            description,
            priceCents: price.cents,
            categorySlug: "other",
            published: true,
            imageUrls: serializeImageUrls(imageUrls),
            sizesJson: serializeSizesJson(sizes),
          },
        });
        updated++;
      }
    } catch (e) {
      skipped++;
      errors.push({
        row: rowIndex,
        slug,
        error: e instanceof Error ? e.message : "Failed to upsert product",
      });
    }
  }

  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/catalog");
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true, created, updated, skipped, errors });
}

