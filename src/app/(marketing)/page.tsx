import type { Metadata } from "next";
import Link from "next/link";

import { FeatureIcon } from "@/components/FeatureIcon";
import { MarketingFramedImage, MARKETING_IMAGE_GRID_START_CLASS } from "@/components/MarketingFramedImage";
import { ProductCard } from "@/components/ProductCard";
import { RotatingHeadline } from "@/components/RotatingHeadline";
import { SectionWave } from "@/components/SectionWave";
import { SiteCopyHtml } from "@/components/SiteCopyHtml";
import { SiteCopyText } from "@/components/SiteCopyText";
import { primaryProductImage } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";
import { getSiteCopyRecord, parseRotatingWords, resolveSiteCopyImageUrl, siteCopyGet } from "@/lib/site-copy";

const FEATURE_KINDS = ["cotton", "design", "nature"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopyRecord();
  return {
    title: siteCopyGet(copy, "home.meta_title"),
    description: siteCopyGet(copy, "home.meta_description"),
    openGraph: {
      title: siteCopyGet(copy, "home.meta_title"),
      description: siteCopyGet(copy, "home.meta_description"),
    },
  };
}

export default async function HomePage() {
  const [products, copy] = await Promise.all([
    prisma.product.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    getSiteCopyRecord(),
  ]);

  const bannerUrl = resolveSiteCopyImageUrl(siteCopyGet(copy, "home.banner.image_url"));
  const bannerAlt = siteCopyGet(copy, "home.banner.image_alt");
  const heroImageUrl = resolveSiteCopyImageUrl(siteCopyGet(copy, "home.hero.image_url"));
  const heroImageAlt = siteCopyGet(copy, "home.hero.image_alt");
  const homeCollectionEmptyHtmlRaw = siteCopyGet(copy, "home.collection.empty_html");
  const homeCollectionEmptyHtml =
    /sign in to the admin|npm run db:seed|prisma studio/i.test(homeCollectionEmptyHtmlRaw)
      ? "<p>No products are available right now. Please check back soon.</p>"
      : homeCollectionEmptyHtmlRaw;
  const closingImageUrl = resolveSiteCopyImageUrl(siteCopyGet(copy, "home.closing.image_url"));
  const closingImageAlt = siteCopyGet(copy, "home.closing.image_alt");

  return (
    <main>
      <section className="recchi-hero border-b border-[#19371E]/10 px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <div
            className={
              heroImageUrl ? MARKETING_IMAGE_GRID_START_CLASS : ""
            }
          >
            <div className="min-w-0">
              <p className="recchi-eyebrow text-xs font-semibold tracking-[0.2em] text-[#2d5a36]/90">
                <SiteCopyText value={siteCopyGet(copy, "home.hero.eyebrow")} inline />
              </p>
              <div className="mt-4 max-w-3xl">
                <RotatingHeadline
                  key={siteCopyGet(copy, "home.hero.rotate_words")}
                  prefix={siteCopyGet(copy, "home.hero.rotate_prefix")}
                  words={parseRotatingWords(siteCopyGet(copy, "home.hero.rotate_words"))}
                />
              </div>
              <SiteCopyHtml
                html={siteCopyGet(copy, "home.hero.body_html")}
                className="mt-8 max-w-xl text-lg leading-relaxed text-[#19371E]/82 [&_p]:m-0"
              />
              <div className="mt-10">
                <Link
                  href="/catalog"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#19371E] px-7 text-sm font-semibold text-[#C5E6A6] shadow-md shadow-[#19371E]/20 transition hover:bg-[#2d5a36] hover:shadow-lg"
                >
                  {siteCopyGet(copy, "home.hero.cta_catalog")}
                </Link>
              </div>
            </div>
            {heroImageUrl ? (
              <MarketingFramedImage src={heroImageUrl} alt={heroImageAlt} aspect="portrait" />
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#2d5a36]/80">
              <SiteCopyText value={siteCopyGet(copy, "home.collection.eyebrow")} inline />
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-4xl">
              <SiteCopyText value={siteCopyGet(copy, "home.collection.title")} inline />
            </h2>
            <p className="mt-2 max-w-lg text-[#19371E]/72">
              <SiteCopyText value={siteCopyGet(copy, "home.collection.blurb")} inline />
            </p>
          </div>
          <Link
            href="/catalog"
            className="mt-2 inline-flex text-sm font-semibold text-[#2d5a36] underline-offset-4 hover:underline sm:mt-0"
          >
            {siteCopyGet(copy, "home.collection.cta_view_all")}
          </Link>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.length === 0 ? (
            <SiteCopyHtml
              html={homeCollectionEmptyHtml}
              className="text-[#19371E]/70 sm:col-span-2 lg:col-span-3 [&_code]:rounded-md [&_code]:bg-[#19371E]/10 [&_code]:px-2 [&_code]:py-1 [&_code]:text-sm"
            />
          ) : (
            products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                priceCents={p.priceCents}
                imageUrl={primaryProductImage(p.imageUrls)}
              />
            ))
          )}
        </div>
      </section>

      <section className="border-y border-[#19371E]/8 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          {bannerUrl ? (
            <div className="overflow-hidden rounded-[2rem] ring-1 ring-[#19371E]/10 shadow-[0_24px_80px_-32px_rgba(25,55,30,0.35)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bannerUrl}
                alt={bannerAlt}
                className="aspect-[4/3] max-h-[min(70vw,420px)] w-full object-cover sm:aspect-[21/9] sm:max-h-[420px] md:aspect-[24/9]"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section id="about" className="scroll-mt-28 px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#2d5a36]/80">
              <SiteCopyText value={siteCopyGet(copy, "home.story.eyebrow")} inline />
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-4xl">
              <SiteCopyText value={siteCopyGet(copy, "home.story.title")} inline />
            </h2>
            <p className="mt-3 text-xl font-medium text-[#2d5a36]">
              <SiteCopyText value={siteCopyGet(copy, "home.story.tagline")} inline />
            </p>
            <SiteCopyHtml
              html={siteCopyGet(copy, "home.story.body_html")}
              className="mt-5 max-w-prose leading-relaxed text-[#19371E]/80 [&_p]:my-3 [&_p:first-child]:mt-0"
            />
          </div>
          <div className="grid gap-5">
            {FEATURE_KINDS.map((kind, i) => {
              const n = i + 1;
              return (
                <div
                  key={kind}
                  className="flex flex-col items-center gap-5 rounded-3xl bg-white/90 p-6 text-center shadow-sm ring-1 ring-[#19371E]/8 sm:flex-row sm:items-start sm:text-left"
                >
                  <FeatureIcon kind={kind} />
                  <div>
                    <h3 className="text-base font-semibold text-[#19371E]">
                      <SiteCopyText value={siteCopyGet(copy, `home.feature.${n}.title`)} inline />
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#19371E]/70">
                      <SiteCopyText value={siteCopyGet(copy, `home.feature.${n}.body`)} inline />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#19371E]/8 px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-row items-center justify-center gap-5 sm:gap-8">
          {closingImageUrl ? (
            <div className="w-full max-w-[8.75rem] shrink-0 sm:max-w-[9.5rem]">
              <MarketingFramedImage src={closingImageUrl} alt={closingImageAlt} aspect="square" />
            </div>
          ) : null}
          <p className="max-w-md text-base leading-relaxed text-[#19371E]/82 sm:text-lg">
            <SiteCopyText value={siteCopyGet(copy, "home.closing")} inline />
          </p>
        </div>
      </section>

      <div className="bg-background">
        <SectionWave />
      </div>
    </main>
  );
}
