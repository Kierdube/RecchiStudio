/**
 * Fixed corner accent for the About page — bird + branch perch, non-interactive.
 */
export function AboutParrotDecoration() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 top-[var(--site-header-offset)] z-30 hidden w-[7.5rem] overflow-hidden sm:block sm:w-[8.5rem] md:w-[9.5rem] lg:w-[10.5rem]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/about-parrot.png"
        alt=""
        width={431}
        height={953}
        className="h-auto w-full max-w-none translate-x-[8%] object-left-top"
        decoding="async"
      />
    </div>
  );
}
