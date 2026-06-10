import { siteCopyGet } from "@/lib/site-copy";

/** Replace {placeholders} in admin-editable email strings. */
export function applyEmailTemplate(
  template: string,
  vars: Record<string, string | null | undefined>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    return value != null && value !== "" ? value : `{${key}}`;
  });
}

export function emailCopyGet(
  copy: Record<string, string>,
  key: string,
  fallback: string,
): string {
  const value = siteCopyGet(copy, key);
  return value.trim() || fallback;
}
