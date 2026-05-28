"use client";

import { useCallback, useState } from "react";

import {
  canUploadViaCloudinaryClient,
  uploadImageToCloudinaryClient,
} from "@/lib/cloudinary-client-upload";

export function useAdminImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (files: FileList | File[]): Promise<string[]> => {
    const list = Array.from(files).filter((f) => f.size > 0);
    if (list.length === 0) return [];

    setUploading(true);
    setError(null);
    const urls: string[] = [];

    try {
      const useClientCloudinary = canUploadViaCloudinaryClient();

      for (const file of list) {
        if (useClientCloudinary) {
          urls.push(await uploadImageToCloudinaryClient(file));
          continue;
        }

        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload-image", { method: "POST", body });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          throw new Error(data.error ?? "Upload failed");
        }
        urls.push(data.url);
      }
      return urls;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      return [];
    } finally {
      setUploading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { uploadFiles, uploading, error, clearError };
}
