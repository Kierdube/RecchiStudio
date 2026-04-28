export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-10 sm:mb-12">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d5a36]/85">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-[2.25rem] sm:leading-tight">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#19371E]/76">{description}</p>
      ) : null}
    </header>
  );
}
