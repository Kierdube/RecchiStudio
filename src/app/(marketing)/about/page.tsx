import type { Metadata } from "next";
import Link from "next/link";

import { AboutParrotDecoration } from "@/components/AboutParrotDecoration";
import { FeatureIcon } from "@/components/FeatureIcon";
import { MarketingFramedImage, MARKETING_IMAGE_GRID_START_CLASS } from "@/components/MarketingFramedImage";
import { SiteCopyText } from "@/components/SiteCopyText";
import { MarketingShell } from "@/components/MarketingShell";
import { PageIntro } from "@/components/PageIntro";
import { SiteCopyHtml } from "@/components/SiteCopyHtml";
import { getSiteCopyRecord, resolveSiteCopyImageUrl, siteCopyGet } from "@/lib/site-copy";

const FEATURE_KINDS = ["cotton", "design", "nature"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopyRecord();
  return {
    title: siteCopyGet(copy, "about.meta_title"),
    description: siteCopyGet(copy, "about.meta_description"),
  };
}

export default async function AboutPage() {
  const copy = await getSiteCopyRecord();
  const storyImageUrl = resolveSiteCopyImageUrl(siteCopyGet(copy, "about.body.image_url"));
  const storyImageAlt = siteCopyGet(copy, "about.body.image_alt");

  return (
    <MarketingShell heroBackground>
      <AboutParrotDecoration />
      <PageIntro
        eyebrow={siteCopyGet(copy, "about.intro.eyebrow")}
        title={siteCopyGet(copy, "about.intro.title")}
      />

      <div className={`mt-8 ${MARKETING_IMAGE_GRID_START_CLASS}`}>
        <div className="flex flex-col gap-6 text-base leading-relaxed text-[#19371E]/82">
          <p className="m-0">
            <SiteCopyText value={siteCopyGet(copy, "about.intro.description")} inline />
          </p>
          <SiteCopyHtml
            html={siteCopyGet(copy, "about.body_html")}
            className="flex flex-col gap-6 [&_p]:m-0"
          />
          <div>
            <Link
              href="/catalog"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#19371E] px-6 text-sm font-semibold text-[#C5E6A6] shadow-md transition hover:bg-[#2d5a36]"
            >
              {siteCopyGet(copy, "about.cta_catalog")}
            </Link>
          </div>
        </div>
        {storyImageUrl ? (
          <MarketingFramedImage src={storyImageUrl} alt={storyImageAlt} aspect="portrait" />
        ) : null}
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-3">
        {FEATURE_KINDS.map((kind, i) => {
          const n = i + 1;
          return (
            <li
              key={kind}
              className="flex flex-col items-center rounded-2xl border border-[#19371E]/10 bg-white/90 p-6 text-center shadow-sm ring-1 ring-black/[0.02] sm:items-start sm:text-left"
            >
              <FeatureIcon kind={kind} />
              <p className="mt-4 font-semibold text-[#19371E]">
                <SiteCopyText value={siteCopyGet(copy, `about.feature.${n}.title`)} inline />
              </p>
              <p className="mt-2 text-sm text-[#19371E]/70">
                <SiteCopyText value={siteCopyGet(copy, `about.feature.${n}.body`)} inline />
              </p>
            </li>
          );
        })}
      </ul>
    </MarketingShell>
  );
}
