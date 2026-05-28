import Link from "next/link";

export const SITE_LOGO = {
  src: "/images/logo.png",
  width: 363,
  height: 204,
} as const;

type SiteLogoProps = {
  alt: string;
  className?: string;
  /** Omit or pass `null` when the logo sits inside another link. */
  href?: string | null;
  /** Light logo treatment for dark backgrounds (e.g. footer). */
  onDark?: boolean;
};

export function SiteLogo({
  alt,
  className = "h-10 w-auto sm:h-11",
  href = "/",
  onDark = false,
}: SiteLogoProps) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SITE_LOGO.src}
      alt={alt}
      width={SITE_LOGO.width}
      height={SITE_LOGO.height}
      className={[className, onDark ? "brightness-0 invert" : ""].filter(Boolean).join(" ")}
    />
  );

  if (!href) return img;

  return (
    <Link href={href} className="inline-block">
      {img}
    </Link>
  );
}
