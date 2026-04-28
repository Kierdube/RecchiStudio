import Link from "next/link";
import { notFound } from "next/navigation";

import { BuyButton } from "@/components/BuyButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckoutCurrencyNote } from "@/components/CheckoutCurrencyNote";
import { DisplayPrice } from "@/components/DisplayPrice";
import { ProductCard } from "@/components/ProductCard";
import {
  type CategorySlug,
  categoryLabelForSlug,
  shopDefaultState,
  shopHref,
} from "@/lib/catalog";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { primaryProductImage } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";
import {
  plainTextFromProductDescriptionHtml,
  sanitizeProductDescriptionHtml,
} from "@/lib/sanitize-product-description";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.published) return { title: "Product" };
  const metaDesc = product.description
    ? plainTextFromProductDescriptionHtml(sanitizeProductDescriptionHtml(product.description)).slice(
        0,
        160,
      )
    : `${product.name} — Recchi Studio`;
  return {
    title: product.name,
    description: metaDesc || `${product.name} — Recchi Studio`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, published: true },
  });
  if (!product) notFound();

  const sameCategory = await prisma.product.findMany({
    where: {
      published: true,
      categorySlug: product.categorySlug,
      id: { not: product.id },
    },
    orderBy: { updatedAt: "desc" },
    take: 4,
  });

  let related = sameCategory;
  if (related.length < 4) {
    const exclude = new Set([product.id, ...related.map((p) => p.id)]);
    const more = await prisma.product.findMany({
      where: {
        published: true,
        id: { notIn: [...exclude] },
      },
      orderBy: { updatedAt: "desc" },
      take: 4 - related.length,
    });
    related = [...related, ...more];
  }

  const shopBase = shopDefaultState();
  const categoryLabel = categoryLabelForSlug(product.categorySlug);
  const categorySlugForFilter = (product.categorySlug?.trim() || "other") as CategorySlug;
  const categoryHref = shopHref(shopBase, {
    category: categorySlugForFilter,
    page: 1,
  });

  return (
    <main className="border-b border-[#19371E]/8 bg-gradient-to-b from-[#FDFCF8] via-white/30 to-[#F4F9EF]/45">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Catalog", href: "/catalog" },
            { label: product.name },
          ]}
        />

        <div className="mt-2 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#F4F9EF] to-[#E8F0DD] shadow-[0_28px_80px_-40px_rgba(25,55,30,0.45)] ring-1 ring-[#19371E]/10">
              <ProductImageGallery name={product.name} imageUrlsJson={product.imageUrls} />
            </div>
          </div>

          <div>
            {categoryLabel ? (
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={categoryHref}
                  className="inline-flex rounded-full border border-[#19371E]/12 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2d5a36] shadow-sm transition hover:border-[#19371E]/25 hover:bg-[#F4F9EF]"
                >
                  {categoryLabel}
                </Link>
              </div>
            ) : null}

            <h1
              className={`text-balance break-words text-3xl font-semibold tracking-tight text-[#19371E] sm:text-4xl lg:text-[2.5rem] lg:leading-tight ${categoryLabel ? "mt-5" : "mt-0"}`}
            >
              {product.name}
            </h1>
            <p className="mt-5 text-3xl font-semibold tabular-nums tracking-tight text-[#2d5a36]">
              <DisplayPrice usdCents={product.priceCents} />
            </p>

            {product.description ? (
              <div
                className="product-description-content mt-8 max-w-prose text-base leading-relaxed text-[#19371E]/80 [&_a]:font-medium [&_a]:text-[#2d5a36] [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[#2d5a36]/35 [&_blockquote]:pl-4 [&_blockquote]:text-[#19371E]/75 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#19371E] [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#19371E] [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_p:first-child]:mt-0 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
                dangerouslySetInnerHTML={{
                  __html: sanitizeProductDescriptionHtml(product.description),
                }}
              />
            ) : (
              <p className="mt-8 text-sm text-[#19371E]/50">Description coming soon.</p>
            )}

            <div className="mt-10">
              <BuyButton productId={product.id} />
              <CheckoutCurrencyNote />
              <p className="mt-4 text-xs leading-relaxed text-[#19371E]/50">
                Secure checkout with Stripe. You will be redirected to enter payment and see shipping
                options.
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20 border-t border-[#19371E]/10 pt-16">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2d5a36]/80">
                  You may also like
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#19371E]">Related styles</h2>
              </div>
              <Link
                href={categoryHref}
                className="text-sm font-semibold text-[#2d5a36] underline-offset-4 hover:underline"
              >
                More in {categoryLabel} →
              </Link>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  priceCents={p.priceCents}
                  imageUrl={primaryProductImage(p.imageUrls)}
                  categoryLabel={categoryLabelForSlug(p.categorySlug)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
