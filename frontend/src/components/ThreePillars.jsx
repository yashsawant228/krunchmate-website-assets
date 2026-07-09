import React from "react";
import { motion } from "framer-motion";
import { PILLARS } from "../data/flavours";

export default function ThreePillars() {
  return (
    <section className="section gradient-story grain" data-testid="three-pillars-section">
      <div className="container-x relative z-10">
        <div className="max-w-3xl mb-14 lg:mb-20">
          <div className="product-no mb-3">SECTION N0. 03</div>
          <h2 className="h-section font-display text-cream">
            Three things we obsess over.<br />
            <span className="font-beth text-[color:var(--gold)]">everything else is noise.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.19, 1, 0.22, 1] }}
              className="relative p-8 lg:p-10 rounded-3xl border border-cream/10 bg-[color:var(--pal-ink)]/50 backdrop-blur-sm"
              data-testid={`pillar-${i}`}
            >
              <div
                className="text-[80px] font-display leading-none opacity-25"
                style={{ color: "var(--gold)" }}
              >
                0{i + 1}
              </div>
              <h3 className="font-display text-3xl text-cream mt-4">{p.title}</h3>
              <p className="text-cream/70 mt-4 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
