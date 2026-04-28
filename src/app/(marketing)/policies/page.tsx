import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarketingShell } from "@/components/MarketingShell";
import { MdxArticle } from "@/components/MdxArticle";
import { compileMdxFromString, loadMdxFromRoot } from "@/lib/load-mdx";
import { getSiteCopyRecord, siteCopyGet } from "@/lib/site-copy";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopyRecord();
  return {
    title: siteCopyGet(copy, "policies.meta_title"),
    description: siteCopyGet(copy, "policies.meta_description"),
  };
}

export default async function PoliciesPage() {
  const copy = await getSiteCopyRecord();
  const fromDb = siteCopyGet(copy, "legal.policies_mdx").trim();
  const { content } = fromDb
    ? await compileMdxFromString(fromDb)
    : await loadMdxFromRoot("content/policies.mdx");

  return (
    <MarketingShell wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Store policies" }]} />
      <MdxArticle>{content}</MdxArticle>
    </MarketingShell>
  );
}
