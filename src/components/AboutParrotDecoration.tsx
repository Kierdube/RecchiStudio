/**
 * Fixed corner accent for the About page — bird + branch perch, non-interactive.
 */
export function AboutParrotDecoration() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 top-[var(--site-header-offset)] z-30 hidden w-[3.75rem] overflow-hidden sm:block sm:w-[4.25rem] md:w-[4.75rem] lg:w-[5.25rem]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/about-parrot.png"
        alt=""
        width={216}
        height={477}
        className="h-auto w-full max-w-none translate-x-[8%] object-left-top"
        decoding="async"
      />
    </div>
  );
}
