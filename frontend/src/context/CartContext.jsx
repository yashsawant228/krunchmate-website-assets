import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { FLAVOURS } from "../data/flavours";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // {id, qty}
  const [open, setOpen] = useState(false);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);
  const toggleCart = useCallback(() => setOpen((o) => !o), []);

  const addItem = useCallback((id, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        return prev.map((p) =>
          p.id === id ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { id, qty }];
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(0, qty) } : p))
        .filter((p) => p.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  // Total count of all pouches in the cart across all flavours
  const totalCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  // Dynamic Mix & Match Tier Pricing calculation:
  // - 6+ total pouches: £10.00 / 6 (£1.67 per pouch)
  // - 3-5 total pouches: £6.00 / 3 (£2.00 per pouch)
  // - 1-2 total pouches: £2.50 per pouch
  const detailed = useMemo(
    () =>
      items.map((it) => {
        const flavour = FLAVOURS[it.id];
        let unit = flavour?.price ?? 2.50;

        if (totalCount >= 6) {
          unit = 10.0 / 6; // £1.67 per pouch (£10.00 for 6)
        } else if (totalCount >= 3) {
          unit = 2.0; // £2.00 per pouch (£6.00 for 3)
        }

        return {
          ...it,
          flavour,
          unit,
          unitPrice: unit,
          lineTotal: unit * it.qty,
        };
      }),
    [items, totalCount]
  );

  const subtotal = useMemo(
    () => detailed.reduce((s, i) => s + i.lineTotal, 0),
    [detailed]
  );

  // Fill level for the "empty pouch → filled → checkout" widget.
  // 0 items → 0%, 6+ items → 100%.
  const fillLevel = Math.min(100, Math.round((totalCount / 6) * 100));

  const value = {
    items,
    detailed,
    totalCount,
    subtotal,
    fillLevel,
    open,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    updateQty,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};