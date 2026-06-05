import { parseSizesJson } from "@/lib/product-sizes";

function sizesToText(sizesJson: string | null | undefined): string {
  return parseSizesJson(sizesJson).join("\n");
}

export function ProductSizesField({
  defaultSizesJson,
  defaultOptionsLabel,
}: {
  defaultSizesJson?: string | null;
  defaultOptionsLabel?: string | null;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
      <div>
        <p className="text-sm font-medium text-zinc-700">Custom field (optional)</p>
        <p className="mt-1 text-xs text-zinc-500">
          Add a dropdown on the product page for shoppers to pick from your list — sizes, colours,
          styles, or anything else. Leave the options empty and nothing appears on the storefront.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="optionsLabel">
          Field label
        </label>
        <input
          id="optionsLabel"
          name="optionsLabel"
          type="text"
          defaultValue={defaultOptionsLabel ?? ""}
          placeholder="e.g. Size, Colour, Style"
          className="mt-1 min-h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Shown above the dropdown. Defaults to &ldquo;Option&rdquo; if left blank.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="sizes">
          Options
        </label>
        <textarea
          id="sizes"
          name="sizes"
          rows={3}
          defaultValue={defaultSizesJson ? sizesToText(defaultSizesJson) : ""}
          placeholder={"Small\nMedium\nLarge"}
          className="mt-1 min-h-[5rem] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
        <p className="mt-1 text-xs text-zinc-500">
          One option per line or comma-separated. Shoppers must pick one before adding to cart or
          checking out.
        </p>
      </div>
    </div>
  );
}
