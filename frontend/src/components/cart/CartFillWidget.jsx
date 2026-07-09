import React from "react";
import { motion } from "framer-motion";

/**
 * CartFillWidget — the "empty pouch → filled → checkout" status widget.
 * Renders a stylised pouch SVG whose gold fill rises with `fillLevel` (0–100).
 */
const KRUNCH_DOT_KEYS = Array.from({ length: 12 }, (_, i) => `krunch-dot-${i}`);

export default function CartFillWidget({ fillLevel, status }) {
  return (
    <div className="px-6 py-5 border-b border-white/10">
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-20 flex items-end justify-center overflow-hidden">
          <svg viewBox="0 0 60 90" className="absolute inset-0 w-full h-full">
            <defs>
              <clipPath id="pouch-clip">
                <path d="M12 8 L48 8 L48 16 L52 22 L52 82 Q52 88 46 88 L14 88 Q8 88 8 82 L8 22 L12 16 Z" />
              </clipPath>
            </defs>
            <path
              d="M12 8 L48 8 L48 16 L52 22 L52 82 Q52 88 46 88 L14 88 Q8 88 8 82 L8 22 L12 16 Z"
              fill="none"
              stroke="#FFFBE5"
              strokeWidth="1.4"
              opacity="0.5"
            />
            <motion.rect
              x="0"
              width="60"
              fill="#F6A81E"
              clipPath="url(#pouch-clip)"
              initial={false}
              animate={{ y: 90 - fillLevel * 0.8 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              height="90"
            />
            <g clipPath="url(#pouch-clip)" opacity="0.7">
              {KRUNCH_DOT_KEYS.map((k, i) => (
                <circle
                  key={k}
                  cx={12 + (i * 4) % 40}
                  cy={90 - fillLevel * 0.8 + (i % 4) * 5}
                  r="1.3"
                  fill="#FFFBE5"
                />
              ))}
            </g>
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cream/60 font-display">Status</div>
          <div className="font-display text-cream text-lg" data-testid="cart-fill-status">
            {status}
          </div>
          <div className="pouch-fill-bar mt-2" style={{ "--fill": `${fillLevel}%` }} />
        </div>
      </div>
    </div>
  );
}
