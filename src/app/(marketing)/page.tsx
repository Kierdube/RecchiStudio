import Link from "next/link";

import { FeatureIcon } from "@/components/FeatureIcon";
import { ProductCard } from "@/components/ProductCard";
import { RotatingHeadline } from "@/components/RotatingHeadline";
import { SectionWave } from "@/components/SectionWave";
import { SiteCopyHtml } from "@/components/SiteCopyHtml";
import { primaryProductImage } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";
import { getSiteCopyRecord, parseRotatingWords, siteCopyGet } from "@/lib/site-copy";

const FEATURE_KINDS = ["cotton", "design", "nature"] as const;

export default async function HomePage() {
  const [products, copy] = await Promise.all([
    prisma.product.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    getSiteCopyRecord(),
  ]);

  const bannerUrl = siteCopyGet(copy, "home.banner.image_url");
  const bannerAlt = siteCopyGet(copy, "home.banner.image_alt");
  const heroImageUrl = siteCopyGet(copy, "home.hero.image_url").trim();
  const heroImageAlt = siteCopyGet(copy, "home.hero.image_alt");
  const showHeroImage = /^https?:\/\//i.test(heroImageUrl);

  return (
    <main>
      <section className="recchi-hero border-b border-[#19371E]/10 px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <div
            className={
              showHeroImage
                ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-16"
                : ""
            }
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d5a36]/90">
                {siteCopyGet(copy, "home.hero.eyebrow")}
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
              <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
                <Link
                  href="/catalog"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#19371E] px-7 text-sm font-semibold text-[#C5E6A6] shadow-md shadow-[#19371E]/20 transition hover:bg-[#2d5a36] hover:shadow-lg"
                >
                  {siteCopyGet(copy, "home.hero.cta_catalog")}
                </Link>
                <Link
                  href="/about"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#19371E]/18 bg-white/90 px-7 text-sm font-semibold text-[#19371E] shadow-sm backdrop-blur-sm transition hover:border-[#19371E]/28 hover:bg-white"
                >
                  {siteCopyGet(copy, "home.hero.cta_about")}
                </Link>
              </div>
            </div>
            {showHeroImage ? (
              <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:justify-self-stretch">
                <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#F4F9EF] to-[#E8F0DD] shadow-[0_28px_80px_-40px_rgba(25,55,30,0.45)] ring-1 ring-[#19371E]/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImageUrl}
                    alt={heroImageAlt}
                    className="aspect-[4/5] w-full object-cover sm:aspect-[3/4] lg:aspect-[4/5] lg:min-h-[min(100%,28rem)]"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2d5a36]/80">
              {siteCopyGet(copy, "home.collection.eyebrow")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-4xl">
              {siteCopyGet(copy, "home.collection.title")}
            </h2>
            <p className="mt-2 max-w-lg text-[#19371E]/72">{siteCopyGet(copy, "home.collection.blurb")}</p>
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
              html={siteCopyGet(copy, "home.collection.empty_html")}
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

      <section className="border-y border-[#19371E]/8 bg-[#F4F9EF]/60 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[2rem] ring-1 ring-[#19371E]/10 shadow-[0_24px_80px_-32px_rgba(25,55,30,0.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerUrl}
              alt={bannerAlt}
              className="aspect-[4/3] max-h-[min(70vw,420px)] w-full object-cover sm:aspect-[21/9] sm:max-h-[420px] md:aspect-[24/9]"
            />
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-28 px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2d5a36]/80">
              {siteCopyGet(copy, "home.story.eyebrow")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-4xl">
              {siteCopyGet(copy, "home.story.title")}
            </h2>
            <p className="mt-3 text-xl font-medium text-[#2d5a36]">{siteCopyGet(copy, "home.story.tagline")}</p>
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
                      {siteCopyGet(copy, `home.feature.${n}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#19371E]/70">
                      {siteCopyGet(copy, `home.feature.${n}.body`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#19371E]/8 bg-gradient-to-b from-[#FDFCF8] to-[#F4F9EF]/80 px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <p className="mx-auto max-w-2xl text-center text-lg font-medium leading-relaxed text-[#19371E]/88">
          {siteCopyGet(copy, "home.closing")}
        </p>
      </section>

      <div className="bg-[#F4F9EF]/80">
        <SectionWave />
      </div>
    </main>
  );
}
