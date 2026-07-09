import React from "react";

export default function CartEmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center" data-testid="cart-empty">
      <div className="font-beth text-4xl text-gold mb-3">so empty</div>
      <p className="text-cream/70 max-w-xs">
        Your pouch is waiting to be filled. Pick a flavour and let the krunching begin.
      </p>
    </div>
  );
}
