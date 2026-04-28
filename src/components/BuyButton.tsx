"use client";

import { useState } from "react";

export function BuyButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No redirect URL returned");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onCheckout}
        disabled={loading}
        className="inline-flex min-h-12 min-w-[min(100%,220px)] touch-manipulation items-center justify-center rounded-full bg-[#C5E6A6] px-8 py-4 text-base font-semibold text-[#19371E] shadow-md shadow-[#19371E]/10 transition hover:bg-[#b3d992] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
      >
        {loading ? "Redirecting…" : "Buy now"}
      </button>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
