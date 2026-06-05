import {
  formatOptionsSummary,
  optionsCartKey,
  type ProductOptionSelections,
} from "@/lib/product-custom-fields";

export const CART_STORAGE_KEY = "rs_cart_v1";

export const MAX_CART_LINE_QUANTITY = 99;
export const MAX_CART_LINES = 20;

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  /** Formatted summary for display and order records, e.g. "Size: M · Colour: Forest". */
  size: string | null;
  options: ProductOptionSelections | null;
  quantity: number;
};

export type CartCheckoutItem = {
  productId: string;
  options?: ProductOptionSelections;
  /** Legacy single-option checkout payloads. */
  size?: string;
  quantity: number;
};

export function cartItemKey(
  productId: string,
  options: ProductOptionSelections | null | undefined,
): string {
  return `${productId}:${optionsCartKey(options)}`;
}

function parseOptionsRaw(raw: unknown): ProductOptionSelections | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out: ProductOptionSelections = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim();
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}

export function parseCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const out: CartItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const o = entry as Partial<CartItem> & { options?: unknown };
    if (
      typeof o.productId !== "string" ||
      typeof o.slug !== "string" ||
      typeof o.name !== "string" ||
      typeof o.priceCents !== "number" ||
      typeof o.quantity !== "number"
    ) {
      continue;
    }

    let options = parseOptionsRaw(o.options);
    let size = o.size == null ? null : String(o.size).trim() || null;

    if (!options && size) {
      options = { Option: size };
      size = formatOptionsSummary(options);
    } else if (options) {
      size = formatOptionsSummary(options);
    }

    const key = cartItemKey(o.productId, options);
    out.push({
      key,
      productId: o.productId,
      slug: o.slug,
      name: o.name,
      priceCents: o.priceCents,
      imageUrl: typeof o.imageUrl === "string" ? o.imageUrl : null,
      size,
      options,
      quantity: Math.min(MAX_CART_LINE_QUANTITY, Math.max(1, Math.floor(o.quantity))),
    });
  }
  return out.slice(0, MAX_CART_LINES);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}

export type OrderLineItem = {
  productId: string | null;
  productName: string;
  productSlug: string | null;
  size: string | null;
  quantity: number;
  amountCents: number;
};

export function parseOrderLineItems(json: string | null | undefined): OrderLineItem[] {
  if (!json?.trim()) return [];
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is OrderLineItem => {
        return (
          x != null &&
          typeof x === "object" &&
          typeof (x as OrderLineItem).productName === "string" &&
          typeof (x as OrderLineItem).quantity === "number" &&
          typeof (x as OrderLineItem).amountCents === "number"
        );
      })
      .slice(0, MAX_CART_LINES);
  } catch {
    return [];
  }
}

export function serializeOrderLineItems(items: OrderLineItem[]): string {
  return JSON.stringify(items);
}
