import { Readable } from "stream";

import { google } from "googleapis";

import { readGoogleServiceAccountJson } from "@/lib/google-service-account";
import type { ImageStorageBackend } from "@/lib/image-storage/types";

export function createGcsImageStorage(): ImageStorageBackend {
  const bucket = process.env.GCS_BUCKET?.trim();
  const publicBase = process.env.GCS_PUBLIC_BASE_URL?.trim();

  if (!bucket) {
    throw new Error("Missing GCS_BUCKET");
  }

  return {
    id: "gcs",
    async store(bytes, contentType, filename) {
      const { client_email, private_key } = readGoogleServiceAccountJson();
      const auth = new google.auth.JWT({
        email: client_email,
        key: private_key,
        scopes: ["https://www.googleapis.com/auth/devstorage.read_write"],
      });
      const storage = google.storage({ version: "v1", auth });
      const objectName = `uploads/${filename}`;

      await storage.objects.insert({
        bucket,
        name: objectName,
        media: {
          mimeType: contentType,
          body: Readable.from(bytes),
        },
      });

      const url = publicBase
        ? `${publicBase.replace(/\/$/, "")}/${objectName}`
        : `https://storage.googleapis.com/${bucket}/${objectName}`;

      return { url };
    },
  };
}
