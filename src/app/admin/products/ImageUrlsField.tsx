"use client";

import { useMemo, useRef, useState } from "react";

import { useAdminImageUpload } from "@/components/admin/useAdminImageUpload";

function safeImageUrl(s: string): string | null {
  const t = s.trim();
  if (!t) return null;
  if (t.startsWith("/uploads/") || t.startsWith("/images/")) return t;
  try {
    const u = new URL(t);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

function linesToUrls(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

export function ImageUrlsField({
  defaultUrls,
  id = "imageUrls",
}: {
  /** Ordered list of URLs shown as one per line */
  defaultUrls?: string[];
  id?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initial = defaultUrls?.length ? defaultUrls.join("\n") : "";
  const [text, setText] = useState(initial);
  const [dragOver, setDragOver] = useState(false);
  const { uploadFiles, uploading, error, clearError } = useAdminImageUpload();
  const urls = useMemo(() => linesToUrls(text).map((u) => safeImageUrl(u)).filter(Boolean) as string[], [text]);

  async function handleFiles(files: FileList | File[] | null) {
    if (!files?.length || uploading) return;
    clearError();
    const uploaded = await uploadFiles(files);
    if (uploaded.length === 0) return;
    setText((prev) => {
      const existing = linesToUrls(prev);
      const merged = [...existing];
      for (const url of uploaded) {
        if (!merged.includes(url)) merged.push(url);
      }
      return merged.join("\n");
    });
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-700" htmlFor={id}>
        Product photos
      </label>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={[
          "flex min-h-[9rem] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition",
          dragOver
            ? "border-zinc-900 bg-zinc-100"
            : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100",
          uploading ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
      >
        <p className="text-sm font-medium text-zinc-800">
          {uploading ? "Uploading…" : "Drop images here"}
        </p>
        <p className="mt-1 text-xs text-zinc-500">or click to add files (multiple allowed)</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="sr-only"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input type="hidden" name={id} value={text} />
      <p className="text-xs text-zinc-500">
        First photo is used on catalog cards. Drag in more images anytime; order follows upload order.
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="mt-1 grid gap-2 sm:grid-cols-2">
        {urls.map((u, i) => (
          <PreviewThumb
            key={`${u}-${i}`}
            url={u}
            index={i}
            onRemove={() => {
              setText((prev) => {
                const lines = linesToUrls(prev);
                lines.splice(i, 1);
                return lines.join("\n");
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewThumb({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: () => void;
}) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-2 py-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
          {index === 0 ? "Card + checkout" : `Gallery ${index + 1}`}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold text-red-700 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
      {!broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="mx-auto max-h-48 w-full object-contain"
          onError={() => setBroken(true)}
        />
      ) : (
        <p className="p-3 text-center text-xs text-amber-800">
          Preview failed — image may still work on the storefront.
        </p>
      )}
    </div>
  );
}
