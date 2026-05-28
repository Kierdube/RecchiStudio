import type { ImageStorageBackend } from "@/lib/image-storage/types";

export function createS3ImageStorage(): ImageStorageBackend {
  const bucket = process.env.S3_BUCKET?.trim();
  const region = process.env.S3_REGION?.trim() || "auto";
  const endpoint = process.env.S3_ENDPOINT?.trim();
  const accessKeyId = process.env.S3_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY?.trim();
  const publicBase = process.env.S3_PUBLIC_BASE_URL?.trim();

  if (!bucket || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing S3_BUCKET, S3_ACCESS_KEY_ID, or S3_SECRET_ACCESS_KEY");
  }

  return {
    id: "s3",
    async store(bytes, contentType, filename) {
      const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
      const key = `uploads/${filename}`;

      const client = new S3Client({
        region,
        endpoint: endpoint || undefined,
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: Boolean(endpoint),
      });

      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: bytes,
          ContentType: contentType,
        }),
      );

      const url = publicBase
        ? `${publicBase.replace(/\/$/, "")}/${key}`
        : endpoint
          ? `${endpoint.replace(/\/$/, "")}/${bucket}/${key}`
          : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

      return { url };
    },
  };
}
