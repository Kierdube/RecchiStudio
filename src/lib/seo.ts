import type { Metadata } from "next";

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = siteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function defaultOpenGraph(): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: "Recchi Studio",
    locale: "en_CA",
  };
}

export function productOpenGraph({
  title,
  description,
  slug,
  imageUrl,
}: {
  title: string;
  description: string;
  slug: string;
  imageUrl: string | null;
}): Metadata {
  const url = absoluteUrl(`/products/${slug}`);
  const images = imageUrl ? [{ url: imageUrl, alt: title }] : undefined;
  return {
    title,
    description,
    openGraph: {
      ...defaultOpenGraph(),
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
