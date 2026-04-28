/**
 * Typographic wrapper for MDX/markdown rendered inside marketing pages.
 * Tune selectors as your MDX structure grows.
 */
export function MdxArticle({ children }: { children: React.ReactNode }) {
  return (
    <article
      className={[
        "mdx-content max-w-none",
        "text-base leading-relaxed text-[#19371E]/85",
        "[&_h1]:mb-4 [&_h1]:mt-2 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-[#19371E]",
        "[&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:border-b [&_h2]:border-[#19371E]/10 [&_h2]:pb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#19371E]",
        "[&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#19371E]",
        "[&_p]:mb-4 [&_p]:mt-0",
        "[&_ul]:mb-4 [&_ul]:mt-0 [&_ul]:list-inside [&_ul]:list-disc [&_ul]:space-y-2",
        "[&_ol]:mb-4 [&_ol]:mt-0 [&_ol]:list-inside [&_ol]:list-decimal [&_ol]:space-y-2",
        "[&_li]:pl-1",
        "[&_a]:font-medium [&_a]:text-[#2d5a36] [&_a]:underline-offset-2 hover:[&_a]:underline",
        "[&_strong]:font-semibold [&_strong]:text-[#19371E]",
        "[&_code]:break-words [&_code]:rounded [&_code]:bg-[#19371E]/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm",
        "[&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-[#19371E]/10 [&_pre]:bg-[#19371E]/[0.04] [&_pre]:p-3 [&_pre]:text-sm",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-[#C5E6A6] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#19371E]/75",
      ].join(" ")}
    >
      {children}
    </article>
  );
}
