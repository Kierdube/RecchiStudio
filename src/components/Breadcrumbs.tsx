import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#19371E]/55">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? (
              <span className="select-none text-[#19371E]/25" aria-hidden>
                /
              </span>
            ) : null}
            {c.href ? (
              <Link
                href={c.href}
                className="font-medium text-[#2d5a36] transition hover:text-[#19371E] hover:underline"
              >
                {c.label}
              </Link>
            ) : (
              <span className="min-w-0 max-w-[min(100%,16rem)] truncate font-semibold text-[#19371E] sm:max-w-[28rem] md:max-w-none">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
