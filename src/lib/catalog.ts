import { Prisma } from "@prisma/client";

export const SHOP_CATEGORIES = [
  { slug: "birds", label: "Birds" },
  { slug: "flamingos", label: "Flamingos" },
  { slug: "cats", label: "Cats" },
  { slug: "abstract", label: "Abstract" },
  { slug: "other", label: "Other" },
] as const;

export type CategorySlug = (typeof SHOP_CATEGORIES)[number]["slug"];

const CATEGORY_SET = new Set<string>(SHOP_CATEGORIES.map((c) => c.slug));

export function categoryLabelForSlug(slug: string | null | undefined): string {
  const s = (slug ?? "").trim();
  if (!s) return "Other";
  return SHOP_CATEGORIES.find((c) => c.slug === s)?.label ?? s;
}

const SORT_VALUES = ["newest", "price-asc", "price-desc", "name-asc", "name-desc"] as const;

export type ShopSort = (typeof SORT_VALUES)[number];

export const SHOP_SORTS: { value: ShopSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" },
];

export const SHOP_PAGE_SIZE = 12;

export type ShopSearchState = {
  q?: string;
  category?: CategorySlug;
  sort: ShopSort;
  minDollars?: number;
  maxDollars?: number;
  page: number;
};

/** Baseline for building `/catalog` links from other parts of the site */
export const shopDefaultState = (): ShopSearchState => ({ sort: "newest", page: 1 });

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function parsePositiveInt(v: string | undefined, fallback: number, max: number) {
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, max);
}

function parseOptionalDollars(v: string | undefined): number | undefined {
  if (v === undefined || v === "") return undefined;
  const n = Number.parseFloat(v);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

export function parseShopSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ShopSearchState {
  const qRaw = first(raw.q)?.trim().slice(0, 120);
  const q = qRaw && qRaw.length > 0 ? qRaw : undefined;

  const catRaw = first(raw.category);
  const category =
    catRaw && CATEGORY_SET.has(catRaw) ? (catRaw as CategorySlug) : undefined;

  const sortRaw = first(raw.sort);
  const sort = SORT_VALUES.includes(sortRaw as ShopSort)
    ? (sortRaw as ShopSort)
    : "newest";

  let minDollars = parseOptionalDollars(first(raw.min));
  let maxDollars = parseOptionalDollars(first(raw.max));
  if (minDollars !== undefined && maxDollars !== undefined && minDollars > maxDollars) {
    const t = minDollars;
    minDollars = maxDollars;
    maxDollars = t;
  }

  const page = parsePositiveInt(first(raw.page), 1, 10_000);

  return {
    q,
    category,
    sort,
    minDollars,
    maxDollars,
    page,
  };
}

function dollarsToCents(d: number) {
  return Math.round(d * 100);
}

export function shopWhereFromState(state: ShopSearchState): Prisma.ProductWhereInput {
  const clauses: Prisma.ProductWhereInput[] = [{ published: true }];

  if (state.category) {
    clauses.push({ categorySlug: state.category });
  }

  if (state.q) {
    const term = state.q;
    clauses.push({
      OR: [
        { name: { contains: term } },
        { description: { contains: term } },
      ],
    });
  }

  const minC =
    state.minDollars !== undefined ? dollarsToCents(state.minDollars) : undefined;
  const maxC =
    state.maxDollars !== undefined ? dollarsToCents(state.maxDollars) : undefined;

  if (minC !== undefined || maxC !== undefined) {
    const price: Prisma.IntFilter = {};
    if (minC !== undefined) price.gte = minC;
    if (maxC !== undefined) price.lte = maxC;
    clauses.push({ priceCents: price });
  }

  if (clauses.length === 1) return clauses[0] as Prisma.ProductWhereInput;
  return { AND: clauses };
}

export function shopOrderByFromState(state: ShopSearchState): Prisma.ProductOrderByWithRelationInput[] {
  switch (state.sort) {
    case "price-asc":
      return [{ priceCents: "asc" }, { name: "asc" }];
    case "price-desc":
      return [{ priceCents: "desc" }, { name: "asc" }];
    case "name-asc":
      return [{ name: "asc" }];
    case "name-desc":
      return [{ name: "desc" }];
    case "newest":
    default:
      return [{ updatedAt: "desc" }, { name: "asc" }];
  }
}

export function shopStateToQuery(state: ShopSearchState, overrides?: Partial<ShopSearchState>): string {
  const merged: ShopSearchState = { ...state, ...overrides };
  const sp = new URLSearchParams();

  if (merged.q) sp.set("q", merged.q);
  if (merged.category) sp.set("category", merged.category);
  if (merged.sort !== "newest") sp.set("sort", merged.sort);
  if (merged.minDollars !== undefined && merged.minDollars > 0) {
    sp.set("min", String(merged.minDollars));
  }
  if (merged.maxDollars !== undefined && merged.maxDollars > 0) {
    sp.set("max", String(merged.maxDollars));
  }
  if (merged.page > 1) sp.set("page", String(merged.page));

  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function shopHref(state: ShopSearchState, overrides?: Partial<ShopSearchState>): string {
  return `/catalog${shopStateToQuery(state, overrides)}`;
}
