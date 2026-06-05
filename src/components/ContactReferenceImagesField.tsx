"use client";

import { useMemo, useRef, useState } from "react";

import {
  canUploadViaCloudinaryClient,
  uploadImageToCloudinaryClient,
} from "@/lib/cloudinary-client-upload";

function safeImageUrl(s: string): string | null {
  const t = s.trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function ContactReferenceImagesField() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urls = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const line of text.split(/\r?\n/)) {
      const url = safeImageUrl(line);
      if (!url || seen.has(url)) continue;
      seen.add(url);
      out.push(url);
    }
    return out.slice(0, 10);
  }, [text]);

  async function handleFiles(files: FileList | File[] | null) {
    if (!files?.length || uploading) return;
    if (!canUploadViaCloudinaryClient()) {
      setError("Image upload is not configured. Paste image URLs instead.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadImageToCloudinaryClient(file));
      }
      setText((prev) => {
        const lines = prev
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        for (const url of uploaded) {
          if (!lines.includes(url)) lines.push(url);
        }
        return lines.slice(0, 10).join("\n");
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="referenceImagesJson"
        className="block text-xs font-semibold tracking-wide text-[#19371E]/50"
      >
        Reference images (optional)
      </label>
      <p className="text-xs text-[#19371E]/45">
        Upload inspiration photos or paste image URLs — one per line, up to 10.
      </p>
      <textarea
        id="referenceImagesJson"
        name="referenceImagesJson"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="https://…"
        className="mt-1 min-h-[5rem] w-full resize-y rounded-xl border border-[#19371E]/15 bg-white px-3 py-2.5 text-base text-[#19371E] outline-none ring-[#C5E6A6]/80 focus:border-[#19371E]/25 focus:ring-2"
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="min-h-10 rounded-full border border-[#19371E]/15 bg-white px-4 text-sm font-medium text-[#19371E] hover:bg-[#F4F9EF] disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        {urls.length > 0 ? (
          <span className="text-xs text-[#19371E]/50">{urls.length} image(s) attached</span>
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
