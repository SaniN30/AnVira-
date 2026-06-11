comm# AnVira — Full Website Implementation Plan
*Derived from `website-feedbackV1.md` + `claude.md` (Master Document v2.0) — June 2026*

**Goal:** Convert the current single-page `index.html` into a complete, scalable, conversion-optimized direct-booking website — same design language, zero quality compromise, aligned with every spec in `claude.md`.

**Conversion thesis (drives every phase):** A guest spending ₹1,50,000/night converts when the site removes *uncertainty* — real URLs they can share on WhatsApp, anchor pricing, named staff, named reviews, availability at a glance, and a one-tap pre-filled WhatsApp enquiry. Every phase below maps to a stage of the 6-stage guest journey (Discovery → Post-Stay).

---

## Architecture Decision (must be confirmed before Phase 0)

`claude.md` §5 specifies Next.js + Tailwind. The current codebase is a hand-crafted static HTML/CSS/JS file with a mature, bespoke design system already in CSS custom properties.

**Option A — Recommended for this phase of the business: Static multi-page architecture (zero build step).**
Restructure into real pages (`/estates/villa-anvira.html`, etc.) with shared `assets/css/main.css`, `assets/js/*.js`, and `data/estates/*.json` matching the `AnViraEstate` interface from `claude.md` §5. Delivers 100% of the functional spec (URLs, SEO, OG images, booking flow, calendars, legal pages) with sub-2s loads, no framework risk, deployable on any static host. Next.js migration becomes Phase 6, triggered exactly as `claude.md` §5 CMS strategy prescribes (3+ new estates / non-technical co-manager).

**Option B — Full Next.js (App Router) migration now.**
Matches `claude.md` §5 verbatim. Higher upfront cost: full rewrite of the existing 2,300-line page into components, build pipeline, hosting change to Vercel. Pays off at scale, slower to first conversion win.

---

## Phase 0 — Foundation & Restructure *(Discovery stage / engineering hygiene)*

1. **Split the monolith:**
   - `assets/css/main.css` — all shared styles (tokens, nav, footer, cursor, motion).
   - `assets/js/core.js` (cursor, nav, menu, scroll, fade-ins), `assets/js/booking.js` (widget + Message Preview Card), `assets/js/gallery.js` (lightbox, accordion).
   - `data/estates/*.json` — one file per property, schema = `AnViraEstate` interface (`claude.md` §5), version controlled. All hardcoded `PROPERTIES` data moves here.
