import Link from "next/link";

import { DisplayPrice } from "@/components/DisplayPrice";

export type ProductCardProps = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string | null;
  /** When set (e.g. on catalog grid), shows a small collection pill */
  categoryLabel?: string;
};

export function ProductCard({
  name,
  slug,
  priceCents,
  imageUrl,
  categoryLabel,
}: ProductCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-[#19371E]/8 bg-white shadow-[0_12px_40px_-24px_rgba(25,55,30,0.35)] ring-1 ring-black/[0.02] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(25,55,30,0.45)]">
      <Link
        href={`/products/${slug}`}
        className="block aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#F4F9EF] to-[#E8F0DD]"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#19371E]/35">
            No image
          </div>
        )}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#19371E]/25 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      </Link>
      <div className="flex flex-col gap-1 px-5 pb-5 pt-4">
        {categoryLabel ? (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#2d5a36]/75">
            {categoryLabel}
          </p>
        ) : null}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#19371E]">
          <Link href={`/products/${slug}`} className="hover:text-[#2d5a36]">
            {name}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2">
          <DisplayPrice
            usdCents={priceCents}
            className="text-sm font-medium tabular-nums text-[#2d5a36]"
          />
          <Link
            href={`/products/${slug}`}
            className="inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold uppercase tracking-wide text-[#19371E]/50 transition touch-manipulation group-hover:text-[#2d5a36]"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
