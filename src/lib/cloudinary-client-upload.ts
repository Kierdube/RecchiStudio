/** Browser-only direct upload to Cloudinary (free tier, no Vercel storage). */
export function canUploadViaCloudinaryClient(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim(),
  );
}

export async function uploadImageToCloudinaryClient(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
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
