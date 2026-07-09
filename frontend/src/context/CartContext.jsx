import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { FLAVOURS } from "../data/flavours";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // {id, qty}
  const [open, setOpen] = useState(false);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);
  const toggleCart = useCallback(() => setOpen((o) => !o), []);

  const addItem = useCallback((id, qty = 1, unitPrice) => {
    setItems((prev) => {
      const existing = prev.find(
        (p) => p.id === id && (p.unitPrice ?? null) === (unitPrice ?? null)
      );
      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { id, qty, unitPrice }];
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((id, unitPrice) => {
    setItems((prev) =>
      prev.filter((p) => !(p.id === id && (p.unitPrice ?? null) === (unitPrice ?? null)))
    );
  }, []);

  const updateQty = useCallback((id, qty, unitPrice) => {
    setItems((prev) =>
      prev
        .map((p) =>
          p.id === id && (p.unitPrice ?? null) === (unitPrice ?? null)
            ? { ...p, qty: Math.max(0, qty) }
            : p
        )
        .filter((p) => p.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const detailed = useMemo(
    () =>
      items.map((it) => {
        const flavour = FLAVOURS[it.id];
        const unit = it.unitPrice ?? flavour?.price ?? 0;
        return {
          ...it,
          flavour,
          unit,
          lineTotal: unit * it.qty,
        };
      }),
    [items]
  );

  const totalCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
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
