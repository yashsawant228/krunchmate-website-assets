import React from "react";
import { Sparkles } from "lucide-react";
import { CLAIMS_STRIP } from "../data/flavours";

export default function ClaimsStrip() {
  // Duplicate for a seamless marquee loop; keys stay stable by prefixing the copy index.
  const row = [
    ...CLAIMS_STRIP.map((c) => ({ c, k: `a-${c}` })),
    ...CLAIMS_STRIP.map((c) => ({ c, k: `b-${c}` })),
  ];
  return (
    <section
      className="relative py-6 border-y border-cream/10 overflow-hidden bg-[color:var(--pal-ink)]"
      data-testid="claims-strip"
    >
      <div className="marquee-track whitespace-nowrap">
        {row.map(({ c, k }) => (
          <span key={k} className="claim-badge">
            <Sparkles size={14} />
            <span>{c}</span>
            <span className="text-[color:var(--gold)] ml-3">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
