import { isSiteCopyImageKey } from "@/lib/site-copy-image-key";

/** Keys that must stay plain text (no rich formatting toolbar). */
const PLAIN_ONLY_PATTERNS = [
  /\.meta_title$/,
  /\.meta_description$/,
  /_url$/,
  /_href$/,
  /\.image_alt$/,
  /rotate_words$/,
  /search_placeholder$/,
  /menu_button$/,
  /^legal\./,
  /^global\.type\./,
  /^email\./,
];

export function isPlainOnlySiteCopyKey(key: string): boolean {
  return PLAIN_ONLY_PATTERNS.some((pattern) => pattern.test(key));
}

export function siteCopyEditorMode(
  key: string,
  format: "plain" | "html" | "mdx" | "choice",
): "plain" | "rich-inline" | "rich-block" | "mdx" | "choice" | "image" {
  if (format === "choice") return "choice";
  if (format === "mdx") return "mdx";
  if (format === "html") return "rich-block";
  if (isSiteCopyImageKey(key)) return "image";
  if (isPlainOnlySiteCopyKey(key)) return "plain";
  return "rich-inline";
}
