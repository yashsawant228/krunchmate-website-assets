import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * NewsletterCapture — the email-gate form used in the site footer.
 * Wires directly to /api/subscribe and manages its own submission state.
 */
export default function NewsletterCapture() {
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
  );
}
