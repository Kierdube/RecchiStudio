function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

export function cloudinaryCloudName(): string | undefined {
  return env("CLOUDINARY_CLOUD_NAME") ?? env("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
}

export function cloudinaryUploadPreset(): string | undefined {
  return env("CLOUDINARY_UPLOAD_PRESET") ?? env("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
}

export function isCloudinaryUploadConfigured(): boolean {
  const cloudName = cloudinaryCloudName();
  const preset = cloudinaryUploadPreset();
  const apiSecret = env("CLOUDINARY_API_SECRET");
  return Boolean(cloudName && (preset || apiSecret));
}
