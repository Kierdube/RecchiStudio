import { readFileSync } from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";

import { SITE_COPY_DEFINITIONS } from "../src/lib/site-copy-definitions";

const prisma = new PrismaClient();

function readOptionalFile(rel: string): string {
  try {
    return readFileSync(path.join(process.cwd(), rel), "utf8");
  } catch {
    return "";
  }
}

/** Inserts missing keys from files; existing rows keep their values (only label/format refresh). */
async function seedSiteCopy() {
  const policiesMdx = readOptionalFile("content/policies.mdx");
  const shippingMdx = readOptionalFile("content/shipping.mdx");

  for (const d of SITE_COPY_DEFINITIONS) {
    let initial = d.defaultValue;
    if (d.key === "legal.policies_mdx") initial = policiesMdx;
    if (d.key === "legal.shipping_mdx") initial = shippingMdx;

    await prisma.siteCopyBlock.upsert({
      where: { key: d.key },
      create: { key: d.key, label: d.label, format: d.format, value: initial },
      update: { label: d.label, format: d.format },
    });
  }
}

/** Names/slugs aligned with the Sept 2024 snapshot; imagery is stock for reliability. */
async function main() {
  const samples = [
    {
      name: "Abstract Pomegranate Crop Top",
      slug: "abstract-pomegranate-crop-top",
      categorySlug: "abstract" as const,
      description:
        "A bold abstract pomegranate print on a soft crop — statement colour, easy cotton comfort.",
      priceCents: 2900,
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
      ]),
      published: true,
    },
    {
      name: "Flamingo Uni Shorts",
      slug: "flamingo-uni-shorts",
      categorySlug: "flamingos" as const,
      description: "Easy shorts with a playful flamingo pattern — pair with tees from the collection.",
      priceCents: 3200,
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=80",
      ]),
      published: true,
    },
    {
      name: "Flamingo Tee",
      slug: "flamingo-tee",
      categorySlug: "birds" as const,
      description:
        "Soft cotton tee with a nature-inspired flamingo pattern. Express yourself with something cute and unique.",
      priceCents: 2800,
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
      ]),
      published: true,
    },
    {
      name: "Flamingo Crop Top",
      slug: "flamingo-crop-top",
      categorySlug: "birds" as const,
      description: "Crop top cut with the same joyful pattern language as the rest of the line.",
      priceCents: 2600,
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      ]),
      published: true,
    },
  ];

  for (const row of samples) {
    await prisma.product.upsert({
      where: { slug: row.slug },
      create: row,
      update: {
        name: row.name,
        description: row.description,
        priceCents: row.priceCents,
        imageUrls: row.imageUrls,
        published: row.published,
        categorySlug: row.categorySlug,
      },
    });
  }

  await seedSiteCopy();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
