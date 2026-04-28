import Link from "next/link";

import {
  SHOP_CATEGORIES,
  SHOP_SORTS,
  shopHref,
  type ShopSearchState,
} from "@/lib/catalog";

function Pill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center rounded-full border px-3.5 py-2 text-sm font-medium transition touch-manipulation ${
        active
          ? "border-[#19371E] bg-[#19371E] text-[#C5E6A6] shadow-sm"
          : "border-[#19371E]/15 bg-white text-[#19371E] hover:border-[#19371E]/30 hover:bg-[#F4F9EF]"
      }`}
    >
      {children}
    </Link>
  );
}

type ToolbarProps = ShopSearchState & {
  resultCount: number;
  totalMatching: number;
  toolbarEyebrow?: string;
  searchPlaceholder?: string;
};

export function ShopToolbar(props: ToolbarProps) {
  const { resultCount, totalMatching, toolbarEyebrow = "Browse", searchPlaceholder, ...state } = props;
  const placeholder = searchPlaceholder ?? "Search by name or description…";
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2d5a36]/75">
          {toolbarEyebrow}
        </p>
        <p className="mt-2 text-sm text-[#19371E]/70">
          {totalMatching === 0
            ? "No products match these filters."
            : `Showing ${resultCount} of ${totalMatching} product${totalMatching === 1 ? "" : "s"}.`}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill href={shopHref(state, { category: undefined, page: 1 })} active={!state.category}>
            All
          </Pill>
          {SHOP_CATEGORIES.map((c) => (
            <Pill
              key={c.slug}
              href={shopHref(state, { category: c.slug, page: 1 })}
              active={state.category === c.slug}
            >
              {c.label}
            </Pill>
          ))}
        </div>
      </div>

      <form
        method="get"
        action="/catalog"
        className="grid min-w-0 gap-4 rounded-2xl border border-[#19371E]/10 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.02] sm:p-5 sm:grid-cols-2 lg:grid-cols-12 lg:items-end"
      >
        <input type="hidden" name="page" value="1" />
        <div className="sm:col-span-2 lg:col-span-4">
          <label htmlFor="shop-q" className="block text-xs font-semibold uppercase tracking-wide text-[#19371E]/55">
            Search
          </label>
          <input
            id="shop-q"
            name="q"
            type="search"
            defaultValue={state.q ?? ""}
            placeholder={placeholder}
            className="mt-1.5 min-h-11 w-full rounded-xl border border-[#19371E]/15 bg-[#FDFCF8] px-3 py-2.5 text-base text-[#19371E] outline-none ring-[#C5E6A6]/80 placeholder:text-[#19371E]/35 focus:border-[#19371E]/25 focus:ring-2"
          />
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="shop-category" className="block text-xs font-semibold uppercase tracking-wide text-[#19371E]/55">
            Category
          </label>
          <select
            id="shop-category"
            name="category"
            defaultValue={state.category ?? ""}
            className="mt-1.5 min-h-11 w-full rounded-xl border border-[#19371E]/15 bg-[#FDFCF8] px-3 py-2.5 text-base text-[#19371E] outline-none focus:border-[#19371E]/25 focus:ring-2 focus:ring-[#C5E6A6]/80"
          >
            <option value="">All categories</option>
            {SHOP_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="shop-sort" className="block text-xs font-semibold uppercase tracking-wide text-[#19371E]/55">
            Sort
          </label>
          <select
            id="shop-sort"
            name="sort"
            defaultValue={state.sort}
            className="mt-1.5 min-h-11 w-full rounded-xl border border-[#19371E]/15 bg-[#FDFCF8] px-3 py-2.5 text-base text-[#19371E] outline-none focus:border-[#19371E]/25 focus:ring-2 focus:ring-[#C5E6A6]/80"
          >
            {SHOP_SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="shop-min" className="block text-xs font-semibold uppercase tracking-wide text-[#19371E]/55">
            Min (USD $)
          </label>
          <input
            id="shop-min"
            name="min"
            type="number"
            min={0}
            step={1}
            defaultValue={state.minDollars ?? ""}
            placeholder="0"
            className="mt-1.5 min-h-11 w-full rounded-xl border border-[#19371E]/15 bg-[#FDFCF8] px-3 py-2.5 text-base text-[#19371E] outline-none focus:border-[#19371E]/25 focus:ring-2 focus:ring-[#C5E6A6]/80"
          />
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="shop-max" className="block text-xs font-semibold uppercase tracking-wide text-[#19371E]/55">
            Max (USD $)
          </label>
          <input
            id="shop-max"
            name="max"
            type="number"
            min={0}
            step={1}
            defaultValue={state.maxDollars ?? ""}
            placeholder="Any"
            className="mt-1.5 min-h-11 w-full rounded-xl border border-[#19371E]/15 bg-[#FDFCF8] px-3 py-2.5 text-base text-[#19371E] outline-none focus:border-[#19371E]/25 focus:ring-2 focus:ring-[#C5E6A6]/80"
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-12">
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#19371E] px-6 text-sm font-semibold text-[#C5E6A6] shadow-sm transition hover:bg-[#2d5a36]"
          >
            Apply filters
          </button>
          <Link
            href="/catalog"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#19371E]/15 bg-white px-5 text-sm font-semibold text-[#19371E] transition hover:bg-[#F4F9EF]"
          >
            Clear all
          </Link>
        </div>
      </form>
    </div>
  );
}
