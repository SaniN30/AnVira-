# AnVira — Launch QA Checklist (claude.md §8)

Code-controlled items are built; device items need a human pass before launch.
Mark each cell when verified.

## Device matrix

Test on: **iPhone Safari · Android Chrome · iPad Safari · Desktop Chrome · Desktop Safari**

Per device:
- [ ] Homepage (`/`) loads < 2s on 4G, no horizontal scroll 320–1920px
- [ ] Intro reveal plays once and is skippable
- [ ] Villa AnVira page: hero, gallery, lightbox (swipe + arrows + Esc)
- [ ] Booking widget → Message Preview Card → WhatsApp opens with the exact message
- [ ] "Call instead" tel: link rings the right number
- [ ] Floating WhatsApp appears after the hero, pre-filled with property name
- [ ] /reviews/submit: star rating, word counter, success state
- [ ] Sticky bottom booking bar on mobile

## Backend (after owner deploys Apps Script — tools/APPS_SCRIPT_SETUP.md)

- [ ] Enquiry row lands in **Enquiries** tab with Status `New`
- [ ] Waitlist row lands in **Waitlist** tab with `+91` number
- [ ] Review row lands in **Reviews** tab with Status `Pending`
- [ ] Sheets API failure does not block WhatsApp opening (test with a broken URL)

## SEO / sharing

- [ ] Share the site URL in WhatsApp → image + title + description preview renders
- [ ] `https://anvira.co/sitemap.xml` and `/robots.txt` reachable in production
- [ ] /arrive/ pages return noindex (view-source: `robots` meta) and are absent from sitemap
- [ ] Rich Results test passes for `LodgingBusiness` JSON-LD on `/`

### Google Search Console (owner, one time)
1. Add property `anvira.co` (domain verification via DNS TXT).
2. Submit `https://anvira.co/sitemap.xml`.
3. Request indexing for `/`.
4. After 1 week: check Coverage for errors, confirm /arrive/* not indexed.

## Accessibility (re-verify after any UI change)

- [ ] Keyboard-only walkthrough: menu (trap + Esc), gallery images (Enter opens lightbox),
      lightbox (trap, arrows, Esc, focus returns to image), booking card + waitlist modals (trap + Esc)
- [ ] prefers-reduced-motion: site fully usable, no movement
- [ ] Zoom 200%: no clipped or overlapping text
- [ ] Lighthouse accessibility ≥ 90 on /, /estates/, one estate page, /reviews/submit

## Performance targets

- [ ] Lighthouse ≥ 90 all categories (mobile) on /
- [ ] LCP < 2.5s · CLS < 0.1 (gallery images carry explicit width/height)
- [ ] Images: remaining JPGs are the ones smaller than their WebP equivalent (verified at build)

## Owner inputs still pending (placeholders live)

| Input | Where it lands |
|---|---|
| "From ₹/night" anchor prices | `data.js → pricing.from` |
| Caretaker names/photos/bios | `data.js → staff[]` (index + arrive pages auto-show) |
| GSTIN | footer (hand-edit `index.html`) |
| Legal text sign-off | hand-edit `legal/*.html` |
| Apps Script deployment | `data.js → API_ENDPOINT` |
