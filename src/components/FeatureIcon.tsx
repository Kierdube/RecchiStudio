import { Leaf, Shirt, Sparkles } from "lucide-react";

type Kind = "cotton" | "design" | "nature";

const icons = {
  cotton: Shirt,
  design: Sparkles,
  nature: Leaf,
} as const;

export function FeatureIcon({ kind, className }: { kind: Kind; className?: string }) {
  const Icon = icons[kind];
  return (
    <span
      className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C5E6A6]/35 to-[#19371E]/[0.07] text-[#2d5a36] ring-1 ring-[#19371E]/10 ${className ?? ""}`}
    >
      <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
    </span>
  );
}
