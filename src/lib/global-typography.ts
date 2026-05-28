import { FONT_FAMILY_OPTIONS } from "@/lib/google-fonts";

export type TypographyLevel = "h1" | "h2" | "h3" | "p" | "eyebrow";

export { FONT_FAMILY_OPTIONS };

export const TYPOGRAPHY_LEVELS: {
  level: TypographyLevel;
  label: string;
  selector: string;
}[] = [
  { level: "h1", label: "Main page titles", selector: "[data-recchi-content] h1, [data-recchi-content] .recchi-page-title" },
  { level: "h2", label: "Section headings", selector: "[data-recchi-content] h2" },
  { level: "h3", label: "Subheadings", selector: "[data-recchi-content] h3" },
  { level: "p", label: "Paragraphs", selector: "[data-recchi-content] p" },
  { level: "eyebrow", label: "Small labels (eyebrows)", selector: "[data-recchi-content] .recchi-eyebrow" },
];

export const FONT_SIZE_OPTIONS = [
  { value: "inherit", label: "Default" },
  { value: "0.75rem", label: "Extra small" },
  { value: "0.875rem", label: "Small" },
  { value: "1rem", label: "Medium" },
  { value: "1.125rem", label: "Large" },
  { value: "1.25rem", label: "Extra large" },
  { value: "1.5rem", label: "2× large" },
  { value: "2rem", label: "3× large" },
  { value: "2.25rem", label: "4× large" },
  { value: "3rem", label: "5× large" },
] as const;

export const FONT_WEIGHT_OPTIONS = [
  { value: "inherit", label: "Default" },
  { value: "400", label: "Normal" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semibold" },
  { value: "700", label: "Bold" },
] as const;

export const FONT_STYLE_OPTIONS = [
  { value: "inherit", label: "Default" },
  { value: "normal", label: "Normal" },
  { value: "italic", label: "Italic" },
] as const;

export const TEXT_DECORATION_OPTIONS = [
  { value: "inherit", label: "Default" },
  { value: "none", label: "None" },
  { value: "underline", label: "Underline" },
  { value: "line-through", label: "Strikethrough" },
] as const;

export function globalTypographyKey(
  level: TypographyLevel,
  prop: "font_family" | "font_size" | "font_weight" | "font_style" | "text_decoration",
): string {
  return `global.type.${level}.${prop}`;
}

const DEFAULT_TYPOGRAPHY: Record<string, string> = {
  "global.type.h1.font_family": "inherit",
  "global.type.h1.font_size": "inherit",
  "global.type.h1.font_weight": "inherit",
  "global.type.h1.font_style": "inherit",
  "global.type.h1.text_decoration": "inherit",
  "global.type.h2.font_family": "inherit",
  "global.type.h2.font_size": "inherit",
  "global.type.h2.font_weight": "inherit",
  "global.type.h2.font_style": "inherit",
  "global.type.h2.text_decoration": "inherit",
  "global.type.h3.font_family": "inherit",
  "global.type.h3.font_size": "inherit",
  "global.type.h3.font_weight": "inherit",
  "global.type.h3.font_style": "inherit",
  "global.type.h3.text_decoration": "inherit",
  "global.type.p.font_family": "inherit",
  "global.type.p.font_size": "inherit",
  "global.type.p.font_weight": "inherit",
  "global.type.p.font_style": "inherit",
  "global.type.p.text_decoration": "inherit",
  "global.type.eyebrow.font_family": "inherit",
  "global.type.eyebrow.font_size": "inherit",
  "global.type.eyebrow.font_weight": "inherit",
  "global.type.eyebrow.font_style": "inherit",
  "global.type.eyebrow.text_decoration": "inherit",
};

function cssProp(value: string, cssName: string): string | null {
  const v = value.trim();
  if (!v || v === "inherit") return null;
  return `${cssName}: ${v};`;
}

export function buildGlobalTypographyCss(get: (key: string) => string): string {
  const rules: string[] = [];

  for (const { level, selector } of TYPOGRAPHY_LEVELS) {
    const decls = [
      cssProp(get(globalTypographyKey(level, "font_family")), "font-family"),
      cssProp(get(globalTypographyKey(level, "font_size")), "font-size"),
      cssProp(get(globalTypographyKey(level, "font_weight")), "font-weight"),
      cssProp(get(globalTypographyKey(level, "font_style")), "font-style"),
      cssProp(get(globalTypographyKey(level, "text_decoration")), "text-decoration"),
    ].filter(Boolean);

    if (decls.length > 0) {
      rules.push(`${selector} { ${decls.join(" ")} }`);
    }
  }

  return rules.join("\n");
}

export function globalTypographyDefaults(): Record<string, string> {
  return { ...DEFAULT_TYPOGRAPHY };
}

export function globalTypographyDefinitions(): {
  group: string;
  key: string;
  label: string;
  options: readonly { value: string; label: string }[];
}[] {
  const defs: {
    group: string;
    key: string;
    label: string;
    options: readonly { value: string; label: string }[];
  }[] = [];

  for (const { level, label } of TYPOGRAPHY_LEVELS) {
    const group = `Global styles — ${label}`;
    defs.push(
      {
        group,
        key: globalTypographyKey(level, "font_family"),
        label: "Font",
        options: FONT_FAMILY_OPTIONS,
      },
      {
        group,
        key: globalTypographyKey(level, "font_size"),
        label: "Size",
        options: FONT_SIZE_OPTIONS,
      },
      {
        group,
        key: globalTypographyKey(level, "font_weight"),
        label: "Weight",
        options: FONT_WEIGHT_OPTIONS,
      },
      {
        group,
        key: globalTypographyKey(level, "font_style"),
        label: "Style",
        options: FONT_STYLE_OPTIONS,
      },
      {
        group,
        key: globalTypographyKey(level, "text_decoration"),
        label: "Decoration",
        options: TEXT_DECORATION_OPTIONS,
      },
    );
  }

  return defs;
}
