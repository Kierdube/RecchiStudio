import Link from "next/link";

export const SITE_LOGO = {
  src: "/images/logo.png",
  srcOnDark: "/images/logo-white.png",
  width: 363,
  height: 204,
} as const;

/** Shared header + footer logo height (75% of prior h-18 / sm:h-20). */
export const SITE_LOGO_SIZE_CLASS = "h-[3.375rem] w-auto shrink-0 sm:h-[3.75rem]";

type SiteLogoProps = {
  alt: string;
  className?: string;
  /** Omit or pass `null` when the logo sits inside another link. */
  href?: string | null;
  /** White logo asset for dark backgrounds (e.g. footer). */
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
      src={onDark ? SITE_LOGO.srcOnDark : SITE_LOGO.src}
      alt={alt}
      width={SITE_LOGO.width}
      height={SITE_LOGO.height}
      className={className}
    />
  );

  if (!href) return img;

  return (
    <Link href={href} className="inline-block">
      {img}
    </Link>
  );
}
