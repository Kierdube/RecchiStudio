import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import {
  SHOP_PAGE_SIZE,
  categoryLabelForSlug,
  parseShopSearchParams,
  shopOrderByFromState,
  shopWhereFromState,
} from "@/lib/catalog";
import { primaryProductImage } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";
import { getSiteCopyRecord, siteCopyGet } from "@/lib/site-copy";

import { ShopPagination } from "./ShopPagination";
import { ShopToolbar } from "./ShopToolbar";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopyRecord();
  return {
    title: siteCopyGet(copy, "catalog.meta_title"),
    description: siteCopyGet(copy, "catalog.meta_description"),
  };
}

export default async function CatalogPage({ searchParams }: Props) {
  const raw = await searchParams;
  const state = parseShopSearchParams(raw);
  const where = shopWhereFromState(state);
  const orderBy = shopOrderByFromState(state);
  const copy = await getSiteCopyRecord();

  const totalMatching = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalMatching / SHOP_PAGE_SIZE));
  const page = Math.min(Math.max(1, state.page), totalPages);
  const skip = (page - 1) * SHOP_PAGE_SIZE;

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take: SHOP_PAGE_SIZE,
  });

  const stateForUi = { ...state, page };

  return (
    <main className="border-b border-[#19371E]/8 bg-gradient-to-b from-[#FDFCF8] to-[#F4F9EF]/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Catalog" }]} />
        <header className="mt-2 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2d5a36]/80">
            {siteCopyGet(copy, "catalog.header.eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-4xl">
            {siteCopyGet(copy, "catalog.header.title")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#19371E]/75">
            {siteCopyGet(copy, "catalog.header.blurb")}
          </p>
        </header>

        <div className="mt-12">
          <ShopToolbar
            {...stateForUi}
            resultCount={products.length}
            totalMatching={totalMatching}
            toolbarEyebrow={siteCopyGet(copy, "catalog.header.eyebrow")}
            searchPlaceholder={siteCopyGet(copy, "catalog.search_placeholder")}
          />
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#19371E]/20 bg-white/60 px-6 py-14 text-center sm:col-span-2 lg:col-span-3">
              <p className="text-lg font-medium text-[#19371E]">No products match</p>
              <p className="mt-2 text-sm text-[#19371E]/65">
                Try clearing search, widening the price range, or choosing a different category.
              </p>
            </div>
          ) : (
            products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                priceCents={p.priceCents}
                imageUrl={primaryProductImage(p.imageUrls)}
                categoryLabel={categoryLabelForSlug(p.categorySlug)}
              />
            ))
          )}
        </div>

        <ShopPagination state={stateForUi} total={totalMatching} page={page} />
      </div>
    </main>
  );
}
