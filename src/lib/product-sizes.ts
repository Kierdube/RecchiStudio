export const MAX_PRODUCT_SIZES = 30;

export function parseSizesFromSheet(raw: unknown): string[] {
  if (raw == null) return [];
  const s = String(raw).trim();
  if (!s) return [];

  // Allow comma-separated or newline-separated values.
  const parts = s
    .split(/[,\\n\\r\\t]+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    const normalized = part.replace(/\\s+/g, " ");
    if (!normalized) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= MAX_PRODUCT_SIZES) break;
  }

  return out;
}

export function parseSizesJson(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    if (!Array.isArray(v)) return [];
    return v.map((x) => String(x)).map((x) => x.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

export function serializeSizesJson(sizes: string[]): string {
  return JSON.stringify(sizes);
}
