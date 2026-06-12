/* ── AnVira — responsive image variants ──────────────────────────
   Generates 640w / 1280w .webp variants next to each original so
   build-estates.mjs can emit srcset and phones stop downloading
   1920px desktop images. Idempotent: skips variants that already
   exist and are newer than the source. Never upscales.
   Run:  node tools/build-images.mjs   (needs tools/node_modules/sharp) */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const WIDTHS = [640, 1280];

/* variant path: chail/foo.jpg → chail/foo-640w.webp */
export const variantPath = (src, w) => src.replace(/\.(jpe?g|png|webp)$/i, `-${w}w.webp`);

function collectImages() {
  const ctx = vm.createContext({});
  vm.runInContext(readFileSync(join(ROOT, 'assets/js/data.js'), 'utf8'), ctx);
  const { PROPERTIES, COMING_SOON } = vm.runInContext('({ PROPERTIES, COMING_SOON })', ctx);
  const set = new Set();
  for (const p of PROPERTIES) { p.images.forEach(u => set.add(u)); if (p.card) set.add(p.card); }
  for (const o of COMING_SOON || []) if (o.card) set.add(o.card);
  return [...set];
}

async function run() {
  let made = 0, skipped = 0;
  for (const rel of collectImages()) {
    const src = join(ROOT, rel);
    if (!existsSync(src)) { console.warn(`missing source: ${rel}`); continue; }
    const meta = await sharp(src).metadata();
    for (const w of WIDTHS) {
      if (meta.width <= w) continue; // never upscale
      const out = join(ROOT, variantPath(rel, w));
      if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) { skipped++; continue; }
      await sharp(src).resize({ width: w }).webp({ quality: 78 }).toFile(out);
      made++;
    }
  }
  console.log(`variants: ${made} generated, ${skipped} up to date`);
}

/* allow import { variantPath, WIDTHS } without side effects */
if (process.argv[1] === fileURLToPath(import.meta.url)) await run();
