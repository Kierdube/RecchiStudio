import { SiteCopyText } from "@/components/SiteCopyText";

export function PageIntro({
  eyebrow,
  title,
  description,
  eyebrowUppercase = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** When false, eyebrow keeps natural title case (e.g. “My Studio”). */
  eyebrowUppercase?: boolean;
}) {
  return (
    <header className="mb-10 sm:mb-12">
      {eyebrow ? (
        <p
          className={`recchi-eyebrow text-xs font-semibold tracking-[0.2em] text-[#2d5a36]/85 ${eyebrowUppercase ? "uppercase" : ""}`}
        >
          <SiteCopyText value={eyebrow} inline />
        </p>
      ) : null}
      <h1 className="recchi-page-title mt-3 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-[2.25rem] sm:leading-tight">
        <SiteCopyText value={title} inline />
      </h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#19371E]/76">
          <SiteCopyText value={description} inline />
        </p>
      ) : null}
    </header>
  );
}
