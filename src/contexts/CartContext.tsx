"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  CART_STORAGE_KEY,
  MAX_CART_LINE_QUANTITY,
  MAX_CART_LINES,
  cartItemCount,
  cartItemKey,
  cartSubtotalCents,
  parseCartItems,
  type CartItem,
} from "@/lib/cart";

type AddToCartInput = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  size?: string | null;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  addItem: (input: AddToCartInput) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  justAdded: boolean;
  clearJustAdded: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return parseCartItems(JSON.parse(raw));
  } catch {
    return [];
  }
}

function writeStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredCart(items);
  }, [items, hydrated]);

  const addItem = useCallback((input: AddToCartInput) => {
    const size = input.size?.trim() || null;
    const key = cartItemKey(input.productId, size);
    const qty = Math.min(
      MAX_CART_LINE_QUANTITY,
      Math.max(1, Math.floor(input.quantity ?? 1)),
    );

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.key === key);
      if (idx >= 0) {
        const next = [...prev];
        const line = next[idx]!;
        next[idx] = {
          ...line,
          priceCents: input.priceCents,
          name: input.name,
          slug: input.slug,
          imageUrl: input.imageUrl,
          quantity: Math.min(MAX_CART_LINE_QUANTITY, line.quantity + qty),
        };
        return next;
      }
      if (prev.length >= MAX_CART_LINES) return prev;
      return [
        ...prev,
        {
          key,
          productId: input.productId,
          slug: input.slug,
          name: input.name,
          priceCents: input.priceCents,
          imageUrl: input.imageUrl,
          size,
          quantity: qty,
        },
      ];
    });
    setJustAdded(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    const qty = Math.min(MAX_CART_LINE_QUANTITY, Math.max(1, Math.floor(quantity)));
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: qty } : i)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const clearJustAdded = useCallback(() => setJustAdded(false), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: cartItemCount(items),
      subtotalCents: cartSubtotalCents(items),
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      justAdded,
      clearJustAdded,
    }),
    [items, addItem, removeItem, setQuantity, clearCart, justAdded, clearJustAdded],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
