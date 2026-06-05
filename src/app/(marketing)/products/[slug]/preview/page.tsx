import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPageContent } from "@/components/ProductPageContent";
import { prisma } from "@/lib/prisma";
import { resolveProductSeo } from "@/lib/product-seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : undefined;
  if (!token) return { title: "Preview", robots: { index: false, follow: false } };

  const product = await prisma.product.findFirst({
    where: { slug, previewToken: token, published: false },
  });
  if (!product) return { title: "Preview", robots: { index: false, follow: false } };

  return {
    ...resolveProductSeo(product),
    robots: { index: false, follow: false },
  };
}

async function loadRelatedProducts(product: { id: string; categorySlug: string }) {
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

  return related;
}

export default async function ProductPreviewPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token.trim() : "";
  if (!token) notFound();

  const product = await prisma.product.findFirst({
    where: { slug, previewToken: token, published: false },
  });
  if (!product) notFound();

  const related = await loadRelatedProducts(product);

  return <ProductPageContent product={product} related={related} isPreview />;
}
