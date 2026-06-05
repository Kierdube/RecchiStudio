import {
  DEFAULT_OPTIONS_LABEL,
  MAX_OPTIONS_LABEL,
  MAX_PRODUCT_SIZES,
  parseOptionsLabel,
  parseSizesFromSheet,
  parseSizesJson,
  resolveOptionsLabel,
} from "@/lib/product-sizes";

export { DEFAULT_OPTIONS_LABEL };

export const MAX_PRODUCT_CUSTOM_FIELDS = 6;

export type ProductCustomField = {
  label: string;
  options: string[];
};

export type ProductOptionSelections = Record<string, string>;

function normalizeFieldLabel(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").slice(0, MAX_OPTIONS_LABEL);
}

function normalizeFieldOptions(raw: unknown): string[] {
  return parseSizesFromSheet(raw).slice(0, MAX_PRODUCT_SIZES);
}

export function parseCustomFieldsJson(json: string | null | undefined): ProductCustomField[] {
  if (!json?.trim()) return [];
  try {
    const raw = JSON.parse(json) as unknown;
    if (!Array.isArray(raw)) return [];
    const out: ProductCustomField[] = [];
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const label = normalizeFieldLabel(String((item as ProductCustomField).label ?? ""));
      const options = normalizeFieldOptions((item as ProductCustomField).options);
      if (options.length === 0) continue;
      out.push({
        label: label || DEFAULT_OPTIONS_LABEL,
        options,
      });
      if (out.length >= MAX_PRODUCT_CUSTOM_FIELDS) break;
    }
    return out;
  } catch {
    return [];
  }
}

export function serializeCustomFieldsJson(fields: ProductCustomField[]): string {
  return JSON.stringify(fields);
}

export function parseCustomFieldsFromFormField(raw: string): ProductCustomField[] {
  return parseCustomFieldsJson(raw.trim());
}

/** Resolve custom fields, falling back to legacy single size/optionsLabel columns. */
export function resolveProductCustomFields(product: {
  customFieldsJson?: string | null;
  sizesJson?: string | null;
  optionsLabel?: string | null;
}): ProductCustomField[] {
  const fromJson = parseCustomFieldsJson(product.customFieldsJson);
  if (fromJson.length > 0) return fromJson;

  const options = parseSizesJson(product.sizesJson);
  if (options.length === 0) return [];

  return [
    {
      label: resolveOptionsLabel(product.optionsLabel),
      options,
    },
  ];
}

/** Keep legacy columns in sync for imports and older code paths. */
export function legacyFieldsFromCustomFields(fields: ProductCustomField[]): {
  sizesJson: string;
  optionsLabel: string;
} {
  const first = fields[0];
  if (!first) {
    return { sizesJson: "[]", optionsLabel: "" };
  }
  const label = normalizeFieldLabel(first.label);
  return {
    sizesJson: JSON.stringify(first.options),
    optionsLabel: label === DEFAULT_OPTIONS_LABEL ? "" : label,
  };
}

export function formatOptionsSummary(selections: ProductOptionSelections): string {
  return Object.entries(selections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => `${label}: ${value}`)
    .join(" · ");
}

export function optionsCartKey(options: ProductOptionSelections | null | undefined): string {
  if (!options || Object.keys(options).length === 0) return "";
  return Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => `${label}=${value}`)
    .join("|");
}

export function initialOptionSelections(fields: ProductCustomField[]): ProductOptionSelections {
  const out: ProductOptionSelections = {};
  for (const field of fields) {
    out[field.label] = field.options[0] ?? "";
  }
  return out;
}

export function validateProductOptionSelections(
  fields: ProductCustomField[],
  selections: ProductOptionSelections | null | undefined,
): string | null {
  if (fields.length === 0) return null;
  for (const field of fields) {
    const value = selections?.[field.label]?.trim();
    if (!value) {
      return `Please select ${field.label.toLowerCase()}`;
    }
    if (!field.options.includes(value)) {
      return `Please select a valid ${field.label.toLowerCase()} for this item`;
    }
  }
  return null;
}

export function normalizeOptionSelections(
  fields: ProductCustomField[],
  selections: ProductOptionSelections | null | undefined,
): ProductOptionSelections | null {
  if (fields.length === 0) return null;
  const out: ProductOptionSelections = {};
  for (const field of fields) {
    const value = selections?.[field.label]?.trim();
    if (value && field.options.includes(value)) {
      out[field.label] = value;
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}

export function parseOptionSelectionsFromLegacySize(
  fields: ProductCustomField[],
  size: string | null | undefined,
): ProductOptionSelections | null {
  const trimmed = size?.trim();
  if (!trimmed) return null;
  if (fields.length === 1) {
    return { [fields[0]!.label]: trimmed };
  }
  return null;
}

export function fieldOptionsToText(options: string[]): string {
  return options.join("\n");
}

export function fieldOptionsFromText(raw: string): string[] {
  return normalizeFieldOptions(raw.split(/\r?\n/).join(","));
}

export function parseOptionsLabelField(raw: string): string {
  return parseOptionsLabel(raw);
}
