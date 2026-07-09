import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { REVIEWS } from "../data/flavours";

export default function Reviews() {
  const [idx, setIdx] = useState(0);
  const total = REVIEWS.length;

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <section className="section" data-testid="reviews-section">
      <div className="container-x">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="product-no mb-3">SECTION N0. 07</div>
            <h2 className="h-section font-display text-cream">
              Word from<br />the <span className="font-beth text-[color:var(--gold)] normal-case">krunch cult.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-cream/25 flex items-center justify-center text-cream hover:border-gold hover:text-gold transition-colors"
              data-testid="reviews-prev"
              aria-label="Previous review"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-cream/25 flex items-center justify-center text-cream hover:border-gold hover:text-gold transition-colors"
              data-testid="reviews-next"
              aria-label="Next review"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="relative min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="max-w-4xl"
              data-testid={`review-${idx}`}
            >
              <div className="flex items-center gap-1 mb-6">
                {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                  <Star key={k} size={16} fill="#F6A81E" stroke="#F6A81E" />
                ))}
              </div>
              <p className="font-display text-2xl lg:text-4xl text-cream leading-tight">
                &ldquo;{REVIEWS[idx].quote}&rdquo;
              </p>
              <footer className="mt-8 flex items-center gap-4">
                <span className="text-cream font-display uppercase tracking-[0.2em] text-sm">
                  {REVIEWS[idx].author}
                </span>
                <span className="text-cream/50 text-sm">· {REVIEWS[idx].location}</span>
                <span className="ml-auto font-beth text-[color:var(--gold)] text-xl">
                  {REVIEWS[idx].flavour}
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1 mt-8">
          {REVIEWS.map((r, i) => (
            <button
              key={r.author}
              onClick={() => setIdx(i)}
              className={`h-[3px] rounded-full transition-all ${
                i === idx ? "w-10 bg-[color:var(--gold)]" : "w-5 bg-cream/25"
              }`}
              aria-label={`Go to review ${i + 1}`}
              data-testid={`reviews-dot-${i}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
