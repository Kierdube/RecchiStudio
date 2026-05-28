/** Curated Google Fonts — loaded via stylesheet when selected in admin. */

export type GoogleFontDefinition = {
  /** Google Fonts family id (for API URL). */
  id: string;
  label: string;
  cssFamily: string;
  category: "sans-serif" | "serif" | "display" | "handwriting";
  weights: readonly number[];
};

export const GOOGLE_FONT_CATALOG: readonly GoogleFontDefinition[] = [
  { id: "DM+Sans", label: "DM Sans", cssFamily: "'DM Sans', system-ui, sans-serif", category: "sans-serif", weights: [400, 500, 600, 700] },
  { id: "Lato", label: "Lato", cssFamily: "'Lato', system-ui, sans-serif", category: "sans-serif", weights: [400, 700] },
  { id: "Montserrat", label: "Montserrat", cssFamily: "'Montserrat', system-ui, sans-serif", category: "sans-serif", weights: [400, 500, 600, 700] },
  { id: "Open+Sans", label: "Open Sans", cssFamily: "'Open Sans', system-ui, sans-serif", category: "sans-serif", weights: [400, 600, 700] },
  { id: "Poppins", label: "Poppins", cssFamily: "'Poppins', system-ui, sans-serif", category: "sans-serif", weights: [400, 500, 600, 700] },
  { id: "Raleway", label: "Raleway", cssFamily: "'Raleway', system-ui, sans-serif", category: "sans-serif", weights: [400, 500, 600, 700] },
  { id: "Source+Sans+3", label: "Source Sans 3", cssFamily: "'Source Sans 3', system-ui, sans-serif", category: "sans-serif", weights: [400, 600, 700] },
  { id: "Nunito", label: "Nunito", cssFamily: "'Nunito', system-ui, sans-serif", category: "sans-serif", weights: [400, 600, 700] },
  { id: "Work+Sans", label: "Work Sans", cssFamily: "'Work Sans', system-ui, sans-serif", category: "sans-serif", weights: [400, 500, 600, 700] },
  { id: "Lora", label: "Lora", cssFamily: "'Lora', Georgia, serif", category: "serif", weights: [400, 500, 600, 700] },
  { id: "Merriweather", label: "Merriweather", cssFamily: "'Merriweather', Georgia, serif", category: "serif", weights: [400, 700] },
  { id: "Playfair+Display", label: "Playfair Display", cssFamily: "'Playfair Display', Georgia, serif", category: "serif", weights: [400, 500, 600, 700] },
  { id: "Libre+Baskerville", label: "Libre Baskerville", cssFamily: "'Libre Baskerville', Georgia, serif", category: "serif", weights: [400, 700] },
  { id: "Cormorant+Garamond", label: "Cormorant Garamond", cssFamily: "'Cormorant Garamond', Georgia, serif", category: "serif", weights: [400, 500, 600, 700] },
  { id: "Fraunces", label: "Fraunces", cssFamily: "'Fraunces', Georgia, serif", category: "serif", weights: [400, 600, 700] },
  { id: "Bebas+Neue", label: "Bebas Neue", cssFamily: "'Bebas Neue', system-ui, sans-serif", category: "display", weights: [400] },
  { id: "Oswald", label: "Oswald", cssFamily: "'Oswald', system-ui, sans-serif", category: "display", weights: [400, 500, 600, 700] },
  { id: "Caveat", label: "Caveat", cssFamily: "'Caveat', cursive", category: "handwriting", weights: [400, 500, 600, 700] },
  { id: "Dancing+Script", label: "Dancing Script", cssFamily: "'Dancing Script', cursive", category: "handwriting", weights: [400, 500, 600, 700] },
  { id: "Pacifico", label: "Pacifico", cssFamily: "'Pacifico', cursive", category: "handwriting", weights: [400] },
] as const;

const CSS_FAMILY_TO_GOOGLE = new Map(
  GOOGLE_FONT_CATALOG.map((font) => [font.cssFamily, font] as const),
);

const SYSTEM_FONT_OPTIONS = [
  { value: "inherit", label: "Default site font" },
  { value: "'Inter Tight', system-ui, sans-serif", label: "Inter Tight (site default)" },
  { value: "Georgia, 'Times New Roman', serif", label: "Georgia" },
  { value: "Arial, Helvetica, sans-serif", label: "Arial" },
  { value: "system-ui, sans-serif", label: "System UI" },
] as const;

const GOOGLE_FONT_OPTIONS = GOOGLE_FONT_CATALOG.map((font) => ({
  value: font.cssFamily,
  label: font.label,
}));

/** Dropdown options for global typography + rich text editor. */
export const FONT_FAMILY_OPTIONS: readonly { value: string; label: string }[] = [
  ...SYSTEM_FONT_OPTIONS,
  ...GOOGLE_FONT_OPTIONS,
];

export function googleFontForCssFamily(cssFamily: string): GoogleFontDefinition | undefined {
  const trimmed = cssFamily.trim();
  if (!trimmed || trimmed === "inherit") return undefined;
  return CSS_FAMILY_TO_GOOGLE.get(trimmed);
}

export function googleFontsForCssFamilies(cssFamilies: Iterable<string>): GoogleFontDefinition[] {
  const seen = new Set<string>();
  const out: GoogleFontDefinition[] = [];
  for (const family of cssFamilies) {
    const font = googleFontForCssFamily(family);
    if (!font || seen.has(font.id)) continue;
    seen.add(font.id);
    out.push(font);
  }
  return out;
}

/** Collect Google fonts referenced in site copy (global typography keys). */
export function googleFontsUsedInSiteCopy(copy: Record<string, string>): GoogleFontDefinition[] {
  const families: string[] = [];
  for (const [key, value] of Object.entries(copy)) {
    if (key.includes("font_family") && value.trim()) {
      families.push(value);
    }
  }
  return googleFontsForCssFamilies(families);
}

export function buildGoogleFontsStylesheetUrl(fonts: readonly GoogleFontDefinition[]): string | null {
  if (fonts.length === 0) return null;
  const params = fonts.map((font) => {
    const weights = font.weights.join(";");
    return `family=${font.id}:wght@${weights}`;
  });
  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`;
}
