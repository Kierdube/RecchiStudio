import { siteCopyGet } from "@/lib/site-copy";
import { buildGlobalTypographyCss } from "@/lib/global-typography";

/** Injects admin-configured typography for headings and body text. */
export function GlobalTypographyStyles({
  copy,
}: {
  copy: Record<string, string>;
}) {
  const css = buildGlobalTypographyCss((key) => siteCopyGet(copy, key));
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
