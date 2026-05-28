import { createCloudinaryImageStorage } from "@/lib/image-storage/cloudinary";
import { createGcsImageStorage } from "@/lib/image-storage/gcs";
import { createLocalImageStorage } from "@/lib/image-storage/local";
import { createS3ImageStorage } from "@/lib/image-storage/s3";
import type { ImageStorageBackend } from "@/lib/image-storage/types";

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

/** Which backend to use. Auto-detects from env when unset. */
export function resolveImageStorageBackend(): ImageStorageBackend {
  const forced = env("IMAGE_STORAGE")?.toLowerCase();

  if (forced === "local") return createLocalImageStorage();
  if (forced === "cloudinary") return createCloudinaryImageStorage();
  if (forced === "gcs") return createGcsImageStorage();
  if (forced === "s3") return createS3ImageStorage();

  if (env("GCS_BUCKET") && env("GOOGLE_SERVICE_ACCOUNT_JSON")) {
    return createGcsImageStorage();
  }
  if (env("CLOUDINARY_CLOUD_NAME") && (env("CLOUDINARY_UPLOAD_PRESET") || env("CLOUDINARY_API_SECRET"))) {
    return createCloudinaryImageStorage();
  }
  if (env("S3_BUCKET") && env("S3_ACCESS_KEY_ID") && env("S3_SECRET_ACCESS_KEY")) {
    return createS3ImageStorage();
  }

  if (process.env.NODE_ENV === "development") {
    return createLocalImageStorage();
  }

  throw new Error(
    "Image uploads are not configured. Set GCS_BUCKET + GOOGLE_SERVICE_ACCOUNT_JSON (Google Cloud), " +
      "CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET (free Cloudinary), or S3_* for Cloudflare R2 / AWS.",
  );
}
