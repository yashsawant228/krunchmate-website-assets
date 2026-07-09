import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'ok' | 'error' | null
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/subscribe`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("ok");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-[color:var(--pal-ink)] pt-20 pb-10 px-5 lg:px-10" data-testid="site-footer">
      <div className="container-x">
        {/* Newsletter capture */}
        <div className="border-b border-cream/10 pb-16 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="product-no mb-3">STAY KRUNCHY</div>
              <h3 className="h-section font-display text-cream leading-[1.05]">
                Get first dibs on new flavours &<br />
                <span className="font-beth text-[color:var(--gold)] normal-case">10% off your first pouch.</span>
              </h3>
            </div>
            <form onSubmit={submit} className="w-full max-w-lg" data-testid="footer-newsletter-form">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border border-cream/25 rounded-full px-6 py-4 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors font-body"
                  data-testid="footer-email-input"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold justify-center whitespace-nowrap"
                  data-testid="footer-subscribe-btn"
                >
                  {loading ? "Sending" : "Subscribe"} <ArrowRight size={16} />
                </button>
              </div>
              {status === "ok" && (
                <p className="mt-3 text-[color:var(--gold)] text-sm" data-testid="footer-newsletter-success">
                  You're in — check your inbox for a warm hello. ✦
                </p>
              )}
              {status === "error" && (
                <p className="mt-3 text-red-300 text-sm" data-testid="footer-newsletter-error">
                  Please enter a valid email address.
                </p>
              )}
              <p className="mt-3 text-cream/40 text-xs">
                By subscribing you agree to our privacy policy. No spam, ever.
              </p>
            </form>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
          <div className="col-span-2">
            <img src="/images/logo-white.svg" alt="KrunchMate" className="w-36 mb-6" />
            <p className="text-cream/60 max-w-xs leading-relaxed text-sm">
              Small-batch popped water-lily seed snacks. Sourced from Bihar, blended in the UK.
              Cinematically krunchy.
            </p>
            <div className="flex items-center gap-4 mt-6 text-cream/70">
              <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors" data-testid="social-instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors" data-testid="social-facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="YouTube" className="hover:text-gold transition-colors" data-testid="social-youtube"><Youtube size={18} /></a>
            </div>
          </div>
          <div>
            <div className="font-display uppercase tracking-[0.22em] text-xs text-cream/70 mb-4">Shop</div>
            <ul className="space-y-3 text-cream/80">
              <li><Link to="/shop" className="link-underline">All flavours</Link></li>
              <li><Link to="/shop" className="link-underline">Salt & Vinegar</Link></li>
              <li><Link to="/shop" className="link-underline">Peanut Butter</Link></li>
              <li><Link to="/shop" className="link-underline">Bundles</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-display uppercase tracking-[0.22em] text-xs text-cream/70 mb-4">Company</div>
            <ul className="space-y-3 text-cream/80">
              <li><Link to="/about" className="link-underline">Our story</Link></li>
              <li><Link to="/faq" className="link-underline">FAQ</Link></li>
              <li><Link to="/contact" className="link-underline">Contact</Link></li>
              <li><Link to="/contact" className="link-underline">Wholesale</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-display uppercase tracking-[0.22em] text-xs text-cream/70 mb-4">Support</div>
            <ul className="space-y-3 text-cream/80">
              <li><Link to="/contact" className="link-underline">Delivery</Link></li>
              <li><Link to="/contact" className="link-underline">Returns</Link></li>
              <li><Link to="/faq" className="link-underline">Ingredients</Link></li>
              <li><Link to="/faq" className="link-underline">Allergens</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-cream/45 text-xs">
          <div>© {new Date().getFullYear()} KrunchMate Ltd. Made in the UK.</div>
          <div className="font-rusty text-[color:var(--gold)] text-lg">popped, never fried.</div>
          <div>Registered in England & Wales.</div>
        </div>
      </div>
    </footer>
  );
}
