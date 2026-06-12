# AnVira — Scale Path (Phase 6, trigger-based per claude.md §5)

## Already live (static-compatible Phase 6 items)
- **PWA / offline**: `manifest.webmanifest` + `sw.js` — estate pages are
  precached; a guest who opened one can reread it without signal (relevant
  on the Chail road). Bump `VERSION` in `sw.js` when deploying breaking changes.
- **QR codes**: `brand/qr/<slug>.png` (600px, brand colours) — print for
  in-estate stands, welcome folders, business cards. Each opens the estate page.
- **Return-guest CRM**: sheet columns, see tools/APPS_SCRIPT_SETUP.md.
- **Instagram/OG pipeline**: every page already emits 1200-wide OG images +
  twitter:card — paste any URL into a story/bio link and it previews correctly.

## Deferred: Next.js + Sanity migration
**Trigger (do not migrate before one of these):**
1. A 4th estate signs, or
2. A non-technical person needs to edit content without Git.

**When triggered:** `serverless_api_spec.md` is the ready-made backend spec
(the 3 API routes replace tools/apps-script.gs 1:1). The `AnViraEstate` data
in `assets/js/data.js` is already schema-shaped for a Sanity import; the SSG
templates in `tools/build-estates.mjs` map directly to React components.

## Owner inputs that improve Phase 6
- A square 512×512 app icon (current manifest uses the 850×640 logo).
