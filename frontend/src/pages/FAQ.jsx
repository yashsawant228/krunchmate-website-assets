import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "../data/flavours";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="pt-32 pb-28 px-5 lg:px-10" data-testid="faq-page">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="product-no mb-3">PAGE N0. 04</div>
            <h1 className="h-hero font-display text-cream leading-[0.94]">
              Ask us<br />
              <span className="font-beth text-[color:var(--gold)] normal-case italic">anything.</span>
            </h1>
            <p className="mt-6 text-cream/75 leading-relaxed">
              Everything you might reasonably want to know before you fill your pouch. If your
              question isn't here, drop us a note via the Contact page.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-cream/10 border-y border-cream/10">
              {FAQS.map((f, i) => {
                const isOpen = i === openIdx;
                return (
                  <li key={f.q} data-testid={`faq-${i}`}>
                    <button
                      onClick={() => setOpenIdx(isOpen ? -1 : i)}
                      className="w-full py-6 flex items-start justify-between gap-6 text-left group"
                      data-testid={`faq-toggle-${i}`}
                    >
                      <span className="font-display text-cream text-xl lg:text-2xl leading-tight group-hover:text-[color:var(--gold)] transition-colors">
                        {f.q}
                      </span>
                      <span className="text-[color:var(--gold)] mt-1 shrink-0">
                        {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 pr-12 text-cream/75 leading-relaxed max-w-2xl">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
