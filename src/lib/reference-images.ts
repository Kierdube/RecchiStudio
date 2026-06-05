import { sanitizeStoredImageUrl } from "@/lib/sanitize-image-url";

const MAX_REFERENCE_IMAGES = 10;

export function parseReferenceImageUrls(raw: string): string[] {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines.slice(0, MAX_REFERENCE_IMAGES)) {
    const url = sanitizeStoredImageUrl(line);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

export function serializeReferenceImagesJson(urls: string[]): string {
  return JSON.stringify(urls);
}

export function referenceImagesFromJson(json: string): string[] {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((v): v is string => typeof v === "string")
      .map((u) => sanitizeStoredImageUrl(u))
      .filter((u): u is string => Boolean(u));
  } catch {
    return [];
  }
}
