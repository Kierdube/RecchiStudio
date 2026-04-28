import Link from "next/link";

import { SHOP_PAGE_SIZE, shopHref, type ShopSearchState } from "@/lib/catalog";

export function ShopPagination({
  state,
  total,
  page,
}: {
  state: ShopSearchState;
  total: number;
  page: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE));
  if (totalPages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  const window = 2;
  const pages: number[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - window && p <= page + window)) {
      pages.push(p);
    }
  }
  const compact: (number | "gap")[] = [];
  let last = 0;
  for (const p of pages) {
    if (last && p - last > 1) compact.push("gap");
    compact.push(p);
    last = p;
  }

  return (
    <nav
      className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#19371E]/10 pt-10 sm:flex-row"
      aria-label="Pagination"
    >
      <p className="text-sm text-[#19371E]/60">
        Page {page} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {prev ? (
          <Link
            href={shopHref(state, { page: prev })}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#19371E]/12 bg-white px-3 py-2 text-sm font-medium text-[#19371E] hover:bg-[#F4F9EF] touch-manipulation"
          >
            Previous
          </Link>
        ) : (
          <span className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm text-[#19371E]/35">
            Previous
          </span>
        )}
        {compact.map((item, i) =>
          item === "gap" ? (
            <span key={`g-${i}`} className="px-2 text-sm text-[#19371E]/40">
              …
            </span>
          ) : (
            <Link
              key={item}
              href={shopHref(state, { page: item })}
              className={`inline-flex min-h-11 min-w-[2.75rem] items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-semibold touch-manipulation ${
                item === page
                  ? "bg-[#19371E] text-[#C5E6A6]"
                  : "border border-transparent text-[#19371E] hover:bg-[#F4F9EF]"
              }`}
            >
              {item}
            </Link>
          ),
        )}
        {next ? (
          <Link
            href={shopHref(state, { page: next })}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#19371E]/12 bg-white px-3 py-2 text-sm font-medium text-[#19371E] hover:bg-[#F4F9EF] touch-manipulation"
          >
            Next
          </Link>
        ) : (
          <span className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm text-[#19371E]/35">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
