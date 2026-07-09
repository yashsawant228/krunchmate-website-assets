import React from "react";
import { Plus, Minus } from "lucide-react";

/**
 * CartLineItem — one row in the cart drawer.
 * Kept as a small, pure presentation component so CartDrawer stays focused.
 */
export default function CartLineItem({ item, onRemove, onIncr, onDecr }) {
  const { flavour, qty, lineTotal, id } = item;
  return (
    <li className="flex gap-4 pb-4 border-b border-white/5" data-testid={`cart-item-${id}`}>
      <div
        className="w-20 h-24 rounded-xl overflow-hidden flex items-center justify-center"
        style={{ background: `radial-gradient(circle, ${flavour.colors[3]}, ${flavour.colors[0]})` }}
      >
        <img src={flavour.front} alt={flavour.name} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="product-no">{flavour.number}</div>
            <div className="font-display text-cream text-lg leading-tight mt-1">{flavour.name}</div>
          </div>
          <button
            onClick={onRemove}
            className="text-cream/60 hover:text-gold text-xs uppercase tracking-widest"
            data-testid={`cart-remove-${id}`}
          >
            Remove
          </button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 border border-white/20 rounded-full">
            <button
              onClick={onDecr}
              className="w-7 h-7 flex items-center justify-center text-cream hover:text-gold"
              data-testid={`cart-decr-${id}`}
            >
              <Minus size={13} />
            </button>
            <span className="text-cream min-w-[18px] text-center text-sm">{qty}</span>
            <button
              onClick={onIncr}
              className="w-7 h-7 flex items-center justify-center text-cream hover:text-gold"
              data-testid={`cart-incr-${id}`}
            >
              <Plus size={13} />
            </button>
          </div>
          <div className="text-cream font-display">£{lineTotal.toFixed(2)}</div>
        </div>
      </div>
    </li>
  );
}
