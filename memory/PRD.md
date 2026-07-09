# KrunchMate — Cinematic DTC Landing Site

## Original Problem Statement
Build a landing page that replicates buckssauce.com at 1:1 structural and interaction fidelity, re-skinned as **KrunchMate**, a UK-based makhana (popped water-lily seed) snack brand. Only the two official KrunchMate flavour palettes (Teal for Salt & Vinegar, Brown for Peanut Butter), the gold + cream constants, and the specified typography (Futura Bk BT Book, Helvetica, Beth Ellen / Rusty Hooks / Hops And Barley) are permitted. British English throughout.

## User Choices (Round 1)
- **Ecommerce scope**: Frontend-only visual/animation showcase (cart is UI-only, no persistence).
- **Flavours**: Strictly two — Salt & Vinegar (Teal) and Peanut Butter (Brown).
- **Product imagery**: Official Krunchmate pouch photography from the connected repo (already delivered into `/app/frontend/public/images/`).
- **Pages**: Home + Shop + About + FAQ + Contact.
- **Fonts**: Self-hosted TTF files from the repo (no Google Fonts substitutes).

## Architecture
- **Frontend**: React 18 + React Router 6 + Framer Motion + Tailwind CSS (CRA scaffolding).
- **Backend**: Minimal FastAPI service exposing `/api/health` and `/api/subscribe` (frontend-only scope means DB persistence was not required).
- **State**: `FlavourContext` (site-wide palette via `body[data-palette]`) + `CartContext` (in-memory cart with unit-price override support so multi-pack discounts propagate correctly).
- **Assets**: Fonts self-hosted from `/src/assets/fonts`; pouch renders and videos from `/public/images` and `/public/videos`.

## Implemented (2026-01-09)
- Sticky animated header with cart drawer trigger, gold badge counter, and mobile hamburger.
- Full-viewport hero with palette-switching flavour pills, animated "PRODUCT N0. XX" counter, and 3D-rotatable pouch (drag + subtle idle sway; safe from edge-on hiding).
- Horizontal claims marquee strip with gold sparkle bullets.
- "Choose Your Krunch" flavour grid — each card in its own palette; click switches site-wide palette.
- Three-pillar brand story section (Popped-not-fried / Bihar-sourced / Made for the UK).
- Founder scroll sequence with scroll-triggered palette transition (Teal → Brown), auto-playing pond and kitchen video panels, parallax parallax movement.
- Bundle upsell (Duo / Krunch Six / Office Stash) — each bundle adds multiple items to the cart drawer.
- Reviews carousel (auto-rotate + prev/next + dot pagination).
- Cart drawer with the cinematic "empty pouch → filled → checkout" SVG widget (gold fill level, status text, and progress bar).
- Sticky mobile add-to-cart bar visible on <lg viewports.
- Footer with newsletter capture wired to `POST /api/subscribe` and success / error states.
- Shop, About, FAQ, Contact pages fully populated with brand-compliant colour and typography.
- Multi-pack pricing (1× / 3× / 6×) with correct discount propagation into the cart.

## Fixed post-testing (iteration 1)
- Cart now honours the Shop page's discounted unit price (per-line `unitPrice` support).
- Removed `[PLACEHOLDER — …]` internal notes from Shop, Contact, and About pages.

## Known / Deferred
- Product renders use only front / back keyframes (per user directive). Full 360° angles would require additional photography.
- No persistent cart / checkout (intentional — frontend showcase scope).
- Contact form submissions are not persisted (intentional).

## Backlog / P1
- Additional pouch angles for full 360° rotation.
- Cart persistence via `localStorage` (client-side only, still no server round-trip).
- Structured data / schema.org markup for product pages.

## Backlog / P2
- Bundle builder ("pick 6, mix your own").
- Recipe / usage blog section.
- Founder video hero variant on About.
