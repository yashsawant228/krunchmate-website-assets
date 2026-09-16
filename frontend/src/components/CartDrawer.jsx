import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartFillWidget from "./cart/CartFillWidget";
import CartLineItem from "./cart/CartLineItem";
import CartEmptyState from "./cart/CartEmptyState";
import PreOrderForm from "./PreOrderForm";

/**
 * CartDrawer — recreates the "empty pouch → filled → checkout" progression.
 * Presentation is composed of small subcomponents (widget / line / empty state).
 */

const resolveStatus = (totalCount, fillLevel) => {
  if (totalCount === 0) return "Empty pouch";
  if (fillLevel >= 100) return "Ready for checkout";
  return "Filling with krunch";
};

const lineKey = (it) => `${it.id}|${it.unitPrice ?? "std"}`;

export default function CartDrawer() {
  const { open, closeCart, detailed, subtotal, updateQty, removeItem, fillLevel, totalCount, clear } =
    useCart();
  const [preorderOpen, setPreorderOpen] = useState(false);

  const status = resolveStatus(totalCount, fillLevel);

  const startPreorder = () => {
    setPreorderOpen(true);
  };

  const closePreorder = () => {
    // If the user just successfully reserved, clear the cart on close.
    setPreorderOpen(false);
    if (detailed.length > 0 && document.querySelector('[data-testid="preorder-success"]')) {
      clear();
      closeCart();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            data-testid="cart-drawer-backdrop"
          />
          <motion.aside
            key="drawer"
            className="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            data-testid="cart-drawer"
          >
            <header className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <div>
                <div className="product-no">Your Krunch</div>
                <h3 className="font-display text-2xl mt-1 text-cream">Cart</h3>
              </div>
              <button
                onClick={closeCart}
                className="text-cream hover:text-gold transition-colors"
                aria-label="Close cart"
                data-testid="cart-drawer-close"
              >
                <X size={22} />
              </button>
            </header>

            <CartFillWidget fillLevel={fillLevel} status={status} />

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {detailed.length === 0 ? (
                <CartEmptyState />
              ) : (
                <ul className="space-y-5">
                  {detailed.map((it) => (
                    <CartLineItem
                      key={lineKey(it)}
                      item={it}
                      onRemove={() => removeItem(it.id, it.unitPrice)}
                      onIncr={() => updateQty(it.id, it.qty + 1, it.unitPrice)}
                      onDecr={() => updateQty(it.id, it.qty - 1, it.unitPrice)}
                    />
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-white/10 px-6 pt-5 pb-6 space-y-4">
              <div className="flex items-center justify-between text-cream">
                <span className="uppercase tracking-[0.22em] text-xs">Subtotal</span>
                <span className="font-display text-xl" data-testid="cart-subtotal">
                  £{subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-cream/50 leading-relaxed">
                Pre-order now — pouches ship in the second week of October. No payment taken today.
              </p>
              <button
                disabled={detailed.length === 0}
                onClick={startPreorder}
                className="btn-gold w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="cart-checkout-btn"
              >
                Reserve my pre-order <ArrowRight size={16} />
              </button>
            </footer>
          </motion.aside>
          <PreOrderForm
            open={preorderOpen}
            onClose={closePreorder}
            cartItems={detailed.map((it) => ({ id: it.id, qty: it.qty }))}
            subtotal={subtotal}
          />
        </>
      )}
    </AnimatePresence>
  );
}
