/** Marketing photo with shared frame styling (portrait or square). */
export function MarketingFramedImage({
  src,
  alt,
  aspect = "square",
}: {
  src: string;
  alt: string;
  /** `portrait` for homepage hero; `about` matches the about-page Figma frame (1288×2248, 80px radius). */
  aspect?: "square" | "portrait" | "about";
}) {
  const aspectClass =
    aspect === "about"
      ? "aspect-[1288/2248]"
      : aspect === "portrait"
        ? "aspect-[8/11]"
        : "aspect-square";
  const radiusClass = aspect === "about" ? "rounded-[80px]" : "rounded-[2rem]";

  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:justify-self-stretch">
      <div
        className={`overflow-hidden bg-gradient-to-b from-[#F4F9EF] to-[#E8F0DD] shadow-[0_28px_80px_-40px_rgba(25,55,30,0.45)] ring-1 ring-[#19371E]/10 ${radiusClass} ${aspectClass}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

export const MARKETING_IMAGE_GRID_CLASS =
  "grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-16";

/** Same grid as marketing hero, but top-aligned (better with portrait side images). */
export const MARKETING_IMAGE_GRID_START_CLASS =
  "grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-16";
