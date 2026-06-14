# AnVira — Private Estates

A direct-booking website for a curated collection of private luxury villa estates across India. Built as a static multi-page site — zero framework, zero build step, sub-2s loads.

**Live site:** [anvira.in](https://anvira.in)

---

## Properties

| Estate | Location | Capacity |
|--------|----------|----------|
| Villa AnVira | Chail, Himachal Pradesh | 7 bedrooms · up to 20 guests |
| Estate 10 | New Delhi | Private urban estate |
| Tarika's Seascapes | Mormugao, Goa | Sea-view villa |
| Mukteshwar Orchard House | Mukteshwar, Uttarakhand | Under curation |

---

## Architecture

Static HTML/CSS/JS — no build pipeline, no framework dependency.

```
/                       — Homepage
/estates/               — Estate listing with under-curation cards
/estates/[slug].html    — Individual estate pages (gallery, booking, reviews)
/arrive/[slug].html     — Private pre-arrival guest info (noindex)
/reviews/submit.html    — Post-stay review form (noindex)
/legal/                 — Privacy, Terms, Cancellation
/presentation/          — Investor / partner deck (robots blocked)
```

**Key files:**

| File | Purpose |
|------|---------|
| `assets/js/data.js` | Single source of truth for all property data + API config |
| `assets/js/core.js` | Nav, cursor, scroll, animations |
| `assets/js/booking.js` | Booking widget + WhatsApp Message Preview Card |
| `assets/js/estate.js` | Estate page runtime (gallery, lightbox, booking panel) |
| `assets/js/review.js` | Review form submit → Google Apps Script → Google Sheet |
| `assets/css/main.css` | Complete design system (tokens, layout, components) |
| `tools/build-estates.mjs` | Generates estate HTML pages from `data.js` |
| `tools/apps-script.gs` | Google Apps Script for enquiry + review sheet logging |

---

## Enquiry & Review Flow

Booking enquiries and guest reviews are captured via a Google Apps Script web app endpoint and written to a private Google Sheet for owner review.

- Enquiries: `Timestamp | Property | Check-in | Check-out | Guests | Name | Status`
- Reviews: go into an approval queue before publication

Setup guide: `tools/APPS_SCRIPT_SETUP.md`

---

## Security

- Content Security Policy (`<meta http-equiv="Content-Security-Policy">`) on all pages
- Private pages (`/arrive/`, `/reviews/submit.html`, `/presentation/`) blocked in `robots.txt` and `noindex`
- All external links use `rel="noopener noreferrer"`
- Form inputs validated client-side before submission (phone format, word count, required fields)
- No credentials in source — Google Apps Script URL is a public endpoint

---

## Design System

| Token | Value |
|-------|-------|
| Background | Lime Wash `#F5F1E8` |
| Surface | Bone `#FAF8F3` |
| Text | Ink `#18181A` |
| Secondary | Dust `#7A7670` |
| Accent | Patina Brass `#A87C45` |

Fonts: Cormorant Garamond (headings), DM Sans (body), DM Mono (stats), Spectral (pullquotes)

Motion: unhurried but precise — Ken Burns on heroes, 40ms word stagger, fade-up at 20% viewport. `prefers-reduced-motion` respected throughout.

---

## Pending Owner Inputs

These are required before full launch — placeholders are in place in the code:

- [ ] Google Sheet URL + Apps Script authorization (`tools/APPS_SCRIPT_SETUP.md`)
- [ ] Cancellation / privacy / terms text approval

---

## Development

No build step needed. Open any `.html` file directly in a browser or serve locally:

```bash
npx serve .
# or
python3 -m http.server 8080
```

To regenerate estate pages after editing `data.js`:

```bash
node tools/build-estates.mjs
```

---

## Deployment

Static files — deploy to any host (GitHub Pages, Netlify, Cloudflare Pages, or traditional shared hosting). The site is already live at `anvira.in`.

---

*Est. 2018 — Private Estates*
