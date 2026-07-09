import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingBag, RotateCw } from "lucide-react";
import { FLAVOUR_LIST } from "../data/flavours";
import { useCart } from "../context/CartContext";
import { useFlavour } from "../context/FlavourContext";
import PouchViewer from "../components/PouchViewer";

const PACK_OPTIONS = [
  { qty: 1, label: "Single pouch", subtitle: "Try before you commit" },
  { qty: 3, label: "3-pack", subtitle: "Save 5%" },
  { qty: 6, label: "6-pack", subtitle: "Save 10% · Free UK delivery" },
];

function ShopCard({ flavour }) {
  const { addItem } = useCart();
  const { setFlavour } = useFlavour();
  const [packIdx, setPackIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const pack = PACK_OPTIONS[packIdx];
  const DISCOUNTS = { 3: 0.95, 6: 0.9 };
  const unitDiscount = DISCOUNTS[pack.qty] ?? 1;
  const totalPouches = pack.qty * qty;
  const lineTotal = flavour.price * totalPouches * unitDiscount;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="relative rounded-3xl overflow-hidden grain"
      style={{
        background: `linear-gradient(160deg, ${flavour.colors[0]} 0%, ${flavour.colors[2]} 70%, ${flavour.colors[3]} 130%)`,
      }}
      data-testid={`shop-card-${flavour.id}`}
      onMouseEnter={() => setFlavour(flavour.id)}
    >
      <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Pouch viewer */}
        <div className="flex items-center justify-center relative min-h-[420px]">
          <PouchViewer flavour={flavour} size="md" />
          <div
            className="absolute top-2 left-2 flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] uppercase tracking-[0.22em] font-display"
            style={{ borderColor: "rgba(255,251,229,0.35)", color: "#FFFBE5" }}
          >
            <RotateCw size={10} /> Drag to rotate
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col" style={{ color: "#FFFBE5" }}>
          <div className="product-no" style={{ color: "#FFFBE5", opacity: 0.7 }}>
            {flavour.number}
          </div>
          <h2 className="font-display text-4xl lg:text-5xl mt-1">{flavour.name}</h2>
          <div className="font-beth text-2xl mt-1" style={{ color: "#F6A81E" }}>
            {flavour.tagline}
          </div>

          <p className="mt-5 leading-relaxed opacity-90">{flavour.long}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {flavour.claims.map((c) => (
              <span
                key={c}
                className="text-[10px] uppercase tracking-[0.22em] font-display px-3 py-1 rounded-full border"
                style={{ borderColor: "rgba(255,251,229,0.35)" }}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Multi-pack */}
          <div className="mt-6">
            <div className="text-[10px] uppercase tracking-[0.22em] font-display opacity-80 mb-3">
              Multi-pack
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PACK_OPTIONS.map((p, i) => (
                <button
                  key={p.qty}
                  onClick={() => setPackIdx(i)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    i === packIdx
                      ? "border-[#F6A81E] bg-[#F6A81E]/10"
                      : "border-white/25 hover:border-[#F6A81E]/60"
                  }`}
                  data-testid={`shop-pack-${flavour.id}-${p.qty}`}
                >
                  <div className="font-display text-lg leading-none">{p.qty}×</div>
                  <div className="text-[10px] mt-2 uppercase tracking-widest opacity-70">
                    {p.label}
                  </div>
                  <div className="text-[10px] opacity-60 mt-1">{p.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2 border border-white/25 rounded-full px-2 py-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 flex items-center justify-center hover:text-[color:var(--gold)]"
                data-testid={`shop-qty-decr-${flavour.id}`}
              >
                <Minus size={14} />
              </button>
              <span className="min-w-[24px] text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 flex items-center justify-center hover:text-[color:var(--gold)]"
                data-testid={`shop-qty-incr-${flavour.id}`}
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="font-display text-3xl">£{lineTotal.toFixed(2)}</div>
          </div>

          <button
            onClick={() => {
              const effectiveUnit = +(flavour.price * unitDiscount).toFixed(2);
              addItem(flavour.id, totalPouches, effectiveUnit);
            }}
            className="mt-6 btn-gold self-start"
            data-testid={`shop-add-${flavour.id}`}
          >
            <ShoppingBag size={14} /> Add {totalPouches} pouch{totalPouches > 1 ? "es" : ""}
          </button>

          {/* Nutrition */}
          <div className="mt-8 pt-6 border-t border-white/15">
            <div className="text-[10px] uppercase tracking-[0.22em] font-display opacity-80 mb-3">
              Nutrition (per 100g)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm opacity-90">
              {flavour.nutrition.map((n) => (
                <div key={n.label} className="flex justify-between border-b border-white/10 py-1">
                  <span>{n.label}</span>
                  <span className="font-display">{n.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Shop() {
  return (
    <div className="pt-32 pb-28 px-5 lg:px-10" data-testid="shop-page">
      <div className="container-x">
        <div className="max-w-3xl mb-14">
          <div className="product-no mb-3">PAGE N0. 02</div>
          <h1 className="h-hero font-display text-cream leading-[0.94]">
            The full<br />
            <span className="font-beth text-[color:var(--gold)] normal-case italic">krunch catalogue.</span>
          </h1>
          <p className="mt-6 max-w-lg text-cream/75 leading-relaxed">
            Two flavours. Every angle. Rotate the pouches, pick your pack size, and fill your basket
            with confidence. UK-wide delivery in 24–48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:gap-10">
          {FLAVOUR_LIST.map((f) => (
            <ShopCard key={f.id} flavour={f} />
          ))}
        </div>
      </div>
    </div>
  );
}
