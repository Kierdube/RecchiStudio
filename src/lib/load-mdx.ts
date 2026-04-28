import { readFile } from "node:fs/promises";
import path from "node:path";

import { compileMDX } from "next-mdx-remote/rsc";

export async function loadMdxFromRoot(relativeToProjectRoot: string) {
  const filePath = path.join(/* turbopackIgnore: true */ process.cwd(), relativeToProjectRoot);
  const source = await readFile(filePath, "utf8");
  return compileMdxFromString(source);
}

export async function compileMdxFromString(source: string) {
  return compileMDX({
    source,
    options: { parseFrontmatter: true },
  });
}
