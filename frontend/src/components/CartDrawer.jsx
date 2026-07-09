import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFlavour } from "../context/FlavourContext";

/**
 * CartDrawer — recreates the "empty pouch → filled → checkout" progression.
 * The pouch icon fills with gold as the user adds items, mirroring the
 * Bucks Sauce empty-bottle-to-filled-to-checkout status widget.
 */
export default function CartDrawer() {
  const { open, closeCart, detailed, subtotal, updateQty, removeItem, fillLevel, totalCount } =
    useCart();
  // eslint-disable-next-line no-unused-vars
  const { active } = useFlavour();

  const status =
    totalCount === 0 ? "Empty pouch" : fillLevel >= 100 ? "Ready for checkout" : "Filling with krunch";

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
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
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
            </div>

            {/* Fill widget — empty pouch → filled → checkout */}
            <div className="px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-20 flex items-end justify-center overflow-hidden">
                  <svg viewBox="0 0 60 90" className="absolute inset-0 w-full h-full">
                    <defs>
                      <clipPath id="pouch-clip">
                        <path d="M12 8 L48 8 L48 16 L52 22 L52 82 Q52 88 46 88 L14 88 Q8 88 8 82 L8 22 L12 16 Z" />
                      </clipPath>
                    </defs>
                    <path
                      d="M12 8 L48 8 L48 16 L52 22 L52 82 Q52 88 46 88 L14 88 Q8 88 8 82 L8 22 L12 16 Z"
                      fill="none"
                      stroke="#FFFBE5"
                      strokeWidth="1.4"
                      opacity="0.5"
                    />
                    {/* Fill */}
                    <motion.rect
                      x="0"
                      width="60"
                      fill="#F6A81E"
                      clipPath="url(#pouch-clip)"
                      initial={false}
                      animate={{ y: 90 - (fillLevel * 0.8) }}
                      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                      height="90"
                    />
                    {/* Krunch dots overlay */}
                    <g clipPath="url(#pouch-clip)" opacity="0.7">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <circle
                          key={i}
                          cx={12 + (i * 4) % 40}
                          cy={90 - (fillLevel * 0.8) + (i % 4) * 5}
                          r="1.3"
                          fill="#FFFBE5"
                        />
                      ))}
                    </g>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-cream/60 font-display">
                    Status
                  </div>
                  <div className="font-display text-cream text-lg" data-testid="cart-fill-status">
                    {status}
                  </div>
                  <div className="pouch-fill-bar mt-2" style={{ "--fill": `${fillLevel}%` }} />
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {detailed.length === 0 ? (
                <div
                  className="h-full flex flex-col items-center justify-center text-center"
                  data-testid="cart-empty"
                >
                  <div className="font-beth text-4xl text-gold mb-3">so empty</div>
                  <p className="text-cream/70 max-w-xs">
                    Your pouch is waiting to be filled. Pick a flavour and let the krunching begin.
                  </p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {detailed.map((it) => (
                    <li
                      key={it.id}
                      className="flex gap-4 pb-4 border-b border-white/5"
                      data-testid={`cart-item-${it.id}`}
                    >
                      <div className="w-20 h-24 rounded-xl overflow-hidden flex items-center justify-center"
                        style={{ background: `radial-gradient(circle, ${it.flavour.colors[3]}, ${it.flavour.colors[0]})` }}
                      >
                        <img src={it.flavour.front} alt={it.flavour.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="product-no">{it.flavour.number}</div>
                            <div className="font-display text-cream text-lg leading-tight mt-1">
                              {it.flavour.name}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(it.id, it.unitPrice)}
                            className="text-cream/60 hover:text-gold text-xs uppercase tracking-widest"
                            data-testid={`cart-remove-${it.id}`}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 border border-white/20 rounded-full">
                            <button
                              onClick={() => updateQty(it.id, it.qty - 1, it.unitPrice)}
                              className="w-7 h-7 flex items-center justify-center text-cream hover:text-gold"
                              data-testid={`cart-decr-${it.id}`}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-cream min-w-[18px] text-center text-sm">{it.qty}</span>
                            <button
                              onClick={() => updateQty(it.id, it.qty + 1, it.unitPrice)}
                              className="w-7 h-7 flex items-center justify-center text-cream hover:text-gold"
                              data-testid={`cart-incr-${it.id}`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <div className="text-cream font-display">
                            £{it.lineTotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer / Checkout */}
            <div className="border-t border-white/10 px-6 pt-5 pb-6 space-y-4">
              <div className="flex items-center justify-between text-cream">
                <span className="uppercase tracking-[0.22em] text-xs">Subtotal</span>
                <span className="font-display text-xl" data-testid="cart-subtotal">£{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-cream/50 leading-relaxed">
                Free UK delivery over £15. Taxes calculated at checkout. Frontend showcase — no real
                payment is processed.
              </p>
              <button
                disabled={detailed.length === 0}
                className="btn-gold w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="cart-checkout-btn"
              >
                Checkout <ArrowRight size={16} />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
