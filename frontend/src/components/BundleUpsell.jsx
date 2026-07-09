import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { FLAVOUR_LIST } from "../data/flavours";

const BUNDLES = [
  {
    id: "duo",
    name: "The Duo",
    subtitle: "1 × Salt & Vinegar · 1 × Peanut Butter",
    contents: [{ id: "salt-vinegar", qty: 1 }, { id: "peanut-butter", qty: 1 }],
    price: 6.9,
    save: "Save £0.60",
    tag: "Starter",
  },
  {
    id: "krunch-6",
    name: "The Krunch Six",
    subtitle: "3 × Salt & Vinegar · 3 × Peanut Butter",
    contents: [{ id: "salt-vinegar", qty: 3 }, { id: "peanut-butter", qty: 3 }],
    price: 19.5,
    save: "Save £3.00",
    tag: "Most loved",
  },
  {
    id: "office",
    name: "The Office Stash",
    subtitle: "6 × Salt & Vinegar · 6 × Peanut Butter",
    contents: [{ id: "salt-vinegar", qty: 6 }, { id: "peanut-butter", qty: 6 }],
    price: 36.0,
    save: "Save £9.00",
    tag: "Best value",
  },
];

export default function BundleUpsell() {
  const { addItem, openCart } = useCart();

  const addBundle = (b) => {
    b.contents.forEach((c) => addItem(c.id, c.qty));
    openCart();
  };

  return (
    <section className="section gradient-story grain" data-testid="bundle-upsell-section">
      <div className="container-x">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <div className="product-no mb-3">SECTION N0. 06</div>
            <h2 className="h-section font-display text-cream">
              Bundle the krunch.<br />
              <span className="font-beth text-[color:var(--gold)] normal-case">save the pennies.</span>
            </h2>
          </div>
          <p className="max-w-sm text-cream/70">
            Stack your pouch. Split the flavours. Free UK delivery kicks in from £15.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {BUNDLES.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="relative p-8 rounded-3xl border border-cream/15 bg-[color:var(--pal-ink)]/60 backdrop-blur-sm flex flex-col"
              data-testid={`bundle-${b.id}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.22em] font-display px-3 py-1 rounded-full border border-[color:var(--gold)] text-[color:var(--gold)]">
                  {b.tag}
                </span>
                <span className="text-[color:var(--gold)] font-beth text-2xl">{b.save}</span>
              </div>
              <h3 className="font-display text-3xl text-cream mt-6">{b.name}</h3>
              <p className="text-cream/60 mt-2 text-sm">{b.subtitle}</p>

              <div className="flex items-center gap-3 my-8">
                {b.contents.map((c) => {
                  const f = FLAVOUR_LIST.find((x) => x.id === c.id);
                  return (
                    <div key={c.id} className="relative">
                      <img src={f.front} alt={f.name} className="w-16 h-24 object-contain drop-shadow-lg" />
                      <span className="absolute -bottom-1 -right-1 min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-[color:var(--gold)] text-[#1D2528] text-[10px] font-bold">
                        ×{c.qty}
                      </span>
                    </div>
                  );
                })}
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-cream/80 text-sm">
                  <Check size={14} className="text-[color:var(--gold)]" /> Free UK delivery
                </li>
                <li className="flex items-center gap-2 text-cream/80 text-sm">
                  <Check size={14} className="text-[color:var(--gold)]" /> Recyclable pouches
                </li>
                <li className="flex items-center gap-2 text-cream/80 text-sm">
                  <Check size={14} className="text-[color:var(--gold)]" /> Ships within 24h
                </li>
              </ul>

              <div className="mt-auto flex items-end justify-between">
                <div className="font-display text-3xl text-cream">£{b.price.toFixed(2)}</div>
                <button
                  className="btn-gold"
                  onClick={() => addBundle(b)}
                  data-testid={`bundle-add-${b.id}`}
                >
                  <ShoppingBag size={14} /> Add bundle
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
