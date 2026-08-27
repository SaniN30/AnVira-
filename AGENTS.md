# AnVira — Master Document
### Ideas, Vision & Development Roadmap
*Compiled from ideasV2.md — June 2026*

---

## 1. Project Vision

AnVira is a direct-booking platform for India's top-tier private villa estates — competing not with OTAs but with the digital experience of Aman, Oberoi, and Six Senses. The platform must not just look luxury — it must *feel* trustworthy and certain to a guest spending ₹1,50,000/night.

**Core positioning:** Private estates. Direct access. No OTA presence.

**Reference brands:** Aman Resorts, The Oberoi Group, Six Senses, Domaine des Etangs, LVMH Hospitality.

---

## 2. Guest Journey (6 Stages)

Every platform decision maps back to one of these six stages:

```
DISCOVERY → CONSIDERATION → DECISION → PRE-ARRIVAL → STAY → POST-STAY
```

| Stage | Key Platform Requirement |
|---|---|
| Discovery | OG image per property, sub-2s load, WhatsApp-preview-ready share link |
| Consideration | 30+ pro photos, video walkthrough, staff intro, verified reviews, anchor pricing |
| Decision | Sticky booking widget, month-level availability calendar, Message Preview Card |
| Pre-Arrival | Private `/arrive/[slug]` guest info page — directions, caretaker contact, house notes |
| Stay | Local staff-curated recommendations, QR code in property linking to page |
| Post-Stay | Review submission page, return guest recognition via WhatsApp + simple CRM log |

---

## 3. Design System

### Color Palette

| Role | Name | Hex |
|---|---|---|
| Page Background | Lime Wash | `#F5F1E8` |
| Surface / Cards | Bone | `#FAF8F3` |
| Primary Text | Ink | `#18181A` |
| Secondary Text | Dust | `#7A7670` |
| Accent | Patina Brass | `#A87C45` |
| Accent Wash | Turmeric Mist | `#EFE0C0` |
| Structural | Linen Rule | `#D6CEBF` |
| WhatsApp | Monsoon Green | `#1F9E5F` |
| Error | Fired Clay | `#B5513A` |

**Rule:** No pure `#000000` or `#FFFFFF` anywhere. Everything lives in the warm tonal range.

### Typography

| Role | Typeface | Variant |
|---|---|---|
| Display / Hero | Cormorant Garamond | Light Italic 300 |
| Editorial Headings | Cormorant Garamond | Regular 400 |
| UI / Body | DM Sans | Regular 400 |
| UI Emphasis | DM Sans | Medium 500 |
| Data / Numbers | DM Mono | Regular 400 |
| Micro / Attribution | Spectral | Light Italic 300 |

### Design Language: Indian Spatial Geometry
The differentiating layer — not decorative, but *structural*:
- **Section dividers:** inset brass line, 60% width, 0.5px, starting at left margin
- **Image frames:** image bleeds off one edge, border holds the other — like a pinned photograph
- **Hero layout:** left-anchored text, full-bleed image on the right (asymmetric, like a courtyard framing)
- **Micro-motif:** a 4×4 dot grid (16 dots) used as a section marker — inspired by jaali geometry

### Layout
- Grid: 10-column (wider margins, more refined feel)
- Max content width: `1080px`
- Section padding: `160px` desktop / `80px` mobile
- One focal point per section — no competing sections

### Motion Principles
*Unhurried but precise:*
- Hero text: word-by-word stagger, 40ms delay
- Hero image: Ken Burns slow zoom 100→103% over 8s
- Section entry: fade-up 30px, 0.7s ease-out, triggered at 20% viewport
- Property card hover: image scale 1.0→1.04, shadow deepens, brass underline grows
- Booking widget: slides in from right on first scroll past hero
- Message preview card: unfolds from button like paper — scale + opacity, 0.5s spring
- WhatsApp button: soft concentric pulse, 4s interval, 0.3 opacity max
- **Not animated:** nav links, body text, buttons (only color change / underline wipe)

---

## 4. Key Feature Specs

### 4.1 The Message Preview Card (Signature Interaction)
When the guest taps "Book via WhatsApp":
1. Button reads "Preparing your enquiry..." (0.3s)
2. A card unfolds from the button (CSS scale-Y + opacity from origin point)
3. Card shows: property name, check-in/out, nights, guest count, editable name field, optional note field
4. Guest sees exactly what will be sent — can edit before sending
5. "Send on WhatsApp" opens `wa.me` with full pre-filled message
6. Card closes with soft collapse

**The "add a note" field** captures occasion context (anniversary, corporate retreat) that otherwise takes 2–3 WhatsApp messages to surface.

### 4.2 Availability Calendar (Lightweight)
- Month-view only — no exact date engine
- Green = available, Amber = partial, Grey = fully booked
- Clicking an available month pre-fills the booking widget
- Data source: JSON file or Google Sheet, updated manually by owner once a week

### 4.3 Pre-Arrival Guest Info Page
- Private URL: `/arrive/[property-slug]` — shared only in booking confirmation
- Contents: directions + Google Maps link, airport/railway distances, caretaker contact, house-specific notes, check-in/out times, what to bring

### 4.4 Post-Stay Review Page (`/reviews/submit`)
- Triggered via WhatsApp message after checkout
- Fields: Name, Occasion, Rating (1–5), Written review (max 200 words)
- No login required — name + phone verification only
- Reviews queue for owner approval before going live

### 4.5 "Coming Soon" Estate System
- Blurred/greyscale card or geometric Linen Rule placeholder
- Tag: *"Under Curation"* or *"Opening [Season/Year]"*
- "Notify me" CTA — saves WhatsApp number to waitlist
- On launch: WhatsApp broadcast to waitlist

---

## 5. Technical Architecture

### Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS with custom design tokens
- **Images:** Vercel Image Optimization or Cloudinary (WebP/AVIF)
- **Analytics:** Plausible or Vercel Analytics (privacy-first, no cookie banner)
- **Fonts:** `font-display: swap` + preload for Cormorant and DM Sans

### Performance Targets
- Lighthouse: 90+ across all four categories
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Page load: under 2 seconds on 4G
- PWA: installable on mobile, service worker for offline property page caching

### URL Structure
```
/                             → Homepage
/estates                      → Full portfolio
/estates/[slug]               → Property page
/arrive/[slug]                → Pre-arrival guest info (private)
/reviews/submit               → Post-stay review form
/about                        → Brand story (optional)
/legal/privacy
/legal/terms
/legal/cancellation
```

### Booking Flow (Technical)
```
Guest fills widget
  → Validates dates + guest count
  → Generates pre-filled message string
  → Opens Message Preview Card
  → Guest edits name + note
  → Click "Send on WhatsApp"
  → window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`)
  → [Optional] POST to /api/log-enquiry → Google Sheet via Sheets API
