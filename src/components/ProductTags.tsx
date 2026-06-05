import { tagColorClass, type ProductTag } from "@/lib/product-tags";

export function ProductTags({ tags }: { tags: ProductTag[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Product tags">
      {tags.map((tag, index) => (
        <li
          key={`${tag.label}-${tag.color}-${index}`}
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${tagColorClass(tag.color)}`}
        >
          {tag.label}
        </li>
      ))}
    </ul>
  );
}
