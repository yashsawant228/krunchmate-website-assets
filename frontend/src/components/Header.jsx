import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "Our Story" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { totalCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          scrolled ? "backdrop-blur-md bg-black/25 border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="container-x flex items-center justify-between px-5 lg:px-10 py-4 lg:py-5">
          <Link to="/" data-testid="header-logo" className="block w-32 lg:w-36">
            <img src="/images/logo-white.svg" alt="KrunchMate" className="w-full h-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                data-testid={`nav-${n.to.slice(1)}`}
                className={({ isActive }) =>
                  `link-underline font-display uppercase tracking-[0.22em] text-xs text-cream ${
                    isActive ? "text-gold" : ""
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 lg:gap-6">
            <button
              data-testid="header-cart-btn"
              onClick={openCart}
              className="relative flex items-center gap-2 text-cream font-display uppercase tracking-[0.22em] text-xs hover:text-gold transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} strokeWidth={1.4} />
              <span className="hidden sm:inline">Cart</span>
              <span
                data-testid="cart-count-badge"
                className="ml-1 min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-[color:var(--gold)] text-[#1D2528] text-[10px] font-bold"
              >
                {totalCount}
              </span>
            </button>
            <button
              className="lg:hidden text-cream"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              data-testid="mobile-menu-btn"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[110] bg-[color:var(--pal-0)] flex flex-col"
          data-testid="mobile-nav-panel"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <img src="/images/logo-white.svg" alt="KrunchMate" className="w-32" />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="text-cream"
              data-testid="mobile-menu-close"
            >
              <X size={26} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-start px-6 py-10 gap-6">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className="font-display uppercase tracking-[0.22em] text-3xl text-cream"
                data-testid={`mobile-nav-${n.to.slice(1)}`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
