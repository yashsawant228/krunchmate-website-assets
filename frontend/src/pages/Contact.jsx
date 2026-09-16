import React, { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General", message: "" });
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.includes("@") || form.message.trim().length < 5) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      setForm({ name: "", email: "", subject: "General", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const on = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="pt-32 pb-28 px-5 lg:px-10" data-testid="contact-page">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="product-no mb-3">PAGE N0. 05</div>
            <h1 className="h-hero font-display text-cream leading-[0.94]">
              Say<br /> <span className="font-beth text-[color:var(--gold)] normal-case italic">hello.</span>
            </h1>
            <p className="mt-6 text-cream/75 leading-relaxed max-w-md">
              Wholesale queries, press requests, or just a note about your favourite flavour — we
              read every message and reply within one working day.
            </p>

            <div className="mt-10 space-y-6 text-cream/85">
              <div className="flex items-start gap-4">
                <Mail size={18} className="text-[color:var(--gold)] mt-1" />
                <div>
                  <div className="font-display uppercase tracking-[0.22em] text-[10px] text-cream/60">Email</div>
                  <a
                    href="mailto:contact@krunchmate.com"
                    className="mt-1 block link-underline"
                    data-testid="contact-email-link"
                  >
                    contact@krunchmate.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-[color:var(--gold)] mt-1" />
                <div>
                  <div className="font-display uppercase tracking-[0.22em] text-[10px] text-cream/60">Head office</div>
                  <address className="mt-1 not-italic" data-testid="contact-address">
                    Krunchmate Ltd.<br />
                    71-75 Shelton Street<br />
                    Covent Garden<br />
                    London<br />
                    United Kingdom<br />
                    WC2H 9JQ
                  </address>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={submit}
              className="p-8 lg:p-10 rounded-3xl bg-[color:var(--pal-ink)]/60 border border-cream/10 space-y-6"
              data-testid="contact-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.22em] font-display text-cream/60">Name</span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={on("name")}
                    className="mt-2 w-full bg-transparent border-b border-cream/25 focus:border-gold outline-none py-3 text-cream"
                    data-testid="contact-name"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.22em] font-display text-cream/60">Email</span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={on("email")}
                    className="mt-2 w-full bg-transparent border-b border-cream/25 focus:border-gold outline-none py-3 text-cream"
                    data-testid="contact-email"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.22em] font-display text-cream/60">Subject</span>
                <select
                  value={form.subject}
                  onChange={on("subject")}
                  className="mt-2 w-full bg-[color:var(--pal-0)] border-b border-cream/25 focus:border-gold outline-none py-3 text-cream"
                  data-testid="contact-subject"
                >
                  <option>General</option>
                  <option>Wholesale enquiry</option>
                  <option>Press</option>
                  <option>Delivery issue</option>
                  <option>Ingredients / allergens</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.22em] font-display text-cream/60">Message</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={on("message")}
                  className="mt-2 w-full bg-transparent border border-cream/25 focus:border-gold outline-none rounded-2xl px-4 py-3 text-cream"
                  data-testid="contact-message"
                />
              </label>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-cream/45 text-xs max-w-sm">
                  We read every message and reply within one working day.
                </p>
                <button
                  type="submit"
                  className="btn-gold"
                  disabled={status === "submitting"}
                  data-testid="contact-submit"
                >
                  {status === "submitting" ? "Sending…" : "Send message"} <Send size={14} />
                </button>
              </div>
              {status === "ok" && (
                <p className="text-[color:var(--gold)] text-sm" data-testid="contact-success">
                  Thanks — we'll get back to you within one working day.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-300 text-sm" data-testid="contact-error">
                  Please add a valid email and a message of at least 5 characters.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
