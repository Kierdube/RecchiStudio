import type { Metadata } from "next";

import { CartContents } from "@/components/CartContents";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your Recchi Studio cart before checkout.",
};

export default function CartPage() {
  return (
    <main className="border-b border-[#19371E]/8">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#2d5a36]/80">
            Shopping
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-4xl">
            Your cart
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#19371E]/75">
            Review your items, adjust options and quantities, then proceed to secure checkout.
          </p>
        </header>
        <div className="mt-12">
          <CartContents />
        </div>
      </div>
    </main>
  );
}
