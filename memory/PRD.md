# KrunchMate — Cinematic DTC Landing Site

## Original Problem Statement
Replicate buckssauce.com structural fidelity, re-skinned as KrunchMate — a UK-based makhana snack brand. Two flavours (Salt & Vinegar / Peanut Butter) with their own palettes, gold + cream constants, and specified typography. British English throughout.

## User Choices
- Ecommerce scope: frontend-only (cart in memory, no real checkout).
- Flavours: strictly two.
- Product imagery: official Krunchmate assets from connected repo.
- Pages: Home + Shop + About + FAQ + Contact (+ /story-behind-your-krunch as of iteration 3).
- Fonts: self-hosted TTF (Futura Bk BT Book, Helvetica, Beth Ellen, Rusty Hooks, Hops & Barley).

## Architecture
- **Frontend**: React 18 + React Router 6 + Framer Motion + Tailwind + `@react-three/fiber` + `@react-three/drei` + `three` for the 3D pouch.
- **Backend**: Minimal FastAPI stub — `/api/health`, `/api/subscribe`.
- **State**: `FlavourContext` (body[data-palette]) + `CartContext` (per-line unit-price supports tiered pricing).
- **Assets**: fonts and images from `/src/assets/fonts` and `/public/images`; GLBs from `/public/models`.

## Implementation Log

### 2026-01-09 — MVP
Full 5-page site, sticky header + animated cart drawer, hero with palette-switching flavour pills, "Choose Your Krunch" grid, three-pillar section, scroll-triggered founder sequence, bundle upsell, reviews carousel, newsletter capture, mobile sticky bar.

### 2026-01-09 — Code review pass
CartDrawer split into subcomponents; Footer split; nested ternaries flattened; array-index keys replaced with stable keys.

### 2026-08-03 — Layout bug fix
Consolidated CSS-only pass on `index.css` to eliminate desktop layout breaks at 100 / 90 / 125 % zoom: global `overflow-wrap`, `min-width: 0` on flex/grid children, capped `.pouch-stage` / media at `max-width: 100%`, tightened `.h-hero` / `.h-section` clamps and added `hyphens: auto`.

### 2026-09-15 — Final production pass
- **Real 3D pouch viewer** via `@react-three/fiber` — code-split, IntersectionObserver-gated, PNG fallback for data-saver / WebGL-unsupported browsers, drag-to-rotate + keyboard-operable rotate buttons, `prefers-reduced-motion` respected. Auto-rotate is a bounded ±14° sway so labels never turn backwards.
- **Pricing update**: Single £2.50, 3-pack £6.00 (£2.00/pouch), 6-pack £10.00 (£1.67/pouch) — sourced once from `PACK_TIERS`. Mix-and-match confirmed identical to single-flavour tiers.
- **Timeline update** on /about — Early 2024 → Late 2025.
- **Contact update** — `contact@krunchmate.com` + 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ.
- **Footer tagline** — "Snack Smarter, Krunch Now!"
- **New page** `/story-behind-your-krunch` — verbatim founder-voice copy about Rajesh, direct-answer AEO block, 5 body sections, sticky TOC, Rajesh illustration hero, YouTube click-to-load facade (`youtube-nocookie.com/embed/GAuCQe2qqro`), keyboard-operable play control, zero third-party requests until user clicks.
- **Navigation** — About-page "Read Rajesh's full story" CTA + footer Company column "Rajesh's story" link.
- **Hostinger VPS deployment package** at `/app/deploy/`: `README.md`, `ecosystem.config.js` (PM2 backend + `serve` frontend), `nginx-krunchmate.conf` (SPA + `/api` proxy + GLB long-cache headers), `.env.example`, `deploy.sh` (one-shot install + build + PM2 boot).

### GLB compression decision
The two shipped GLBs are ~5.2 MB each, uncompressed. **Compression pass NOT applied** in this shipping iteration — the models load lazily on scroll into view so LCP on Home is not affected. Follow-up backlog item: run `gltfpack -c` (meshopt) which typically yields ~1.0-1.5 MB per model, then re-cache via Nginx's `immutable` header on `*.glb`.

### Confirm on your actual Hostinger VPS
The deployment package targets Ubuntu 22.04/24.04 LTS with Node ≥ 18.18 (script auto-installs 20 LTS). Two knobs need to be verified once the plan is purchased:
- **Node version**: NodeSource install is used; if your tier blocks NodeSource, drop to `nvm install 20.11.0`.
- **Build-time RAM**: CRA production build peaks around 1.4 GB. On the 1 GB tier, set `NODE_OPTIONS=--max-old-space-size=768` and add a 2 GB swapfile before `yarn build`. 2 GB+ tiers need no change.

### Testing history
- iteration_1: 100 % backend / ~95 % frontend — 2 bugs fixed (shop discount, [PLACEHOLDER] copy).
- iteration_2: 15/15 viewport × page combos clean after CSS fix.
- iteration_3: 2 HIGH bugs found (PB label mirrored mid-rotation, 6-pack subtotal £10.02).
- iteration_4: 18/18 AC pass, both HIGH bugs fixed.

## Backlog (P1)
- Draco / meshopt compression on the two GLBs.
- `data-testid="footer-tagline"` for future-proof selector-based tests.
- Silence React Router v7 future-flag warnings.

## Backlog (P2)
- Additional pouch angles for full 360° model exploration.
- Persist cart to localStorage for cross-refresh continuity.
- Wire real Stripe checkout when moving beyond showcase scope.
