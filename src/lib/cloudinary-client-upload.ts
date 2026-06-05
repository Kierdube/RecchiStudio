/** Browser-only direct upload to Cloudinary (free tier, no Vercel storage). */
import {
  cloudinaryCloudName,
  cloudinaryUploadPreset,
} from "@/lib/cloudinary-env";

export function canUploadViaCloudinaryClient(): boolean {
  return Boolean(cloudinaryCloudName() && cloudinaryUploadPreset());
}

export async function uploadImageToCloudinaryClient(file: File): Promise<string> {
  const cloudName = cloudinaryCloudName();
  const uploadPreset = cloudinaryUploadPreset();
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary is not configured for client uploads.");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message ?? "Cloudinary upload failed");
  }
  return data.secure_url;
}