2. **Shared partials strategy** (static includes via a tiny build-free JS injector or duplicated head/nav/footer blocks generated from one source of truth) — nav, footer, WhatsApp float, sticky bar identical on every page.
3. **URL structure** per `claude.md` §5: `/`, `/estates/`, `/estates/[slug]`, `/arrive/[slug]`, `/reviews/submit`, `/legal/*`.
4. **Typography & readability baseline (feedback item #4):**
   - Body copy minimum 16px (`claude.md` §3.3 — currently `.wlc-p` 13.5px, `.cdesc` 12px → raise).
   - Contrast audit: Dust on Bone must pass WCAG AA.
   - **Spacing/symmetry token scale** — one set of `--space-*` variables; every section padding, gap, and margin drawn from it. This is what eliminates "useless gaps" and enforces the symmetry the feedback demands.
5. Git hygiene: feature branch per phase, commit gates only after visual + functional verification.

**Quality gate:** Homepage pixel-identical to current site (visual regression by screenshot), all JS functionality intact, Lighthouse ≥ current baseline.

---

## Phase 1 — Real Property Pages *(Consideration + Decision stages — the conversion core)*

Replace the JS overlay with true `/estates/[slug].html` pages, each rendered from its JSON. Per `claude.md` §1.3, each page gets — in this exact reading order, no dead space between sections:

1. **Hero:** 100vh image, estate name bottom-left (Cormorant Italic), location in Spectral, subtle parallax.
2. **Sticky booking panel** (desktop right column, always visible while scrolling) — the single most important conversion element. Mobile: sticky bottom bar → opens booking sheet.
3. **Anchor pricing block:** "From ₹X/night" + minimum nights + what's included / what's extra. (Currently "On Request" — pricing anchors per `claude.md` §9 outperform hidden pricing; needs real numbers from owner, placeholder structure built now.)
4. **Property story prose** — max 600px measure, 16–18px, generous line-height; symmetric two-column desktop layout (story left, booking panel right) with zero orphan whitespace.
5. **Quick stats strip** (rooms · guests · baths · area) in DM Mono.
6. **Masonry gallery** (3-col, lightbox — port existing).
7. **Amenities grid** (port existing).
8. **Month-level availability calendar** (JSON-driven, clicking a month pre-fills widget — port + wire to data files).
9. **Staff introduction** — caretaker name, photo, one-paragraph bio (placeholder content slots; owner supplies).
10. **Local guide** — 4–6 curated spots in the `claude.md` §6 format.
11. **Named, dated, occasion-specific reviews** (filtered per property from testimonial data).
12. **Similar estates** (2 cards) + final CTA strip.
13. **Per-page SEO:** unique title/description, OG image (1200×630), JSON-LD `LodgingBusiness` with real address/geo, canonical URL. Share link must preview beautifully in WhatsApp.

**Quality gate:** All 3 estate pages live, deep-linkable, WhatsApp link preview verified, no horizontal scroll at 320px–1920px, no section with >160px desktop / >80px mobile dead padding, typographic rhythm consistent across all sections.

---

## Phase 2 — Conversion System *(Decision stage)*

1. **Message Preview Card** — port and refine (paper-unfold animation per `claude.md` §4.1, editable name + note, exact-message preview).
2. **Enquiry logging:** `POST` to a Google Apps Script web-app endpoint → Google Sheet (`Timestamp | Property | Check-in | Check-out | Guests | Name | Status`). Fire-and-forget, never blocks the WhatsApp open.
3. **Estate listing page `/estates/`** — all active estates + **"Under Curation" coming-soon cards** with "Notify me" waitlist (name + WhatsApp number → same Sheet). Simple location/capacity filter.
4. **Trust layer on every page:** response-time promise ("We reply within 2 hours"), direct-booking benefits strip (no OTA fees, direct line to caretaker), GSTIN in footer.
5. **Micro-conversion fallbacks:** "Call instead" everywhere, persistent floating WhatsApp with context-aware pre-filled message (property name auto-included on estate pages).

**Quality gate:** End-to-end booking flow tested on iPhone Safari + Android Chrome; enquiry rows land in Sheet; every CTA produces a correctly pre-filled message.

---

## Phase 3 — Guest Journey Completion *(Pre-Arrival + Post-Stay stages)*

1. `/arrive/[slug]` — private pre-arrival pages: directions + Maps embed, airport/rail distances, caretaker contact, house notes, check-in/out times, what to bring. Unlisted (noindex), shared only in booking confirmation.
2. `/reviews/submit` — name, occasion, 1–5 rating, ≤200-word review; posts to Sheet for owner approval before publication.
3. **Legal pages:** `/legal/privacy`, `/legal/terms`, `/legal/cancellation` — same design language, readable prose.

**Quality gate:** All pages styled to system, noindex verified on /arrive, review submission lands in approval queue.

---

## Phase 4 — Interaction & Motion Polish *(feedback: "interactive yet subtle")*

Strictly within `claude.md` §3 motion principles — *unhurried but precise*:

1. Hero Ken Burns (100→103% over 8s) on property heroes.
2. Word-stagger hero text (40ms), section fade-up at 20% viewport (already present — tune).
3. Booking panel slide-in on first scroll past hero.
4. Brass underline grow on card hover, image scale 1.0→1.04 (present — audit consistency).
5. Availability month hover states, calendar→widget pre-fill animation.
6. Jaali dot-grid section markers + 60%-width brass rules between every major section (consistent placement = visual symmetry).
7. **What stays un-animated** per spec: nav links, body text, buttons (color/underline only).
8. `prefers-reduced-motion` honored by every new animation.

**Quality gate:** No animation longer than spec, no jank (<16ms frames on mid-range Android), reduced-motion produces a fully usable site.

---

## Phase 5 — Performance, SEO, Accessibility, QA *(launch readiness)*

1. **Performance:** image audit (convert remaining JPGs → WebP, responsive `srcset`, explicit width/height to kill CLS), font preload, lazy-loading below fold. Targets: Lighthouse 90+ all categories, LCP <2.5s, CLS <0.1, sub-2s on 4G.
2. **SEO:** sitemap.xml, robots.txt, canonical tags, Search Console submission checklist, per-page meta verified.
3. **Accessibility:** WCAG AA contrast pass, full keyboard navigation (incl. lightbox, menu, booking card focus traps), descriptive alt text per image, visible labels, 16px minimum body.
4. **QA matrix** per `claude.md` §8: iPhone Safari, Android Chrome, iPad, desktop Chrome + Safari; all tel/wa.me links; message preview end-to-end; calendar seeded.

**Quality gate:** The full §8 Soft-Launch checklist items that are code-controlled all check green.

---

## Phase 6 — Scale Path *(deferred, trigger-based per claude.md §5)*

- Next.js + Sanity migration when: 3+ new estates, or first non-technical content manager.
- PWA/service worker for offline property pages.
- Return-guest CRM flags, QR codes per property, Instagram OG pipeline.

---

## Owner Inputs Needed (not code — flagged early)

| Input | Blocks |
|---|---|
| Real "from ₹/night" anchor prices + min nights + inclusions | Phase 1 §3 |
| Caretaker names, photos, bios (3 properties) | Phase 1 §9 |
| 4–6 local spots per property | Phase 1 §10 |
| Cancellation/privacy/terms text approval | Phase 3 |
| GSTIN | Phase 2 |
| Google Sheet + Apps Script authorization | Phase 2 |

Placeholders with correct structure will be built wherever inputs are pending — nothing blocks the build.
