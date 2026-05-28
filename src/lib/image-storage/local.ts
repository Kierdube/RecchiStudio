import { mkdir, writeFile } from "fs/promises";
import path from "path";

import type { ImageStorageBackend } from "@/lib/image-storage/types";

export function createLocalImageStorage(): ImageStorageBackend {
  return {
    id: "local",
    async store(bytes, _contentType, filename) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      await writeFile(path.join(uploadsDir, filename), bytes);
      return { url: `/uploads/${filename}` };
    },
  };
}
