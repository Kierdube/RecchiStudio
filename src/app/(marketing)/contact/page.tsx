import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { MarketingShell } from "@/components/MarketingShell";
import { PageIntro } from "@/components/PageIntro";
import { SiteCopyHtml } from "@/components/SiteCopyHtml";
import { getSiteCopyRecord, siteCopyGet } from "@/lib/site-copy";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopyRecord();
  return {
    title: siteCopyGet(copy, "contact.meta_title"),
    description: siteCopyGet(copy, "contact.meta_description"),
  };
}

export default async function ContactPage() {
  const copy = await getSiteCopyRecord();
  const emailDisplay = siteCopyGet(copy, "contact.sidebar.email_display");
  const emailHref = siteCopyGet(copy, "contact.sidebar.email_href");

  return (
    <MarketingShell>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <PageIntro
        eyebrow={siteCopyGet(copy, "contact.intro.eyebrow")}
        title={siteCopyGet(copy, "contact.intro.title")}
        description={siteCopyGet(copy, "contact.intro.description")}
      />

      <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="space-y-6 rounded-2xl border border-[#19371E]/10 bg-white/90 p-6 shadow-sm ring-1 ring-black/[0.02] sm:p-8 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#19371E]/55">
            {siteCopyGet(copy, "contact.sidebar.direct_heading")}
          </h2>
          <p className="text-[#19371E]/80">
            <span className="block text-xs font-semibold uppercase tracking-wide text-[#19371E]/45">
              {siteCopyGet(copy, "contact.sidebar.email_label")}
            </span>
            <a
              className="mt-1 inline-block text-lg font-semibold text-[#2d5a36] underline-offset-4 hover:underline"
              href={emailHref}
            >
              {emailDisplay}
            </a>
          </p>
          <SiteCopyHtml
            html={siteCopyGet(copy, "contact.sidebar.note_html")}
            className="text-sm text-[#19371E]/60 [&_code]:rounded [&_code]:bg-[#19371E]/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs"
          />
        </div>

        <div className="rounded-2xl border border-[#19371E]/10 bg-[#F4F9EF]/60 p-6 ring-1 ring-[#19371E]/5 sm:p-8 lg:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#19371E]/55">
            {siteCopyGet(copy, "contact.form.heading")}
          </h2>
          <ContactForm />
        </div>
      </div>

      <SiteCopyHtml
        html={siteCopyGet(copy, "contact.footer_html")}
        className="mt-12 text-center text-sm text-[#19371E]/55 [&_a]:font-semibold [&_a]:text-[#2d5a36] [&_a]:underline-offset-2 hover:[&_a]:underline"
      />
    </MarketingShell>
  );
}
