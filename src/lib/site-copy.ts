import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { SITE_COPY_DEFINITIONS } from "@/lib/site-copy-definitions";

const DEFAULT_MAP: Record<string, string> = Object.fromEntries(
  SITE_COPY_DEFINITIONS.map((d) => [d.key, d.defaultValue]),
);

/** Merged defaults + database (DB wins when row exists). */
export const getSiteCopyRecord = cache(async (): Promise<Record<string, string>> => {
  const delegate = (prisma as unknown as { siteCopyBlock?: { findMany: () => Promise<{ key: string; value: string }[]> } })
    .siteCopyBlock;
  if (!delegate) {
    throw new Error(
      "Prisma client is out of date (missing SiteCopyBlock). Run `npx prisma generate`, then stop and restart the dev server (`npm run dev`).",
    );
  }
  const rows = await delegate.findMany();
  const map = { ...DEFAULT_MAP };
  for (const r of rows) {
    map[r.key] = r.value;
  }
  return map;
});

export function siteCopyGet(map: Record<string, string>, key: string): string {
  const v = map[key];
  if (v !== undefined && v !== "") return v;
  return DEFAULT_MAP[key] ?? "";
}

export function parseRotatingWords(raw: string): string[] {
  const words = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return words.length > 0 ? words : ["cute.", "elegant.", "unique.", "yourself."];
}
