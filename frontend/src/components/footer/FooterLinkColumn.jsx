import React from "react";
import { Link } from "react-router-dom";

/**
 * FooterLinkColumn — a titled column of navigation links used in the footer.
 * Kept purely presentational so link data lives in one place in Footer.jsx.
 */
export default function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <div className="font-display uppercase tracking-[0.22em] text-xs text-cream/70 mb-4">{title}</div>
      <ul className="space-y-3 text-cream/80">
        {links.map((l) => (
          <li key={`${title}-${l.label}`}>
            <Link to={l.to} className="link-underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
