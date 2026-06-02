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
  size: string | null;
  quantity: number;
};

export type CartCheckoutItem = {
  productId: string;
  size?: string;
  quantity: number;
};

export function cartItemKey(productId: string, size: string | null | undefined): string {
  return `${productId}:${(size ?? "").trim()}`;
}

export function parseCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const out: CartItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const o = entry as Partial<CartItem>;
    if (
      typeof o.productId !== "string" ||
      typeof o.slug !== "string" ||
      typeof o.name !== "string" ||
      typeof o.priceCents !== "number" ||
      typeof o.quantity !== "number"
    ) {
      continue;
    }
    const size = o.size == null ? null : String(o.size);
    const key = cartItemKey(o.productId, size);
    out.push({
      key,
      productId: o.productId,
      slug: o.slug,
      name: o.name,
      priceCents: o.priceCents,
      imageUrl: typeof o.imageUrl === "string" ? o.imageUrl : null,
      size,
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
