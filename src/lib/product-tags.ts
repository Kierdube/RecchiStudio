import { categoryLabelForSlug } from "@/lib/catalog";

export const MAX_PRODUCT_TAGS = 12;
export const MAX_PRODUCT_TAG_LABEL = 48;

export const PRODUCT_TAG_COLORS = [
  {
    id: "mint",
    label: "Mint",
    className:
      "border-[#19371E]/12 bg-[#C5E6A6]/40 text-[#19371E] shadow-sm shadow-[#19371E]/[0.04]",
  },
  {
    id: "sage",
    label: "Sage",
    className: "border-[#19371E]/12 bg-[#F4F9EF] text-[#2d5a36] shadow-sm shadow-[#19371E]/[0.04]",
  },
  {
    id: "cream",
    label: "Cream",
    className: "border-[#19371E]/10 bg-[#FDFCF8] text-[#19371E] shadow-sm shadow-[#19371E]/[0.04]",
  },
  {
    id: "forest",
    label: "Forest",
    className: "border-[#19371E]/20 bg-[#19371E] text-[#C5E6A6] shadow-sm shadow-[#19371E]/10",
  },
  {
    id: "sky",
    label: "Sky",
    className: "border-[#19371E]/12 bg-[#E8F0DD] text-[#2d5a36] shadow-sm shadow-[#19371E]/[0.04]",
  },
  {
    id: "rose",
    label: "Rose",
    className: "border-[#19371E]/12 bg-[#FCE8EC] text-[#7A2E3A] shadow-sm shadow-[#19371E]/[0.04]",
  },
] as const;

export type ProductTagColor = (typeof PRODUCT_TAG_COLORS)[number]["id"];

export type ProductTag = {
  label: string;
  color: ProductTagColor;
};

const COLOR_SET = new Set<string>(PRODUCT_TAG_COLORS.map((c) => c.id));
const DEFAULT_COLOR: ProductTagColor = "mint";

export function tagColorClass(color: string | undefined): string {
  return PRODUCT_TAG_COLORS.find((c) => c.id === color)?.className ?? PRODUCT_TAG_COLORS[0].className;
}

export function parseTagsJson(json: string | null | undefined): ProductTag[] {
  if (!json?.trim()) return [];
  try {
    const raw = JSON.parse(json) as unknown;
    if (!Array.isArray(raw)) return [];
    const out: ProductTag[] = [];
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const label = String((item as ProductTag).label ?? "").trim();
      if (!label) continue;
      const colorRaw = String((item as ProductTag).color ?? DEFAULT_COLOR).trim();
      const color = COLOR_SET.has(colorRaw) ? (colorRaw as ProductTagColor) : DEFAULT_COLOR;
      out.push({ label: label.slice(0, MAX_PRODUCT_TAG_LABEL), color });
      if (out.length >= MAX_PRODUCT_TAGS) break;
    }
    return out;
  } catch {
    return [];
  }
}

export function serializeTagsJson(tags: ProductTag[]): string {
  return JSON.stringify(tags);
}

export function parseTagsFromFormField(raw: string): ProductTag[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  return parseTagsJson(trimmed);
}

/** Tags for the product page; falls back to collection label when none are set. */
export function resolveProductTags(
  tagsJson: string | null | undefined,
  categorySlug: string | null | undefined,
): ProductTag[] {
  const tags = parseTagsJson(tagsJson);
  if (tags.length > 0) return tags;
  const label = categoryLabelForSlug(categorySlug);
  if (!label) return [];
  return [{ label, color: "sage" }];
}