```

The enquiry log sheet columns: `Timestamp | Property | Check-in | Check-out | Guests | Name | Status`

### Data Model (Property)
```typescript
interface AnViraEstate {
  slug: string;
  name: string;
  tagline: string;
  location: {
    display: string;
    altitude?: string;
    coordinates: [number, number];
    directions_url: string;
    nearest_airport: string;
  };
  capacity: {
    rooms: number;
    guests: number;
    bathrooms: number;
    area_sqft?: number;
  };
  pricing: {
    from_per_night: number;
    currency: "INR";
    note: string;
    minimum_nights: number;
    minimum_nights_weekend?: number;
    whats_included: string[];
    whats_extra: string[];
  };
  media: {
    hero_image: string;
    og_image: string;        // 1200×630px for social sharing
    gallery: string[];
    video_url?: string;
  };
  availability: {
    [yearMonth: string]: "available" | "partial" | "booked";
  };
  amenities: Amenity[];
  staff: { name: string; role: string; bio: string; photo: string; }[];
  local_guide: LocalSpot[];
  faq: { question: string; answer: string; }[];
  cancellation_policy: string;
  reviews: Review[];
  contact: {
    whatsapp: string;
    phone: string;
    whatsapp_message_template: string;
  };
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
    schema: object;          // JSON-LD LodgingBusiness
  };
  status: "active" | "coming_soon" | "seasonal";
  opening?: string;
}
```

### CMS Strategy
| Phase | Condition | Solution |
|---|---|---|
| Phase 1 | Now | JSON files in `/data/estates/*.json` — version controlled |
| Phase 2 | 3+ estates or first non-technical co-manager | Sanity.io (free tier) |
| Phase 3 | 10+ estates | Custom admin panel or Sanity with custom schemas |

---

## 6. Content Standards

### Photography (per estate)
**Hero shots (3–4):** arrival/driveway, signature outdoor space at golden hour, best bedroom, gathering space.

**Supporting shots (20–25):** each bedroom, each bathroom, kitchen detail, staff portrait, local surroundings, night exterior shots, detail shots (brass hardware, linen, candles).

**Avoid:** fish-eye lenses, HDR processing, empty pools, visible cleaning supplies, stock "people enjoying villa" photos.

### Copy Voice
- Confident without arrogant. Warm without casual. Specific, not superlative. Indian in reference, international in register.

| Avoid | Use instead |
|---|---|
| "Stunning mountain views" | "The ridge at Chail sits at 2,250 metres. The view earns it." |
| "Luxurious amenities" | "Five bedrooms. A heated pool. A staff of four who know this house intimately." |
| "Book now for an unforgettable stay" | "Enquire. We'll take care of the rest." |

### Local Recommendations Format (per property, 4–6 spots)
Each entry: Name · one-line description in AnVira voice · distance in minutes · Best for: [single label]

---

## 7. Development Roadmap

### Phase 0 — Foundation (Before Any Code)
- [x] Finalise design tokens (colors, type scale, spacing) in a Figma/tokens file
- [ ] Confirm WhatsApp Business number (verified, green tick)
- [ ] Confirm dedicated business phone line
- [ ] Decide on CMS approach (Phase 1: JSON files)
- [ ] Set up Google Sheet for enquiry logging
- [x] Define 3 launch properties and their slugs

---

### Phase 1 — Core Pages (MVP)

**1.1 Homepage**
- [ ] Left-anchored hero (45% text / 55% full-bleed image)
- [ ] Estate collection grid (3 cards, asymmetric image frames)
- [x] Philosophy block (Cormorant Italic quote, Turmeric Mist background)
- [ ] Experience Pillars section (6 icons, 2-column, staggered reveal)
- [x] Guest Voices carousel (named, occasion-specific testimonials)
- [x] Final CTA strip — WhatsApp + Call

**1.2 Estate Listing Page (`/estates`)**
- [x] All active estates as cards
- [ ] Coming Soon cards with "Notify me" waitlist capture
- [ ] Filter by: location / capacity (simple, not complex)

**1.3 Property Page (`/estates/[slug]`)**
- [ ] 100vh parallax hero, estate name bottom-left (Cormorant Italic), location in Spectral
- [x] Floating booking bar overlapping hero (Aurelia-match layout, superseding earlier sticky right-column plan)
- [ ] Property story prose (600px max width)
- [x] Quick stats (rooms · guests · baths)
- [x] Masonry gallery (3-column, lightbox on click)
- [x] Amenities icon grid
- [x] Month-level availability calendar
- [x] Location section with Google Maps embed
- [ ] Staff introduction (photo + bio paragraph)
- [ ] Local guide (4–6 curated spots)
- [ ] Reviews section (approved, named, dated)
- [ ] Similar estates (2 cards)
- [ ] Anchor price + minimum nights + what's included/extra

**1.4 Booking Widget + Message Preview Card**
- [x] Date inputs (check-in / check-out) with validation
- [x] Guest count input with capacity cap
- [x] Name field
- [x] "Preview Message" button
- [x] Message Preview Card animation (paper unfold from button)
- [x] "Add a note" optional field in card
- [x] "Send on WhatsApp" → `wa.me` deep link
- [x] "Call Instead" fallback
- [ ] `/api/log-enquiry` → Google Sheets logging

**1.5 Legal & Policy Pages**
- [ ] `/legal/privacy`
- [ ] `/legal/terms`
- [ ] `/legal/cancellation`

---

### Phase 2 — Guest Journey Completion

**2.1 Pre-Arrival Pages**
- [ ] `/arrive/[slug]` — private, link-shared with confirmed guests only
- [ ] Contents: directions, map, airport/rail distances, caretaker contact, house notes, check-in policy

**2.2 Review Submission**
- [ ] `/reviews/submit` — triggered via post-stay WhatsApp message
- [ ] Form: name, occasion, star rating, written review (200 words max)
- [ ] No login — phone verification
- [ ] Owner approval queue before public display

**2.3 Coming Soon Waitlist**
- [ ] "Notify me" form on Coming Soon cards → saves name + WhatsApp number
- [ ] Simple storage (Google Sheet)

---

### Phase 3 — Polish & Performance

**3.1 Performance**
- [ ] Lighthouse audit — target 90+ all categories
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] Image pipeline: WebP with AVIF fallback
- [ ] Font preloading: Cormorant + DM Sans
- [ ] PWA: service worker, offline caching for property pages

**3.2 SEO**
- [ ] `meta_title` + `meta_description` per page
- [x] JSON-LD `LodgingBusiness` schema per property
- [ ] OG image (1200×630px) per property for social previews
- [ ] Sitemap + Google Search Console submission

**3.3 Accessibility**
- [ ] WCAG AA contrast — check Dust `#7A7670` on Bone `#FAF8F3`
- [x] Keyboard navigation + visible focus states
- [x] Descriptive alt text for all images
- [x] Visible form labels (not just placeholder text)
- [x] `prefers-reduced-motion` respected globally
- [ ] Body font minimum 16px

**3.4 Motion System**
- [x] Global scroll-triggered fade-up (IntersectionObserver)
- [ ] Hero Ken Burns (CSS animation)
- [x] WhatsApp button pulse
- [x] Property card hover states
- [x] Message Preview Card unfold animation
- [x] Gallery lightbox open/close

---

### Phase 4 — Operations & Growth

**4.1 CMS Migration (Sanity.io)**
- Trigger: 3+ estates or first non-technical co-manager
- [ ] Sanity schema matching `AnViraEstate` TypeScript interface
- [ ] GROQ queries replacing JSON imports
- [ ] Owner/editor login for content updates

**4.2 Return Guest Recognition**
- [ ] Guest log: name + phone + property + dates (Google Sheet, Phase 1)
- [ ] Manual flag for returning guests in WhatsApp conversation
- [ ] Personalised welcome-back message template

**4.3 Instagram / Social**
- [ ] OG image per property confirmed and tested in WhatsApp/iMessage preview
- [ ] "Share this estate" button generating preview link
- [ ] QR code per property (for physical display in estate) → links to property page

---

## 8. Pre-Launch Checklist

### Soft Launch (3 properties)
- [ ] WhatsApp Business verified (green tick)
- [ ] Professional photography complete (min. 20 images per property)
- [ ] Video walkthrough for at least 1 estate
- [ ] Pricing anchors confirmed
- [ ] Cancellation policy written and reviewed
- [ ] Privacy policy + T&Cs live
- [ ] GSTIN in footer
- [ ] All 3 property pages complete (story, gallery, amenities, FAQ, local guide, caretaker)
- [ ] WhatsApp Business: profile, description, hours, quick replies, away message
- [ ] Google Search Console connected + sitemap submitted
- [ ] Lighthouse 90+ verified
- [ ] Tested on: iPhone Safari, Android Chrome, iPad, desktop Chrome + Safari
- [ ] All phone/WhatsApp links tested
- [ ] Message preview card tested end-to-end
- [ ] Availability calendar seeded

### Public Launch
- [ ] Instagram account: minimum 12 posts live
- [ ] Google Business Profile created for AnVira
- [ ] 3 founding reviews live on site (real past guests)
- [ ] Press mention in Indian luxury/travel publication (optional but powerful)
- [ ] Enquiry log (Google Sheet) live and monitored
- [ ] WhatsApp 2-hour response SLA being honoured

---

## 9. Competitive Edge Summary

| What most villa sites do | What AnVira does instead |
|---|---|
| "Contact us" form | WhatsApp with fully pre-filled context |
| Generic "luxury" copy | Property-specific prose that earns the word |
| No pricing until enquiry | Anchor "from" price + inclusions, prominently |
| Anonymous star reviews | Named, dated, occasion-specific testimonials |
| Staff invisible | Caretaker introduced by name and photograph |
| No local guidance | Staff-curated 4–6 spot local guide |
| Guest abandoned post-booking | Pre-arrival info page + 48h check-in message |
| No post-stay follow-up | Review request + return guest recognition |
| "Under construction" for new estates | "Under Curation" card with waitlist capture |
| Slow mobile experience | Sub-2s load, offline caching, native inputs |

---

## Single-property site (2026-08 — Delhi/Goa removed)

AnVira is now a single-property site: Villa AnVira, Chail. Estate 10 (Delhi)
and Tarika's Seascapes (Goa) — their pages, images (`Delhi/`, `Goa/`), and
`assets/js/data.js` entries — were removed. `assets/js/data.js` now carries
one entry in `PROPERTIES` (`villa-anvira`).

`tools/build-estates.mjs`, the old multi-estate HTML generator, was deleted.
There is no generator step for any page — every page below is hand-authored
static HTML sharing `assets/css/main.css` and the scripts in `assets/js/`.
`estates/villa-anvira.html` is kept only as a `<meta http-equiv="refresh">`
redirect stub to `../index.html` for old bookmarks/QR codes.

## Multi-page structure (2026-08 — split from the single merged index.html)

The site was originally one giant `index.html` carrying hero, full story,
amenities, availability, gallery, local guide, reviews, and the booking
widget all on one page. It is now split to mirror the Aurelia reference
nav 1:1 — every page shares the same dark permanent header/menu/footer
(`Home` / `Villa` / `Gallery` / `Plan a Stay` / `Contact`, with
`aria-current="page"` on the active link):

- `index.html` — **Home**: full-bleed hero (two CTAs, no inline booking
  form), a short story teaser with the story-section background video,
  a 4-tile gallery highlight (photos + one looping video card), closing
  WhatsApp CTA. No `#bw` form, no `#mpc-wrap` modal, no availability grid.
- `villa.html` — **Villa** (Aurelia's "Rooms" equivalent): the full
  story/prose, room/guest/bath stats, a "featured" quick-facts card,
  amenities & features panel, local guide, and the price/included
  aside — everything that used to be `index.html`'s middle section.
- `gallery.html` — **Gallery**: the full 37-photo filterable grid +
  lightbox (recovered from a prior interrupted pass; see git log for
  `av-sketch-bg`, `#dnav a::after` nav-underline hover, and the
  `initBooking`/`estate.js` null-guards described below).
- `plan-a-stay.html` — **Plan a Stay**: the dedicated booking page every
  Book/Check-availability CTA site-wide points to. The only page carrying
  `#bw` (the floating `.ep-hero-book` form over its own hero) and the
  `#mpc-wrap` Message Preview Card modal, plus the price/included aside.
  It no longer carries an availability calendar (removed 2026-08) — the
  booking flow is guest count, check-in/out fields, and WhatsApp/inquiry
  submission only.
- `contact.html` — **Contact**: location/map, WhatsApp/call/email
  contact-method cards, and the Guest Voices reviews section.

Because `#bw`, `#mpc-wrap`, `#pd-gallery`, `.ep-aside` etc. no longer all
live on one document, `assets/js/booking.js` and `assets/js/estate.js`
null-guard every lookup for markup that may not exist on the current
page (e.g. `booking.js`'s whole Message-Preview-Card wiring block is
gated behind `if (bwForm && mpcWrap) { ... }`, not just `initBooking()`).
`estate.js` still calls `initBooking(EP)` unconditionally on every page
(it's cheap — `renderAvailability`/the live reviews fetch just no-op if
their container isn't present) — do not re-gate that call itself, only
guard the DOM lookups inside.

Shared background-video frames (`.av-video-frame` for the tall arch-topped
portrait slot, `.av-video-card` for the small gallery-highlight tile) live
in `assets/css/main.css` and `core.js` (`canplay` → adds `.loaded`, fading
the `<img class="av-video-poster">` fallback). Reuse these classes for any
future video slot instead of hand-rolling new markup.

## Favicon (2026-08, recolored white-on-ink)

`brand/favicon-{16,32,192}.png` and `brand/apple-touch-icon.png` are the "AV"
monogram mark cropped from `brand/logo-transparent.png` (top ~500x500 square,
via `sips --cropOffset`/`--cropToHeightWidth`/`-z`, not a hand-drawn asset).
The mark itself is now recolored solid white and baked onto an opaque
rounded-square Ink (`#18181A`) backdrop at every size — a straight white
mark on the site's own transparent/cream background was tested and found
nearly invisible in light-themed browser tab chrome (the dominant case);
only the dark-chrome case read fine. The ink backdrop fixes that without
reverting to the original brass color. Regenerate via ImageMagick/PIL if
either becomes available; this pass used two from-scratch Node scripts
(`recolor-png.js` — decode/unfilter/recolor RGB→white keep alpha/re-encode;
`make-icon.js` — composite the white mark onto an antialiased rounded-rect
ink fill) since neither ImageMagick nor Python PIL/pip was available in this
sandboxed Nix shell — only stdlib `zlib` for PNG inflate/deflate. Both
scripts only handle 8-bit RGBA (colorType 6), non-interlaced PNGs; verify
`sips -g all <file>` matches that before reusing them on a different source.
If the logo changes, regenerate the white-mark crop from
`brand/logo-transparent.png` (not `logo.png`, which has an opaque background)
and re-run both scripts rather than hand-editing pixels. Every page's
`<head>` links all three `rel="icon"` sizes plus `rel="apple-touch-icon"`;
`index.html`'s CSP already allows these under `img-src 'self'`.

A white-on-ink recolor of `favicon-{16,32,192}.png` was tried for tab
visibility but rejected — a solo white recolor reads as nearly invisible
on light tab backgrounds, the common case. A corrected color (readable on
both light and dark tab chrome) is being handled separately; don't
recolor these files without checking that work first.

## Page generation & CSP

`index.html` is the only page carrying a `Content-Security-Policy` meta tag.
`assets/js/data.js` is still the single source of truth for the property's
copy/specs/images/availability, read at runtime by `booking.js`,
`gallery.js`, and `estate.js`.

Analytics: Google Ads gtag.js (conversion ID `AW-18140671098`) is loaded on
every page; see "Google Ads conversion tracking — WhatsApp click + form
submit" below for how WhatsApp clicks and form submits are tracked. gtag's
remarketing pixels hit arbitrary Google ccTLDs (e.g. `google.co.in`) that
CSP intentionally does not whitelist — only the core conversion-tracking
origins are allowed; the primary conversion signal still fires.

## CSS id/class reuse — check for dead-rule collisions before trusting styles

`assets/css/main.css` still carries CSS from an older multi-estate homepage
layout (giant wordmark hero, centered owner's-quote block, a standalone
340px booking-widget card, etc.) whose HTML no longer exists. The current
single-property `index.html` reuses some of the same ids/classes
(`#hero`, `#story`, `#bw`, `.ep-story-col`) for unrelated new markup, so
those dead rules silently apply and corrupt layout (wrong widths, forced
`text-align: center`, fixed narrow card sizing) with no visual cue in the
source order. If a section's computed layout doesn't match its authored
rule, grep the id/class across the whole stylesheet (not just the nearest
block) and check for an unrelated older rule targeting the same selector —
delete it if the old HTML is confirmed gone, don't just patch around it.

## Hero structure — `.ep-hero-media` wrapper (2026-08 — cosmetic/animation pass)

`.ep-hero` (used by `index.html` and `plan-a-stay.html`) wraps its `<img>`,
`.ep-hero-overlay` and `.ep-hero-caption` in a `.ep-hero-media` div.
`.ep-hero-media` — not `.ep-hero` — is what carries `position:absolute;
inset:0; overflow:hidden` (the Ken Burns clip). `.ep-hero` itself stays
unclipped so the booking bar (`.ep-hero-book` on plan-a-stay,
`.home-bw` on the homepage) can flow in normal document flow below the
hero on mobile without being clipped along with the image — on
`max-width:900px` those bars go `position:static` and `.ep-hero-media`
switches from absolute-inset0 to a real-height block (`78svh`) so the
static bar renders after it instead of overlapping at the section's
top edge. `.ep-hero-caption`'s absolute positioning is anchored to
`.ep-hero-media` (its nearest positioned ancestor), not `.ep-hero`, so
its `bottom` offset stays pinned to the photo's own box on both
breakpoints. If a hero image/booking-bar layout looks broken again,
check this structure before re-deriving it from scratch — and note
`main.css` is served with no cache headers by most static file
servers, so a stale cached copy after edits is a common false lead;
re-fetch it (a `?cb=` query bump or hard reload) before trusting
`getComputedStyle` output while iterating live.

Background `<video>` slots (`.av-video-frame` / `.av-video-card`)
cycle through every clip in `assets/video/` back-to-back via a
crossfading two-layer player wired in `core.js`'s
`initVideoPlaylists()` — don't reintroduce a single hardcoded
`<source>` per slot, and add any new clip to the `PLAYLIST` array
there so every slot picks it up.

## Video playlist cycling — guard against re-entrant crossfade (2026-08 — polish pass 3)

`initVideoPlaylists()`'s poll loop (150ms) checks "near end of clip"
and fires `crossfade()`, which pauses/swaps `active`/`standby` inside
a 620ms `setTimeout`. That condition stays true for several poll ticks
before the swap actually happens, so without a guard the poll fires
`crossfade()` multiple times per transition — the second call's
timeout pauses the *newly active* (just-swapped-in) video instead of
the old one, permanently freezing every slot at `currentTime: 0`
after the first transition. Fixed by a `transitioning` flag set at
the start of `crossfade()` and cleared at the end of its timeout,
checked by the poll before re-firing. If videos ever freeze again
after one loop, suspect a reintroduced re-entrancy path here first —
reproduce via `chrome-devtools-axi eval` polling `paused`/`currentTime`
on `document.querySelectorAll('video')` across a full clip duration,
not just a single snapshot (the freeze only appears after the first
crossfade completes).

## Type system — Manrope replaces DM Sans, Spectral folded into Cormorant italic (2026-08 — polish pass 3)

To match the Aurelia reference more closely and stay within a 3-family
budget (Cormorant Garamond / Manrope / DM Mono), `DM Sans` was replaced
site-wide with `Manrope` for UI/body text, and the one `Spectral` italic
rule (micro/attribution) now uses `Cormorant Garamond` italic instead.
The Google Fonts `<link>` on every page was updated to match (Manrope
400/500/600/700, Cormorant now includes 500, Spectral dropped). If you
add new UI copy, use `Manrope`, not `DM Sans` — the old family is no
longer loaded. `--gold` was also nudged from `#B08D4F` to `#B99A6B` to
sit closer to Aurelia's sampled accent color.

## `.av-sketch-bg` pencil-sketch texture — visibility (2026-08 — polish pass 3)

The reusable `.av-sketch-bg::before` backdrop was tiling `repeat-x`
only (leaving vertical gaps in tall sections) at low opacity (`.5`
outer × `.35` SVG stroke ≈ 0.17 effective) — effectively invisible
against the warm cream background. Now tiles both axes (`repeat`) at
higher opacity (`.9` outer × `.6` stroke). It's dense photo grids
(e.g. gallery.html's `#pd-gallery`) that still visually crowd it out
in the tile area itself — that's inherent to a wall-to-wall image
grid, not a bug; the texture reads in the surrounding page margins.

## `.cta` must stay `display: inline-block` (2026-08 — mobile-first pass)

`.cta` is applied to `<a>` tags sitewide. An anchor's default display
is `inline`, and vertical margin/padding on an inline box doesn't
affect layout — it only extends the paint area — so a `.cta` link
immediately following a text block will visually paint over that
block's last line by its own `padding-top` even though the boxes
don't actually overlap in the layout. Reproduced on villa.html's
"Featured — quick facts" card at desktop width before this was fixed.
If a new `.cta` variant ever loses this `display: inline-block`
(e.g. a scoped override), expect the same silent paint-overlap bug.

## Custom cursor (`#cursor-ring`) — never combine individual `rotate:` with a JS `transform:` (2026-08)

`#cursor-ring` used the CSS individual `rotate: 45deg` property (to make
a diamond) alongside `core.js` setting `style.transform =
translate(...)` every `mousemove`. Per the CSS Transforms spec,
individual transform properties (`translate`/`rotate`/`scale`) compose
with the `transform` property around the SAME transform-origin, in a
fixed order — the rotation ends up applied to the whole translate
vector from the element's static near-(0,0) position out to the
mouse, not to the box in place. In practice this flings the ring far
off-screen (hundreds of px away) whenever the mouse is anywhere but
very close to the origin, leaving only the plain `#cursor-dot` visibly
"stuck" wherever the ring last rendered before the math blew up —
this is what read as a broken/stuck cursor mark overlapping page
content. Fixed by removing `rotate: 45deg` from CSS and instead
appending `rotate(45deg)` inside the same `transform:` string JS
already sets. If the diamond ever needs to rotate/scale again, keep
that transform in the one JS-driven `transform` property — never
split it across an individual CSS transform property and a
JS-assigned `transform`.

## `.ep-main` first-child spacing — nested sections lose their gap (2026-08)

`.ep-section` relies on `.ep-section:first-child { margin-top: 0;
padding-top: 0; }` so the very first section on a page doesn't get
extra top spacing. On villa.html, `#amenities` is visually the second
block on the page (right after the `#story` section) but it's the
FIRST child of `<article>` (itself nested inside `.ep-main`, a sibling
of `#story` at the `.ep-wrap` level) — so the first-child rule zeroed
its spacing even though a previous section renders directly above it.
This produced a real 0px gap (not just a small one) between whatever
ends `#story` (the "Featured — quick facts" card) and `#amenities`
below it, at every viewport width. Fixed with `margin-top:
var(--space-4)` on `.ep-main` itself. If a future section is wrapped
one level deeper than its visual predecessor (nested in `<article>`,
a grid, etc.), check whether `:first-child`/`:last-child` spacing
rules are silently zeroing it out — the bug won't show as "no spacing
at all" in casual review, it shows as exactly 0px between two
unrelated-looking elements.

## Villa hero stacked photo deck (`.ep-hero-stack`, 2026-08)

villa.html's hero replaced a single static image with 4 layered photo
cards (absolute-positioned, each offset/rotated via `--x`/`--y`/`--r`
custom properties set inline per card). `@media (max-width: 900px)`
collapses this to a plain horizontal scroll-snap carousel (`position:
static`, `transform: none !important`, `scroll-snap-align: center`) —
don't reintroduce the absolute/rotated layout below 900px, it doesn't
degrade safely on narrow viewports.

Above 900px the deck fans out into a 2x2 quadrant grid that fills the
dark hero panel (each card's `top`/`left`/`right`/`bottom` — not
`transform`, so the corner-stack's `--x`/`--y`/`--r` transform can
still hold the resting tilt — animate to `0/54%` combinations, one
combo per `nth-child`, staggered via `transition-delay`), then
collapses back to the corner stack. Three triggers share the same
`.is-spread` CSS block: real `:hover`/`:focus-within` (mouse), a
`.is-spread` class toggled by tap/Enter on touch devices at this
breakpoint (`initVillaHeroStack()` in `core.js` adds `role="button"`
+ the click/keydown handler only when `matchMedia('(hover: none) and
(min-width: 901px)')` matches — e.g. iPad landscape, which has no
hover), and a one-time `IntersectionObserver` auto-showcase that
spreads-then-collapses the first time the stack scrolls into view on
any pointer type, so the interaction is discoverable without a
hover/tap. `prefers-reduced-motion: reduce` skips both the toggle
handlers and the auto-showcase and instead adds `.is-spread-static`
once, permanently — same quadrant CSS, just reached by a third class
rather than hover/`.is-spread`, so reduced-motion users still see all
four photos instead of the animation being disabled outright with
photos left hidden behind each other. Reuse this pattern (quadrant
inset positions + shared hover/tap/auto-showcase/reduced-motion-static
class group + mobile-collapse-to-carousel) for any future multi-image
hero slot instead of a new one-off.

## Testing scroll-reveal/lazy content with chrome-devtools-axi

`.fi`/`.fi.vis` (IntersectionObserver fade-up), `.ep-aside.pre`/`.in`
(a second, separate reveal class used by the plan-a-stay/villa aside),
and native `loading="lazy"` images (gallery.html's 37 photos) all only
resolve once the real viewport has scrolled past them. `screenshot
--full-page` does not scroll-and-wait for any of this — it can show
blank cream boxes where images belong, sections still at `opacity:0`,
and (separately) duplicate the sticky header at a wrong stitch
boundary. None of that reflects a real user's experience. Before
trusting a full-page capture, force-reveal
(`document.querySelectorAll('.fi').forEach(el=>el.classList.add('vis'))`,
same for `.ep-aside.pre`→`.in`) and scroll to `body.scrollHeight` and
back to trigger lazy images, then re-screenshot. Also: `position:fixed`
elements (`#sticky-book`, `#float-wa`, the off-canvas `#menu` drawer)
can appear to overlap unrelated content in a full-page stitch or make
`document.documentElement.scrollWidth` read wider than the viewport —
verify with a real single-viewport screenshot at the actual scroll
position (and `getBoundingClientRect`) before treating either as a bug.

## `#bw .cta` id-scoped `width:100%` silently wins over class-scoped overrides (2026-08)

`#bw .cta { width: 100%; ... }` (assets/css/main.css, the standalone
detail-page booking widget's submit button) has higher specificity
than any `.some-class .cta` override, including
`.ep-hero-book .cta`/`.home-bw .cta` (the floating dark booking bars'
button styling), regardless of source order — an id always beats any
number of classes. On plan-a-stay.html this stretched the "Check
Availability" button to the full flex-row width at ≥901px (nowrap
kicks in there), overflowing hundreds of px past the bar. `.home-bw`
was unaffected only because its form's id is `home-bw`, not `bw`.
Fixed by scoping the hero-book override to `.ep-hero-book #bw .cta`.
If a booking-bar button or other `#bw`-scoped control ever looks
wrong only on wider desktop widths, check for this id-vs-class
specificity collision before re-deriving the flex layout from
scratch — and if a new `.home-bw`-style bar is ever added, make sure
its form id isn't `bw`, or it inherits the same trap.

## Tariff card — `.ep-incl`/`.ep-incl-title` (Aurelia treatment, 2026-08)

The "Your Stay" card's Included/On Request lists (shared by
villa.html, plan-a-stay.html, and contact.html's "Stayed with us?"
via the same `.ep-incl-title` class) use Cormorant Garamond italic
sub-headings, a thin inset brass rule (`.ep-incl::before`, same
pattern as `.ep-section::before`), and diamond bullets — solid ◆ for
included, hollow ◇ + italic for on-request — instead of dash/plus
list markers. Reuse this pattern for any future included/optional
feature list instead of reintroducing plain bullets.

## Testing with chrome-devtools-axi in this multi-worktree setup — always set `CHROME_DEVTOOLS_AXI_SESSION`

Multiple crewmate agents can run in parallel across sibling
`AnVira-ad2cbf/<n>/AnVira` worktrees, each starting its own local
static file server on its own port. `chrome-devtools-axi` defaults to
a single shared browser session (`CHROME_DEVTOOLS_AXI_SESSION=default`)
— without an explicit unique session name, one agent's `open`/`resize`/
`emulate` calls can hijack another agent's active tab and browser
state mid-task, so a screenshot can silently show a *different*
worktree's stale HTML/CSS on a *different* port. Always
`export CHROME_DEVTOOLS_AXI_SESSION=<task-specific-name>` before the
first `chrome-devtools-axi` call, and sanity-check
`chrome-devtools-axi eval "(() => location.href)()"` after `open` to
confirm you're on your own port before trusting any screenshot or
`getBoundingClientRect` result.

A registered `ServiceWorker` (Phase 3's PWA offline caching) will serve
a stale `assets/css/main.css`/`assets/js/*.js` from its cache even
after a hard reload once it's installed once for `localhost` in a
chrome-devtools-axi session — a CSS rule that verifiably parses
correctly in `document.styleSheets` cssRules can still fail to apply
visually for this reason, which reads exactly like a specificity bug
but isn't one. If a change doesn't show up despite the served file
(checked via `curl`) being correct, check
`navigator.serviceWorker.getRegistrations()` before debugging CSS
specificity — `rs.forEach(r=>r.unregister())` plus `caches.keys()` /
`caches.delete()` clears it. Also: this repo is checked out into
multiple parallel Treehouse worktrees, and a stray local dev server
left running from a previous session (e.g. `python3 -m http.server
8765`) may have `cwd` in a *different* worktree — check
`lsof -p <pid> | grep cwd` (or just start your own server on a free
port) rather than assuming a server already listening on a familiar
port is serving your current checkout. A shared default
chrome-devtools-axi browser session can also already be driven by a
concurrent agent in another worktree/lane — if navigations or DOM
state change out from under you unexpectedly, set
`CHROME_DEVTOOLS_AXI_SESSION` to a unique name to get an isolated
browser instance instead of assuming you have exclusive control of
the default one.

## Mobile hero — fixed header can hide the bottom-anchored caption on short viewports (2026-08)

`.ep-hero-caption` (used by `index.html` and `plan-a-stay.html`'s shared
`.ep-hero`) is `position:absolute` anchored purely by `bottom:
clamp(...)`, growing upward from that point with no `top` guard, inside
a hero sized by the unconditional `.ep-hero { height:100vh; }` override.
`#nav` is a separate `position:fixed` element painted on top of
everything. On any real viewport shorter than the nominal device height
— mobile Safari's address bar can claim 80–140px before the first
scroll, and smaller/older phones simply have less height to begin with
— the caption's stacked content (eyebrow, title, subtitle, location,
both CTAs on the homepage) needs more room than is left below the
header, so it rides up underneath the opaque fixed header instead of
overflowing visibly. The eyebrow/title/early subtitle lines get painted
over and disappear; what's left (subtitle tail, location, CTAs) reads
as everything overlapping/crammed together — this is what a real
iPhone Safari screenshot reported as broken hero spacing, and it does
**not** reproduce with `chrome-devtools-axi resize` at a nominal
375×812 (see the tool gotcha below) — it only shows up once the
viewport height is genuinely short. Fixed with a `max-width:900px`
override: `.ep-hero { height:100dvh; }` (tracks the real visible
viewport) plus `.ep-hero-caption { top:5.5rem; bottom:1.6rem; display:
flex; flex-direction:column; justify-content:flex-end; }` — bottom-
aligned within a box that can never grow above the header. If the hero
caption ever looks cramped/overlapping again on mobile only, reproduce
at a **short height** (375×560, not just 375×812) before re-deriving
this from scratch.

This fix (and the mobile booking-bar/hero-CTA margin fix that removed
`.ep-hero-caption`'s extra 1.2rem side padding at 768px) is scoped to
`.ep-hero`, which only `index.html` and `plan-a-stay.html` use.
`villa.html`'s hero is a different component (`.ep-hero-split` — the
photo-stack hero, no CTAs/booking card) and was unaffected. It had its
own separate mobile gutter mismatch: `#villa-page-hero` is an
`.ep-section-dark` sitting directly in `<main>` (not inside `.ep-wrap`),
so its own card-style side padding (`clamp(1.4rem, 4vw, 2.6rem)`) was
acting as the page gutter there instead of matching `.ep-wrap`'s
`var(--pad-x)` gutter used by `#story` and everything below — a few px
of drift on narrow phones between the hero's left/right edge and the
content beneath it. Fixed with a `#villa-page-hero`-scoped override
pinning it to `var(--pad-x)`, without touching `.ep-section-dark`'s
padding generally (other instances like `#amenities` sit inside
`.ep-wrap` already and intentionally keep a smaller card inset).

## `chrome-devtools-axi resize` vs `emulate --viewport` — resize alone does not give a real mobile viewport

`chrome-devtools-axi resize <w> <h>` echoes back the requested
dimensions and *looks* like it worked, but it does not set the mobile
UA/touch/device-pixel-ratio flags — `window.innerWidth` can silently
stay at the browser's desktop default (observed: requested 375, actual
500) and `matchMedia('(hover: none)')`/touch-only code paths never
fire. Always use `chrome-devtools-axi emulate --viewport
"375x812x3,mobile,touch"` for any real mobile-viewport testing on this
site; verify with `eval "() => ({w:innerWidth,h:innerHeight})"` before
trusting a screenshot. Separately, this site's `#intro` "click to
enter" splash (auto-dismisses after ~2.8s, `intro.js`) and the
lead-capture popup (`#lead-popup-wrap`, appears ~3.5s after load unless
`localStorage.av_lead_captured` is set, `core.js`) both sit in front of
every page on first load — force-removing `#intro` from the DOM
instead of waiting it out (or clicking it) skips the `page.classList
.add('show')` step `endIntro()` does, leaving `#page` stuck at
`opacity:0`. Wait out the real timers (~4s) or add `page.show` yourself
after removing it, and always neutralize the lead popup too, or a
"blank/broken" screenshot is just this, not a real bug.

## Background-video clips all carry burned-in title/caption slates, not just one (2026-08)

`initVideoPlaylists()` in `core.js` previously excluded only
`villa-terrace-firepit-story.mp4` from the small `.av-video-card`
playlist on the assumption it was the only clip with a burned-in
title card ("The Luxury of Earned Silence..."). It isn't — every clip
in `assets/video/` is a produced highlight reel carrying multiple
caption/title overlays throughout its runtime (not just an opening
slate), confirmed by scrubbing `terrace-daytime-valley.mp4` and
`valley-terrace-golden-hour.mp4` frame-by-frame. There is no
guaranteed caption-free window to seek into. The fix that shipped:
every video slot now (a) starts playback ~2.6s in via a `#t=` media
fragment + `loadedmetadata` seek fallback (`TITLE_SLATE_SECONDS` in
`core.js`) to skip the worst opening title, and (b) `.av-video-card`
carries a permanent gradient scrim + centered `.av-video-play` icon
(main.css) so any caption that surfaces mid-loop reads as an
intentional "watch the trailer" tile instead of broken overlapping
text. If more clips are added to `PLAYLIST` in `core.js`, assume they
also carry captions unless verified otherwise.

Follow-up (2026-08): the original `.av-video-card::before` scrim's
middle band (opacity .08) was too weak — burned-in captions at
mid-clip and end-of-clip frames still read clearly and, worse, the
bottom-of-card captions collided directly with the `.av-video-tag`
("Watch") badge pinned at `bottom:10px`. Strengthened to a stronger,
more consistent gradient (.55 top / .4 middle / .82-.9 bottom, ramping
darker earlier — from 50% instead of 60%) so the badge/play-icon zone
stays reliably legible regardless of which frame is showing. Verified
by sampling screenshots across a full 8s loop per clip (all clips are
8s) at both desktop and mobile card sizes. `.av-video-frame` (the tall
story-section clip, `villa-terrace-firepit-story.mp4`) had NO scrim at
all and needed the same treatment added from scratch — its captions
were badly clipped/illegible against the bare video before this. If
either card's captions look wrong again, verify with real screenshots
across the full clip duration, not a single frame — a scrim that looks
fine at t=0 can still fail at a different point in the loop.

Follow-up (2026-08): the `.av-video-play` circular play-icon badge on
`.av-video-card` (homepage gallery-highlight grid) was removed
entirely per captain feedback — it read as an unwanted "video player
sign" over the card. The `.av-video-tag` ("Watch") text badge stays as
the card-level playing-video indicator. Separately, `.home-gal-grid a,
.home-gal-grid .av-video-card` forces every tile (including the video)
into a shared `aspect-ratio: 3/4`, but the wired clip
(`valley-terrace-golden-hour.mp4`) and its poster are native 9:16
portrait — a default-centered `object-fit: cover` crop trims equally
off top and bottom, cutting the clip's burned-in title caption off at
the card's top edge. Fixed with `object-position: center top` on
`.av-video-card video, .av-video-card img.av-video-poster` (rather
than giving the card its own aspect-ratio, which would have broken
row-height alignment with the plain photo tiles in the same
`repeat(4,1fr)` grid row) — anchoring the crop to the top means zero
pixels are ever trimmed off the top of the source frame, so a
burned-in caption anywhere near the top is never clipped, only the
excess at the bottom is. If another clip is ever wired to this card
with a differently-placed caption (e.g. bottom-anchored text), verify
its specific framing with real screenshots across a full loop before
assuming the same top-anchor still fits.

Follow-up (2026-08): the `.av-video-frame` scrim added above (uniform
~40-50% dark wash across the whole frame) over-corrected — captain
reported the whole clip now read as too dark/low-brightness on both
index.html and villa.html. Since the caption risk is really only at
the top/bottom edges (where this clip's burned-in title/subtitle
overlays actually sit, confirmed by scrubbing frames), the fix was to
concentrate the scrim there and drop it to near-nothing (`.12` opacity)
across the middle 46% of the frame, rather than a flat wash:
`linear-gradient(180deg, rgba(18,33,26,.4) 0%, rgba(18,33,26,.12) 22%,
rgba(18,33,26,.12) 68%, rgba(18,33,26,.42) 100%)`. Same top/bottom-heavy
principle as the `.av-video-card` scrim above, just tuned lighter since
`.av-video-frame` has no badge to protect and most of its frame is
plain scenery. If this clip's brightness is ever revisited, verify with
real screenshots (not a single frame) at both desktop and mobile, on
both pages that use `.av-video-frame`.

## `.av-sketch-bg`'s `::before` collides with `.ep-section`/`.ep-section-dark`'s own `::before` — never combine on one element

`.ep-section::before` (the 60%-width top accent line) and
`.ep-section-dark::before` both already claim the element's one
`::before` pseudo-element. Adding `.av-sketch-bg` (which also sets
`content`/`position`/`background` on `::before`) to the same element
does not layer the two backgrounds — CSS resolves `::before` as a
single box, cascading property-by-property, so the sketch pattern's
`inset:0` wins over the accent line's explicit `width:60%;height:1px`
in ways that make the result invisible or wrong. Villa.html's dark
hero panel (`#villa-page-hero`) needed the sketch texture *and* kept
its accent line by giving the sketch pattern its own real DOM node
(`.villa-hero-sketch`, absolute/inset:0/z-index:0, first child of the
section) instead of a shared `::before`; the section's flex-item
children (`.ep-hero-split-text`, `.ep-hero-stack`) got explicit
`position:relative;z-index:1` to guarantee they paint above it. Reuse
this "dedicated layer div" pattern for any future background texture
on an element that's also `.ep-section`/`.ep-section-dark` — never
add `.av-sketch-bg` directly to one.

## Google Ads conversion tracking — WhatsApp click + form submit (2026-08)

`index.html`'s `Content-Security-Policy` meta tag has no `'unsafe-inline'`
for `script-src` — every inline `<script>` block and every inline
`onclick="..."` handler must be allow-listed individually by exact
sha256 hash (`'sha256-...'` for `<script>` bodies, plus `'unsafe-hashes'`
+ a hash per distinct `onclick` attribute *value* — one hash per unique
string, so 3 different `wa.me` hrefs sharing the same onclick template
text collapse to one hash, but a differently-worded onclick needs its
own). The other 4 pages carry no CSP meta tag and are unaffected. If you
add/edit an inline script or onclick handler on `index.html`, recompute
its hash (`hashlib.sha256(exact_content.encode()).digest()` → base64,
where `exact_content` for an attribute is the HTML-entity-decoded value,
e.g. `&#39;` → `'`) and update the CSP meta tag's `script-src`, or the
browser silently drops the handler with a CSP console error that no
static grep will surface.

**Trap (2026-08, found+fixed):** every `wa.me` link/button site-wide
(index/villa/contact/gallery/plan-a-stay/legal x3/arrive/reviews-submit
— 10 pages) carries `onclick="return gtag_report_conversion_whatsapp(&#39;<href>&#39;);"`,
delimited with the HTML entity `&#39;` rather than a literal quote so it
can nest inside the double-quoted `onclick="..."` attribute. If the
`href` text itself contains a literal apostrophe (e.g. the "I'd like to
enquire..." WhatsApp message text), that apostrophe closes the JS string
early — since HTML-entity decoding happens once, before the JS parses —
producing a syntax error that silently no-ops the handler (link still
navigates via its real `href`, but no conversion fires and no console
warning is visible without an active JS debugger). The fix is a literal
backslash in the HTML source before the apostrophe (`I\'d`, NOT an HTML
entity) — decoding leaves a real `\'` for the JS parser to treat as an
escaped quote. Grep any onclick value containing a raw `'` before
trusting it fires, and re-verify with the live network-request check
below rather than only reading the source.

`gtag_report_conversion_whatsapp(url)` (fires on every `wa.me` link
click) and `gtag_report_conversion_form(url)` (fires on confirmed
enquiry/lead submission) are separate functions defined once per page,
right after the base gtag.js snippet in `<head>` — deliberately not
merged into one shared function, since Google Ads' account-UI snippet
generator would give both the same name and the second definition would
silently clobber the first. `gtag_report_conversion_form()` is called
from `assets/js/core.js` (lead popup), `assets/js/booking.js`
(`#mpc-send`, `#home-bw`), and `assets/js/review.js` (`#rv-form`) only
after a genuine success signal (`logToSheet()`'s resolved promise, or —
for `#rv-form`'s no-`API_ENDPOINT` branch — the WhatsApp handoff itself)
— i.e. on confirmed submission, not on click — except `#home-bw`, which
has no real confirmation signal (it just redirects to
`plan-a-stay.html` with query params) and fires on click as a
documented fallback. `logToSheet()` in `assets/js/data.js` returns that
promise (resolves `true`/`false`, never rejects) specifically so callers
needing a genuine success signal can opt in; don't revert it to
fire-and-forget without checking all call sites above.

## `.av-video-card-native` — opting a video slot out of the shared crossfade playlist (2026-08)

`initVideoPlaylists()` in `core.js` grabs every `.av-video-frame, .av-video-card`
element and rewires its `<video>` to cycle through the site-wide shared
`FULL_PLAYLIST`/`CARD_PLAYLIST` regardless of what `<source>` was authored in
the HTML — see the existing note above this one. The homepage's
`#gallery-highlight` "story sequence" (`.home-gal-story` — 4 grid cells, each
wrapped in `.home-gal-step`, captioned "01 · Arrive" through "04 · Rest")
needed each tile pinned to *one specific* clip instead of the shared rotation,
so those 4 cards carry an additional `av-video-card-native` class and
`initVideoPlaylists()`'s selector explicitly excludes
`.av-video-card:not(.av-video-card-native)`. Reuse this opt-out pattern for
any future slot that needs a fixed, non-cycling clip — don't hand-roll a
separate wiring path. `.av-video-card-native` also carries its own
`object-fit:cover` override (no letterbox) and, if you want the frame sized
to the source's native 9:16 aspect instead of the shared 3:4 grid crop, add
`aspect-ratio:9/16` scoped to `.home-gal-step > .av-video-card.av-video-card-native`
— **not** a bare `.av-video-card` override, or every other video tile on the
site inherits the same tall ratio.

**Known trap:** giving `.fi` (the scroll-reveal fade class) to *both* a tall
media element and a short caption sitting directly below it in the same flex
column will visually overlap them before either has settled — `.fi`'s
pre-reveal `translateY(24px)` is a real paint-time offset (`getBoundingClientRect`
sees it), and 24px against a short gap is enough to paint over the sibling
below. Symptom: an automated layout auditor (or a screenshot mid-scroll)
reports "overlapping text" on the caption, and it gets worse (not better) the
taller the media element is. Fix used here: drop `.fi` from the caption
entirely (it's short-lived on screen anyway) rather than fighting the
transform, and if the media element itself is unusually tall, add
`.foo.fi { transform: none; }` to keep the opacity fade but drop the vertical
travel.

## `sw.js`'s `VERSION` — bump it whenever iterating live in a browser session (2026-08)

The service worker's css/js strategy is stale-while-revalidate (see the
earlier chrome-devtools-axi section above): a browser tab that registered the
SW before your edit will keep running the OLD `main.css`/`core.js`/`sw.js`
for at least one more load no matter how many times you save, because the
cache is served instantly and only revalidated in the background. If you're
iterating against a live browser session (Lavish, chrome-devtools-axi, a
captain reviewing in real time) and change anything under `PRECACHE` (css,
js, or a video/image referenced by cached pages), bump `VERSION` in `sw.js`
in the same pass — otherwise "I fixed it" and "it still looks broken" can
both be true at once, one request apart, and it reads exactly like a
CSS-specificity bug instead of a caching one.

## villa.html — no longer carries its own `.ep-aside` tariff box (2026-08)

The "Your Stay" tariff/included-items aside (`ep-price`/`ep-incl` markup,
same component `plan-a-stay.html` and `contact.html` use) was removed from
`villa.html` per captain feedback — that content now lives only on
`plan-a-stay.html`, the page every Book/Plan-a-Stay CTA site-wide already
points to. `villa.html`'s `.ep-main` grid (`#story`'s sibling
`#amenities`/`#local-guide` block) now carries an extra `ep-main-full` class
forcing `grid-template-columns: minmax(0,1fr)` instead of the two-column
`minmax(0,1fr) 360px` default, so `<article>` fills the row without an empty
360px gap where the aside used to sit. If a future page drops its aside for
the same reason, reuse `.ep-main-full` rather than re-deriving the
single-column override.

*AnVira Private Estates — Internal Development Document*
*Based on ideasV2.md — Version 2.0, June 2026*

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
