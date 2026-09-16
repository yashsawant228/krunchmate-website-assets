import React, { useState } from "react";
import { X } from "lucide-react";

/**
 * ComingSoonBanner — brand-toned, non-blocking sitewide notice.
 * Dismissable per-session via sessionStorage.
 */
export default function ComingSoonBanner() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("km-banner-dismissed") !== "1";
  });

  if (!open) return null;

  const dismiss = () => {
    sessionStorage.setItem("km-banner-dismissed", "1");
    setOpen(false);
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-[color:var(--gold)] text-[#1D2528]"
      data-testid="coming-soon-banner"
      role="status"
    >
      <div className="container-x flex items-center justify-between gap-4 px-5 lg:px-10 py-2">
        <p className="text-[12px] lg:text-[13px] font-display uppercase tracking-[0.14em] leading-snug">
          <span className="hidden sm:inline">Coming soon · </span>Full site &amp; stock go live in the second week of October.
          <span className="hidden md:inline"> Any orders placed now are pre-orders — you'll be first in the queue.</span>
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
          data-testid="coming-soon-dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
