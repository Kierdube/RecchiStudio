/**
 * Shared inner-page frame: same horizontal gutter as header/footer/catalog (`max-w-6xl` + `px-4` / `sm:px-6`).
 * Use `wide` for long MDX so prose stays a comfortable measure inside that frame.
 */
export function MarketingShell({
  children,
  wide,
}: {
  children: React.ReactNode;
  /** Narrower inner column for policies / long-form MDX (still uses site gutters outside). */
  wide?: boolean;
}) {
  return (
    <main className="border-b border-[#19371E]/8 bg-gradient-to-b from-[#FDFCF8] via-white/40 to-[#F4F9EF]/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        {wide ? (
          <div className="mx-auto w-full max-w-3xl lg:max-w-4xl">{children}</div>
        ) : (
          children
        )}
      </div>
    </main>
  );
}
