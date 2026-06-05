import type { ImageStorageBackend } from "@/lib/image-storage/types";
import {
  cloudinaryCloudName,
  cloudinaryUploadPreset,
} from "@/lib/cloudinary-env";

export function createCloudinaryImageStorage(): ImageStorageBackend {
  const cloudName = cloudinaryCloudName();
  const uploadPreset = cloudinaryUploadPreset();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName) {
    throw new Error("Missing CLOUDINARY_CLOUD_NAME");
  }

  return {
    id: "cloudinary",
    async store(bytes, contentType, filename) {
      const body = new FormData();
      body.append(
        "file",
        new Blob([Uint8Array.from(bytes)], { type: contentType }),
        filename,
      );

      if (uploadPreset) {
        body.append("upload_preset", uploadPreset);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body,
        });
        const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };
        if (!res.ok || !data.secure_url) {
          throw new Error(data.error?.message ?? "Cloudinary upload failed");
        }
        return { url: data.secure_url };
      }

      if (!apiKey || !apiSecret) {
        throw new Error(
          "Set CLOUDINARY_UPLOAD_PRESET (unsigned, free) or CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET",
        );
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const paramsToSign = `timestamp=${timestamp}${apiSecret}`;
      const encoder = new TextEncoder();
      const digest = await crypto.subtle.digest("SHA-1", encoder.encode(paramsToSign));
      const signature = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      body.append("api_key", apiKey);
      body.append("timestamp", String(timestamp));
      body.append("signature", signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body,
      });
      const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };
      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message ?? "Cloudinary upload failed");
      }
      return { url: data.secure_url };
    },
  };
}
