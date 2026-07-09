import React from "react";
import { Sparkles } from "lucide-react";
import { CLAIMS_STRIP } from "../data/flavours";

export default function ClaimsStrip() {
  const row = [...CLAIMS_STRIP, ...CLAIMS_STRIP];
  return (
    <section
      className="relative py-6 border-y border-cream/10 overflow-hidden bg-[color:var(--pal-ink)]"
      data-testid="claims-strip"
    >
      <div className="marquee-track whitespace-nowrap">
        {row.map((c, i) => (
          <span key={i} className="claim-badge">
            <Sparkles size={14} />
            <span>{c}</span>
            <span className="text-[color:var(--gold)] ml-3">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
