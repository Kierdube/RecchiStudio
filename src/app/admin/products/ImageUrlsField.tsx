"use client";

import { useMemo, useState } from "react";

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
  const initial = defaultUrls?.length ? defaultUrls.join("\n") : "";
  const [text, setText] = useState(initial);
  const urls = useMemo(() => linesToUrls(text).map((u) => safeImageUrl(u)).filter(Boolean) as string[], [text]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-700" htmlFor={id}>
        Photos — image URLs
      </label>
      <textarea
        id={id}
        name="imageUrls"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder={"https://example.com/photo-1.jpg\nhttps://example.com/photo-2.jpg"}
        className="mt-1 min-h-[10rem] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
      />
      <p className="text-xs text-zinc-500">
        One HTTPS URL per line. First photo is used on catalog cards. The product page shows every
        photo with thumbnails when there is more than one.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {urls.map((u, i) => (
          <PreviewThumb key={`${u}-${i}`} url={u} index={i} />
        ))}
      </div>
    </div>
  );
}

function PreviewThumb({ url, index }: { url: string; index: number }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
      <p className="border-b border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        {index === 0 ? "Card + checkout" : `Gallery ${index + 1}`}
      </p>
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
          Preview failed — URL may still work on the storefront.
        </p>
      )}
    </div>
  );
}
