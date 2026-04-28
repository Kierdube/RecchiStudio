/** Soft wave divider inspired by the archived Elementor pattern divider. */
export function SectionWave({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`relative h-12 w-full text-[#19371E]/12 ${flip ? "rotate-180" : ""}`}
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 24C180 8 360 40 540 24C720 8 900 40 1080 24C1260 8 1350 32 1440 24V48H0V24Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
