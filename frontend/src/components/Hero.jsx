import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useFlavour } from "../context/FlavourContext";
import { useCart } from "../context/CartContext";
import PouchViewer3D from "./PouchViewer3D";

export default function Hero() {
  const { active, list, setFlavour } = useFlavour();
  const { addItem } = useCart();

  const idx = list.findIndex((f) => f.id === active.id);
  const prev = () => setFlavour(list[(idx - 1 + list.length) % list.length].id);
  const next = () => setFlavour(list[(idx + 1) % list.length].id);

  return (
    <section
      className="relative min-h-[100dvh] flex items-stretch gradient-hero grain overflow-hidden"
      data-testid="hero-section"
    >
      <div className="container-x relative flex flex-col lg:flex-row items-center gap-10 px-5 lg:px-10 pt-28 lg:pt-32 pb-16">
        {/* Left copy */}
        <div className="flex-1 relative z-10">
          <motion.div
            key={active.id + "-num"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="product-no mb-4"
            data-testid="hero-product-number"
          >
            PRODUCT {active.number} · {active.name.toUpperCase()}
          </motion.div>

          <motion.h1
            key={active.id + "-title"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
            className="font-display h-hero text-cream"
            data-testid="hero-title"
          >
            Properly<br />
            <span className="italic font-normal text-[color:var(--gold)]">krunchy.</span><br />
            <span className="text-cream">Popped, not fried.</span>
          </motion.h1>

          <motion.p
            key={active.id + "-tag"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 max-w-md text-cream/80 leading-relaxed"
          >
            {active.description}
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              className="btn-gold"
              onClick={() => addItem(active.id, 1)}
              data-testid="hero-add-to-pouch"
            >
              Add to pouch <ArrowRight size={16} />
            </button>
            <a href="/shop" className="btn-ghost" data-testid="hero-shop-link">
              Shop the range
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <span className="font-beth text-2xl text-[color:var(--gold)]">choose your krunch</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-cream hover:border-gold hover:text-gold transition-colors"
              onClick={prev}
              aria-label="Previous flavour"
              data-testid="hero-prev-flavour"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              {list.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFlavour(f.id)}
                  className={`px-4 py-2 rounded-full border text-xs uppercase tracking-[0.2em] font-display transition-all ${
                    f.id === active.id
                      ? "bg-[color:var(--gold)] text-[#1D2528] border-[color:var(--gold)]"
                      : "border-white/25 text-cream hover:border-gold hover:text-gold"
                  }`}
                  data-testid={`hero-flavour-pill-${f.id}`}
                >
                  {f.shortName}
                </button>
              ))}
            </div>
            <button
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-cream hover:border-gold hover:text-gold transition-colors"
              onClick={next}
              aria-label="Next flavour"
              data-testid="hero-next-flavour"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right pouch */}
        <div className="flex-1 relative flex items-center justify-center min-h-[500px] w-full lg:w-auto">
          <motion.div
            key={active.id + "-pouch"}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="relative"
          >
            {/* soft glow */}
            <div
              className="absolute inset-0 -m-20 rounded-full blur-3xl opacity-70"
              style={{
                background: `radial-gradient(circle, ${active.colors[3]}55 0%, transparent 60%)`,
              }}
            />
            <PouchViewer3D flavour={active} size="lg" />
          </motion.div>

          <div className="absolute top-4 right-4 hidden lg:block text-right">
            <div className="product-no">{active.number}</div>
            <div className="font-beth text-3xl text-[color:var(--gold)]">{active.accent.split("·")[0]}</div>
          </div>
        </div>
      </div>

      {/* Bottom marquee-style palette indicator */}
      <div className="absolute bottom-0 left-0 right-0 pb-4 lg:pb-6 pointer-events-none">
        <div className="container-x px-5 lg:px-10 flex items-center justify-between text-cream/60 text-[10px] uppercase tracking-[0.32em] font-display">
          <span>UK · Small-batch · Popped</span>
          <span>Drag pouch to rotate · 60fps</span>
        </div>
      </div>
    </section>
  );
}
