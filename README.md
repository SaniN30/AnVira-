# AnVira — Villa AnVira, Chail

A direct-booking website for Villa AnVira, a private luxury villa estate in Chail, Himachal Pradesh. Built as a zero-framework static site — no build pipeline, no dependencies, sub-2s loads on 4G.

**Live:** [anvira.co](https://anvira.co)

---

## About

AnVira is a single-property direct-booking site for Villa AnVira. Guests book directly — no OTA middlemen, no hidden fees, direct line to the estate. The platform competes on digital experience with the standard set by Aman, Oberoi, and Six Senses.

---

## Property

| Estate | Location | Rooms | Capacity |
|--------|----------|-------|----------|
| Villa AnVira | Chail, Himachal Pradesh | 7 bedrooms | Up to 20 guests |

---

## Site Architecture

Static, hand-authored HTML/CSS/JS. No framework, no build step, deployable anywhere. See [AGENTS.md](AGENTS.md) for how the pages relate to `assets/js/data.js` and why there's no generator step.

```
/                             Home — hero, story teaser, gallery highlight, Guest Voices, WhatsApp CTA
/villa.html                   Villa — full story, stats, amenities, local guide, FAQ, Guest Voices
/gallery.html                 Gallery — full filterable photo grid + lightbox (37 photos)
/plan-a-stay.html             Plan a Stay — booking widget, Message Preview Card
/contact.html                 Contact — map, contact methods, Guest Voices reviews
/estates/villa-anvira.html    Redirect stub → / (kept for old bookmarks/QR codes)
/arrive/villa-anvira.html     Private pre-arrival page (noindex) — directions, check-in notes
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
  js/data.js                Single source of truth: property data + API config
  js/core.js                Nav, cursor, scroll, section animations
  js/intro.js                Page-load intro animation
  js/booking.js             Booking widget + WhatsApp Message Preview Card
  js/estate.js              Property page runtime — gallery, lightbox, booking panel slide-in
  js/gallery.js             Shared lightbox
  js/review.js              Review form → Google Apps Script → Google Sheet

tools/
  apps-script.gs            Google Apps Script backend — enquiry / waitlist / review logging
  APPS_SCRIPT_SETUP.md      Step-by-step Apps Script deployment guide
  build-images.mjs          Image optimisation helper

brand/
  logo.png
  logo-transparent.png

legal/                      Hand-authored HTML
chail/                      Villa AnVira image assets
```

---

## Guest Journey

Every design and content decision maps to one of six stages:

| Stage | Platform mechanism |
|-------|--------------------|
| Discovery | OG image, sub-2s load, WhatsApp-share-ready links |
| Consideration | 30+ gallery photos, local guide, anchor pricing, verified reviews |
| Decision | Sticky booking panel, Message Preview Card |
| Pre-Arrival | Private `/arrive/villa-anvira.html` — directions, caretaker contact, house notes |
| Stay | Local staff-curated recommendations |
| Post-Stay | `/reviews/submit` → Google Sheet approval queue |

---

## Booking & Enquiry Flow

1. Guest fills the booking widget (dates, guests, name)
2. Clicks **Send on WhatsApp** — a pre-filled message preview opens
3. One tap sends the enquiry to the owner's WhatsApp
4. Simultaneously, the enquiry is logged to a private Google Sheet (Timestamp | Property | Check-in | Check-out | Guests | Name | Status)
5. Owner replies within 2 hours (9am–9pm IST), confirms dates, sends payment link

Pricing is shared over WhatsApp at enquiry stage.

---

## Review Flow

1. Guest visits `/reviews/submit.html` (linked from the property page and footer)
2. Fills name, phone (kept private), occasion, star rating, and review text (5–200 words)
3. Submits → logged to **Reviews** tab of Google Sheet with Status `Pending`
4. Owner reads and approves; approved reviews are added to `assets/js/data.js`

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
| Cormorant Garamond | Estate name, hero headings, micro/attribution (italic) |
| Manrope | Body copy, UI labels |
| DM Mono | Stats strip, prices, tags |

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

- **Content Security Policy** meta tag on the homepage (`index.html`) — restricts scripts to same-origin, fonts to Google Fonts, API calls to Google Apps Script only
- **robots.txt** blocks `/arrive/`, `/reviews/submit.html`, `/presentation/` from crawlers
- `/arrive/` and `/reviews/submit.html` are `noindex, nofollow`
- All external links use `rel="noopener noreferrer"`
- Form inputs validated client-side before submission (phone regex, word count, required fields)
- No credentials in source — the Apps Script URL is a public, parameterless endpoint

---

## SEO

- `sitemap.xml` lists every indexable page (home, villa, gallery, plan-a-stay, reviews/submit, and the three legal pages); `robots.txt` blocks the private/internal ones (see Security above).
- `index.html`'s `<head>` carries a `LodgingBusiness` JSON-LD block (name, address, geo, telephone, amenities, aggregate rating) — keep it in sync with on-page content, since it must only describe facts the page itself shows.
- Every page sets a unique `<title>`, meta description, canonical URL, and Open Graph / Twitter Card tags.

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

Full terms: [anvira.co/legal/terms.html](https://anvira.co/legal/terms.html)

---

## Development

No build step. Serve locally:

```bash
npx serve .
# or
python3 -m http.server 8080
```

There is no generator step — edit the shipped HTML directly. `assets/js/data.js` remains the source of truth for property data read at runtime by `booking.js`, `gallery.js`, and `estate.js`. See [AGENTS.md](AGENTS.md) for details.

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

*AnVira — Est. 2018 — Villa AnVira, Chail*
