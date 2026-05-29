import { parseSizesJson } from "@/lib/product-sizes";

function sizesToText(sizesJson: string | null | undefined): string {
  return parseSizesJson(sizesJson).join("\n");
}

export function ProductSizesField({
  defaultSizesJson,
}: {
  defaultSizesJson?: string | null;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700" htmlFor="sizes">
        Sizes (optional)
      </label>
      <textarea
        id="sizes"
        name="sizes"
        rows={3}
        defaultValue={defaultSizesJson ? sizesToText(defaultSizesJson) : ""}
        placeholder={"XS\nS\nM\nL\nXL"}
        className="mt-1 min-h-[5rem] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
      />
      <p className="mt-1 text-xs text-zinc-500">
        One size per line or comma-separated (e.g. XS, S, M, L, XL). Shoppers must pick a size at
        checkout when sizes are set.
      </p>
    </div>
  );
}
