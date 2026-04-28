/** Parse stored JSON text into a list of image URLs (order preserved). */
export function productImageUrls(imageUrls: string | null | undefined): string[] {
  if (imageUrls == null || imageUrls.trim() === "") return [];
  try {
    const parsed: unknown = JSON.parse(imageUrls);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  } catch {
    return [];
  }
}

export function primaryProductImage(imageUrls: string | null | undefined): string | null {
  const list = productImageUrls(imageUrls);
  return list[0] ?? null;
}

export function serializeImageUrls(urls: string[]): string {
  return JSON.stringify(urls);
}
