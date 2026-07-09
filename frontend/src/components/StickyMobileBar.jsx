import React from "react";
import { ShoppingBag } from "lucide-react";
import { useFlavour } from "../context/FlavourContext";
import { useCart } from "../context/CartContext";

/**
 * StickyMobileBar — sticky add-to-cart bar on mobile only.
 * Bucks Sauce parity: always-visible add-to-cart on mobile.
 */
export default function StickyMobileBar() {
  const { active } = useFlavour();
  const { addItem } = useCart();

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[color:var(--pal-ink)]/95 backdrop-blur-md border-t border-cream/10 px-4 py-3 flex items-center gap-3"
      data-testid="sticky-mobile-bar"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img src={active.front} alt="" className="w-10 h-14 object-contain shrink-0" />
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.22em] font-display text-cream/60 truncate">
            {active.number}
          </div>
          <div className="font-display text-cream text-sm truncate">{active.name}</div>
        </div>
      </div>
      <div className="text-cream font-display">£{active.price.toFixed(2)}</div>
      <button
        onClick={() => addItem(active.id, 1)}
        className="btn-gold !px-4 !py-2 !text-[10px]"
        data-testid="sticky-add-btn"
      >
        <ShoppingBag size={14} /> Add
      </button>
    </div>
  );
}
