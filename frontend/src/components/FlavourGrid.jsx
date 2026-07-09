import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useFlavour } from "../context/FlavourContext";
import { useCart } from "../context/CartContext";

/**
 * FlavourGrid — "Choose Your Krunch" grid.
 * Each card is rendered in its own palette (Teal / Brown) as per brief.
 */
export default function FlavourGrid() {
  const { list, setFlavour } = useFlavour();
  const { addItem } = useCart();

  return (
    <section className="section" data-testid="flavour-grid-section">
      <div className="container-x">
        <div className="flex items-end justify-between mb-10 lg:mb-16 flex-wrap gap-6">
          <div>
            <div className="product-no mb-3">SECTION N0. 02</div>
            <h2 className="h-section font-display text-cream max-w-2xl">
              Choose your <span className="font-beth text-[color:var(--gold)] normal-case">krunch.</span>
            </h2>
          </div>
          <p className="max-w-sm text-cream/70 leading-relaxed">
            Two flavours. Two palettes. Same obsessively small-batch process. Tap a card to switch
            the whole site to that flavour's world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {list.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="relative rounded-3xl overflow-hidden grain group cursor-pointer"
              style={{
                background: `linear-gradient(160deg, ${f.colors[0]} 0%, ${f.colors[2]} 60%, ${f.colors[3]} 130%)`,
                minHeight: 520,
              }}
              onClick={() => setFlavour(f.id)}
              data-testid={`flavour-card-${f.id}`}
            >
              <div className="p-8 lg:p-10 h-full flex flex-col justify-between relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="product-no" style={{ color: "#FFFBE5", opacity: 0.7 }}>
                      {f.number}
                    </div>
                    <h3
                      className="font-display text-4xl lg:text-5xl mt-2"
                      style={{ color: "#FFFBE5" }}
                    >
                      {f.name}
                    </h3>
                    <div
                      className="font-beth text-2xl mt-1"
                      style={{ color: "#F6A81E" }}
                    >
                      {f.tagline.split(".")[0]}.
                    </div>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border transition-transform group-hover:rotate-45"
                    style={{ borderColor: "#FFFBE5", color: "#FFFBE5" }}
                  >
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center py-6">
                  <motion.img
                    src={f.front}
                    alt={`${f.name} pouch`}
                    className="max-h-[300px] w-auto object-contain"
                    style={{ filter: "drop-shadow(0 40px 40px rgba(0,0,0,0.35))" }}
                    whileHover={{ scale: 1.06, rotate: -3 }}
                    transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  />
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex flex-wrap gap-2">
                    {f.claims.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="text-[10px] uppercase tracking-[0.22em] font-display px-3 py-1 rounded-full border"
                        style={{ borderColor: "rgba(255,251,229,0.35)", color: "#FFFBE5" }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div style={{ color: "#FFFBE5" }} className="font-display text-2xl">
                      £{f.price.toFixed(2)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(f.id, 1);
                      }}
                      className="btn-gold"
                      data-testid={`flavour-card-add-${f.id}`}
                    >
                      Add to pouch
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
