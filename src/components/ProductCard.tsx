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
  const href = `/products/${slug}`;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-[#19371E]/8 bg-white shadow-[0_4px_12px_-2px_rgba(25,55,30,0.12)] ring-1 ring-black/[0.02] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-4px_rgba(25,55,30,0.28)]">
      <div className="aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#F4F9EF] to-[#E8F0DD]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#19371E]/35">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 px-5 pb-5 pt-4">
        {categoryLabel ? (
          <p className="text-[11px] font-semibold tracking-wide text-[#2d5a36]/75">
            {categoryLabel}
          </p>
        ) : null}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#19371E] group-hover:text-[#2d5a36]">
          {name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <DisplayPrice
            priceCents={priceCents}
            className="text-sm font-medium tabular-nums text-[#2d5a36]"
          />
          <span className="inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tracking-wide text-[#19371E]/50 transition group-hover:text-[#2d5a36]">
            View
          </span>
        </div>
      </div>
      <Link
        href={href}
        aria-label={`View ${name}`}
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d5a36]"
      />
    </article>
  );
}
