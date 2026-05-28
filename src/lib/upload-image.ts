import { randomUUID } from "crypto";

import { resolveImageStorageBackend } from "@/lib/image-storage";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Use a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > MAX_BYTES) {
    return "Image must be 8 MB or smaller.";
  }
  return null;
}

export async function storeUploadedImage(file: File): Promise<{ url: string }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const ext = EXT_BY_TYPE[file.type] ?? ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const backend = resolveImageStorageBackend();
  return backend.store(bytes, file.type, filename);
}

/** Accept HTTPS URLs or site paths served from /images or /uploads. */
export function sanitizeStoredImageUrl(raw: string): string {
  const value = raw.trim().slice(0, 2000);
  if (/^https?:\/\//i.test(value)) return value;
  if (/^\/(images|uploads)\/[\w./-]+$/.test(value)) return value;
  return "";
}
