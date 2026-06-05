"use client";

import Link from "next/link";

import { useCart } from "@/contexts/CartContext";

function BagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 106.53 122.88" fill="currentColor" aria-hidden>
      <path d="M4.93 30.34h22.48v-4.58a25.77 25.77 0 0 1 51.53 0v4.58h22.66a4.91 4.91 0 0 1 4.91 4.94v69.9a17.75 17.75 0 0 1-17.7 17.7H17.7A17.75 17.75 0 0 1 0 105.18V35.28a4.91 4.91 0 0 1 4.92-4.94zm28.76 0h39v-4.58a19.49 19.49 0 0 0-39 0v4.58zm-6.28 13v-6.72H6.28v62h94V36.62H78.94v6.76a6.48 6.48 0 1 1-6.28-.12V36.62h-39v6.71a6.48 6.48 0 1 1-6.28 0z" />
    </svg>
  );
}

export function CartLink({ className }: { className?: string }) {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className={`relative inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-[#19371E]/15 bg-white text-[#19371E] shadow-sm transition hover:border-[#19371E]/25 hover:shadow touch-manipulation ${className ?? ""}`}
      aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
    >
      <BagIcon className="h-5 w-4 opacity-90" />
      {itemCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2d5a36] px-1 text-[10px] font-bold tabular-nums text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
