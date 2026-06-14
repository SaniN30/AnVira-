# AnVira — Private Estates

A direct-booking website for a curated collection of private luxury villa estates across India. Built as a zero-framework static site — no build pipeline, no dependencies, sub-2s loads on 4G.

**Live:** [anvira.in](https://anvira.in)

---

## About

AnVira curates hand-selected private estates across India's most coveted landscapes. Guests book directly — no OTA middlemen, no hidden fees, direct line to the estate. The platform competes on digital experience with the standard set by Aman, Oberoi, and Six Senses.

---

## Properties

| Estate | Location | Rooms | Capacity |
|--------|----------|-------|----------|
| Villa AnVira | Chail, Himachal Pradesh | 7 bedrooms | Up to 20 guests |
| Estate 10 | New Delhi | Private urban estate | — |
| Tarika's Seascapes | Mormugao, Goa | Sea-view villa | — |
| Mukteshwar Orchard House | Mukteshwar, Uttarakhand | Under curation | — |

---

## Site Architecture

Static multi-page HTML/CSS/JS. No framework, no build step for content changes, deployable anywhere.

```
/                             Homepage — hero, estates accordion, testimonials, booking widget
/estates/                     Listing — all active estates + under-curation coming-soon cards
/estates/villa-anvira.html    Estate page — gallery, booking panel, local guide, reviews
/estates/estate-10.html
/estates/tarikas-seascapes.html
/arrive/villa-anvira.html     Private pre-arrival page (noindex) — directions, check-in notes
/arrive/estate-10.html
/arrive/tarikas-seascapes.html
/reviews/submit.html          Post-stay review form (noindex)
/legal/privacy.html           Privacy Policy
/legal/terms.html             Terms of Stay
/legal/cancellation.html      Cancellation Policy
/presentation/                Investor / partner deck (robots blocked)
```

---

## File Structure

```
assets/
  css/main.css              Complete design system — tokens, layout, all components
  js/data.js                Single source of truth: all property data + API config
  js/core.js                Nav, cursor, scroll, section animations
  js/booking.js             Booking widget + WhatsApp Message Preview Card
  js/estate.js              Estate page runtime — gallery, lightbox, booking panel slide-in
  js/home.js                Homepage accordion, hero stagger, testimonial cycling
  js/listing.js             Estate listing page — cards, under-curation waitlist form
  js/gallery.js             Shared lightbox
  js/review.js              Review form → Google Apps Script → Google Sheet

tools/
  build-estates.mjs         Generates all HTML pages from data.js (single source of truth)
  apps-script.gs            Google Apps Script backend — enquiry / waitlist / review logging
  APPS_SCRIPT_SETUP.md      Step-by-step Apps Script deployment guide
  build-images.mjs          Image optimisation helper

brand/
  logo.png
  logo-transparent.png
  mukteshwar-placeholder.svg  Blurred SVG placeholder for under-curation estate

legal/                      Generated HTML — edit source in tools/build-estates.mjs LEGAL_PAGES
chail/                      Villa AnVira image assets
Delhi/                      Estate 10 image assets
Goa/                        Tarika's Seascapes image assets
```

---

## Guest Journey

Every design and content decision maps to one of six stages:

| Stage | Platform mechanism |
|-------|--------------------|
| Discovery | OG image per property, sub-2s load, WhatsApp-share-ready links |
| Consideration | 30+ gallery photos, local guide, anchor pricing, verified reviews |
| Decision | Sticky booking panel, availability calendar, Message Preview Card |
| Pre-Arrival | Private `/arrive/[slug]` — directions, caretaker contact, house notes |
| Stay | Local staff-curated recommendations |
| Post-Stay | `/reviews/submit` → Google Sheet approval queue |

---

## Booking & Enquiry Flow

1. Guest fills the booking widget (property, dates, guests, name)
2. Clicks **Send on WhatsApp** — a pre-filled message preview opens
3. One tap sends the enquiry to the owner's WhatsApp
4. Simultaneously, the enquiry is logged to a private Google Sheet (Timestamp | Property | Check-in | Check-out | Guests | Name | Status)
5. Owner replies within 2 hours (9am–9pm IST), confirms dates, sends payment link

Pricing is shared over WhatsApp at enquiry stage.

---

## Review Flow

1. Guest visits `/reviews/submit.html` (linked from estate pages and footer)
2. Fills name, phone (kept private), estate, occasion, star rating, and review text (5–200 words)
3. Submits → logged to **Reviews** tab of Google Sheet with Status `Pending`
4. Owner reads and approves; approved reviews are added to `data.js` and the site is rebuilt

---

## Waitlist (Under-Curation Estates)

Coming-soon estate cards on `/estates/` have a **Notify me** form. Name + WhatsApp number → logged to **Waitlist** tab. When the estate launches, owner filters by estate name and sends a WhatsApp Business broadcast.

---

## Backend (Google Apps Script)

A single Apps Script web app handles three POST types:

| `type` field | Sheet tab | Purpose |
|-------------|-----------|---------|
| `enquiry` | Enquiries | Booking widget submissions |
| `waitlist` | Waitlist | Coming-soon notification signups |
| `review` | Reviews | Post-stay review submissions |

Setup guide: `tools/APPS_SCRIPT_SETUP.md`

---

## Design System

### Colour Palette

| Role | Name | Hex |
|------|------|-----|
| Background | Lime Wash | `#F5F1E8` |
| Surface / Cards | Bone | `#FAF8F3` |
| Primary Text | Ink | `#18181A` |
| Secondary Text | Dust | `#7A7670` |
| Accent | Patina Brass | `#A87C45` |
| Accent Wash | Turmeric Mist | `#EFE0C0` |
| Rule / Border | Linen Rule | `#D6CEBF` |
| WhatsApp | Monsoon Green | `#1F9E5F` |
| Error | Fired Clay | `#B5513A` |

### Typography

| Font | Use |
|------|-----|
| Cormorant Garamond | Estate names, hero headings (italic) |
| DM Sans | Body copy, UI labels |
| DM Mono | Stats strip, prices, tags |
| Spectral | Pull-quotes, eyebrow labels |

### Motion Principles

Unhurried but precise — every animation has a purpose and an end.

- Hero: Ken Burns (100→103% over 8s)
- Hero text: 40ms word stagger
- Sections: fade-up at 20% viewport entry
- Booking panel: slide-in on first scroll past hero
- Card hover: brass underline grow, image scale 1.0→1.04
- `prefers-reduced-motion` respected throughout
- Nav links, body text, and buttons: colour / underline only — never animated

---

## Security

- **Content Security Policy** meta tag on every page — restricts scripts to same-origin, fonts to Google Fonts, API calls to Google Apps Script only
- **robots.txt** blocks `/arrive/`, `/reviews/submit.html`, `/presentation/` from crawlers
- `/arrive/` and `/reviews/submit.html` are `noindex, nofollow`
- All external links use `rel="noopener noreferrer"`
- Form inputs validated client-side before submission (phone regex, word count, required fields)
- No credentials in source — the Apps Script URL is a public, parameterless endpoint

---

## Terms of Stay (Summary)

| Term | Detail |
|------|--------|
| Advance | 60% to confirm; balance on check-in |
| Cancellation | Non-refundable, non-cancellable |
| Check-in / out | 2:00 PM / 11:00 AM |
| Add-ons | Bonfire, BBQ, movie screening, extra bed — chargeable |
| Pets | Allowed |
| Smoking | Indoors prohibited |
| Quiet hours | After 10:00 PM |

Full terms: [anvira.in/legal/terms.html](https://anvira.in/legal/terms.html)

---

## Development

No build step needed for most edits. Serve locally:

```bash
npx serve .
# or
python3 -m http.server 8080
```

After editing `data.js` (property data, legal copy, API endpoint), regenerate all pages:

```bash
node tools/build-estates.mjs
```

This rebuilds estate pages, arrive pages, legal pages, sitemap, robots.txt, and stamps the service worker cache version.

---

## Deployment

Static files — push to GitHub, deploy via GitHub Pages, Netlify, Cloudflare Pages, or any static host. The repository is the deployment source.

```bash
git add -A
git commit -m "your message"
git push origin main
```

---

## Pending Before Full Launch

- [ ] Authorize Google Apps Script deployment and confirm rows land in the sheet (guide: `tools/APPS_SCRIPT_SETUP.md`)
- [ ] Approve legal text: Privacy Policy, Cancellation Policy
- [ ] Device QA — iPhone Safari + Android Chrome end-to-end booking flow

---

*AnVira — Est. 2018 — Private Estates*
