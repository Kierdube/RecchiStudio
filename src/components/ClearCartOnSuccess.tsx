"use client";

import { useEffect } from "react";

import { useCart } from "@/contexts/CartContext";

/** Clears the browser cart after a successful Stripe redirect. */
export function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
