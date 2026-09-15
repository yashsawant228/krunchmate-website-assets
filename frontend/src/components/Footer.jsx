import React from "react";
import { Instagram, Facebook, Youtube } from "lucide-react";
import NewsletterCapture from "./footer/NewsletterCapture";
import FooterLinkColumn from "./footer/FooterLinkColumn";

const SHOP_LINKS = [
  { to: "/shop", label: "All flavours" },
  { to: "/shop", label: "Salt & Vinegar" },
  { to: "/shop", label: "Peanut Butter" },
  { to: "/shop", label: "Bundles" },
];

const COMPANY_LINKS = [
  { to: "/about", label: "Our story" },
  { to: "/story-behind-your-krunch", label: "Rajesh's story" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
  { to: "/contact", label: "Wholesale" },
];

const SUPPORT_LINKS = [
  { to: "/contact", label: "Delivery" },
  { to: "/contact", label: "Returns" },
  { to: "/faq", label: "Ingredients" },
  { to: "/faq", label: "Allergens" },
];

const SOCIAL = [
  { key: "instagram", href: "https://instagram.com", Icon: Instagram, label: "Instagram" },
  { key: "facebook", href: "https://facebook.com", Icon: Facebook, label: "Facebook" },
  { key: "youtube", href: "https://youtube.com", Icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[color:var(--pal-ink)] pt-20 pb-10 px-5 lg:px-10" data-testid="site-footer">
      <div className="container-x">
        <div className="border-b border-cream/10 pb-16 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="product-no mb-3">STAY KRUNCHY</div>
              <h3 className="h-section font-display text-cream leading-[1.05]">
                Get first dibs on new flavours &<br />
                <span className="font-beth text-[color:var(--gold)] normal-case">
                  10% off your first pouch.
                </span>
              </h3>
            </div>
            <NewsletterCapture />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
          <div className="col-span-2">
            <img src="/images/logo-white.svg" alt="KrunchMate" className="w-36 mb-6" />
            <p className="text-cream/60 max-w-xs leading-relaxed text-sm">
              Small-batch popped water-lily seed snacks. Sourced from Bihar, blended in the UK.
              Cinematically krunchy.
            </p>
            <div className="flex items-center gap-4 mt-6 text-cream/70">
              {SOCIAL.map(({ key, href, Icon, label }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:text-gold transition-colors"
                  data-testid={`social-${key}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <FooterLinkColumn title="Shop" links={SHOP_LINKS} />
          <FooterLinkColumn title="Company" links={COMPANY_LINKS} />
          <FooterLinkColumn title="Support" links={SUPPORT_LINKS} />
        </div>

        <div className="pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-cream/45 text-xs">
          <div>© {new Date().getFullYear()} KrunchMate Ltd. Made in the UK.</div>
          <div className="font-rusty text-[color:var(--gold)] text-lg">Snack Smarter, Krunch Now!</div>
          <div>Registered in England & Wales.</div>
        </div>
      </div>
    </footer>
  );
}
