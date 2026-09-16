import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";

const CONFIRMATION_COPY = `Thank you for choosing KrunchMate — you're one of our first 1000 customers, which makes you one of the special ones. This is a pre-order: our full site and stock go live in the second week of October, and that's when your pouches will ship. You'll get tracking details by email next week, and as one of our first 1000, you'll also get early-customer perks on future orders. Thank you for backing us from day one.`;

const packForQty = (qty) => {
  if (qty >= 6) return "6";
  if (qty >= 3) return "3";
  return "1";
};

export default function PreOrderForm({ open, onClose, cartItems, subtotal }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'ok' | 'error'
  const [orderId, setOrderId] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  // Derive the lead-capture payload from the cart. Every line becomes one
  // {flavour, pack, qty} row.
  const items = useMemo(
    () =>
      cartItems.map((it) => ({
        flavour: it.id,
        pack: packForQty(it.qty),
        qty: it.qty,
      })),
    [cartItems]
  );
  const totalPouches = useMemo(
    () => cartItems.reduce((s, it) => s + it.qty, 0),
    [cartItems]
  );

  const reset = () => {
    setName("");
    setEmail("");
    setNotes("");
    setStatus("idle");
    setOrderId(null);
    setErrMsg("");
  };

  const closeAll = () => {
    reset();
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 1 || !email.includes("@") || items.length === 0) {
      setStatus("error");
      setErrMsg("Please add a name, valid email, and at least one pouch.");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/preorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          items,
          total_pouches: totalPouches,
          total_price: +subtotal.toFixed(2),
          notes: notes || null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOrderId(data.id);
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setErrMsg("Something went wrong. Please try again or email contact@krunchmate.com.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="pre-backdrop"
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAll}
            data-testid="preorder-backdrop"
          />
          <motion.div
            key="pre-modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-8 pointer-events-none"
            data-testid="preorder-modal"
          >
            <div className="pointer-events-auto w-full max-w-lg bg-[color:var(--pal-0)] border border-cream/15 rounded-3xl overflow-hidden shadow-2xl">
              {status === "ok" ? (
                <div className="p-8" data-testid="preorder-success">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="product-no">PRE-ORDER RESERVED</div>
                      <h3 className="font-display text-3xl text-cream mt-1">
                        You're one of the <span className="font-beth text-[color:var(--gold)]">special ones.</span>
                      </h3>
                    </div>
                    <button onClick={closeAll} className="text-cream/70 hover:text-gold" aria-label="Close" data-testid="preorder-close-success">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[color:var(--gold)] text-[#1D2528] flex items-center justify-center mb-5">
                    <Check size={22} strokeWidth={2.4} />
                  </div>
                  <p className="text-cream/85 leading-relaxed" data-testid="preorder-confirmation-copy">
                    {CONFIRMATION_COPY}
                  </p>
                  {orderId && (
                    <p className="mt-4 text-cream/50 text-xs">
                      Reference: <span className="font-display">{orderId}</span>
                    </p>
                  )}
                  <button onClick={closeAll} className="btn-gold mt-6" data-testid="preorder-back-to-site">
                    Back to the site
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="p-8" data-testid="preorder-form">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="product-no">PRE-ORDER · SHIPS 2ND WEEK OF OCTOBER</div>
                      <h3 className="font-display text-3xl text-cream mt-1 leading-tight">
                        Reserve your <span className="font-beth text-[color:var(--gold)]">krunch.</span>
                      </h3>
                    </div>
                    <button type="button" onClick={closeAll} className="text-cream/70 hover:text-gold" aria-label="Close" data-testid="preorder-close">
                      <X size={20} />
                    </button>
                  </div>
                  <p className="text-cream/70 text-sm mt-3 mb-5">
                    No payment today — leave your details and we'll email you tracking next week when stock ships.
                  </p>

                  {/* Cart summary */}
                  <ul className="text-sm text-cream/85 space-y-1 mb-5 pb-4 border-b border-cream/10" data-testid="preorder-summary">
                    {items.map((it, i) => (
                      <li key={`${it.flavour}-${i}`} className="flex justify-between">
                        <span>
                          {it.qty} × {it.flavour === "salt-vinegar" ? "Salt & Vinegar" : "Peanut Butter"}
                          <span className="text-cream/40"> · {it.pack === "1" ? "single" : `${it.pack}-pack tier`}</span>
                        </span>
                      </li>
                    ))}
                    <li className="flex justify-between pt-2 font-display">
                      <span>Total ({totalPouches} pouches)</span>
                      <span className="text-[color:var(--gold)]">£{subtotal.toFixed(2)}</span>
                    </li>
                  </ul>

                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.22em] font-display text-cream/60">Name</span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 w-full bg-transparent border-b border-cream/25 focus:border-gold outline-none py-3 text-cream"
                        data-testid="preorder-name"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.22em] font-display text-cream/60">Email</span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 w-full bg-transparent border-b border-cream/25 focus:border-gold outline-none py-3 text-cream"
                        data-testid="preorder-email"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.22em] font-display text-cream/60">Notes (optional)</span>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-2 w-full bg-transparent border border-cream/25 focus:border-gold outline-none rounded-2xl px-3 py-2 text-cream"
                        data-testid="preorder-notes"
                      />
                    </label>
                  </div>

                  {status === "error" && (
                    <p className="mt-3 text-red-300 text-sm" data-testid="preorder-error">{errMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn-gold w-full justify-center mt-5 disabled:opacity-40"
                    data-testid="preorder-submit"
                  >
                    {status === "submitting" ? "Reserving…" : "Reserve my pouches"} <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
