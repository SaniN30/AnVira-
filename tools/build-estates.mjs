#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════
   AnVira — estate page generator
   Bakes /estates/[slug].html + /estates/index.html from
   assets/js/data.js (single source of truth, claude.md §5 schema).
   Run after any data change:  node tools/build-estates.mjs
   ════════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
/* Set the production origin before launch so OG/canonical URLs are absolute. */
const SITE_URL = 'https://anvira.in';

const ctx = {};
vm.createContext(ctx);
vm.runInContext(readFileSync(join(ROOT, 'assets/js/data.js'), 'utf8'), ctx);
/* top-level consts live in the context's lexical scope, not on the object */
const { PROPERTIES, COMING_SOON, WA_NUMBER } = vm.runInContext('({ PROPERTIES, COMING_SOON, WA_NUMBER })', ctx);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ── Image dimensions (JPEG SOF / WebP VP8|VP8L|VP8X headers) —
   baked into width/height attributes so the gallery never shifts layout. */
function imageSize(path) {
  const b = readFileSync(path);
  if (b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const tag = b.toString('ascii', 12, 16);
    if (tag === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (tag === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (tag === 'VP8L') {
      const w = 1 + (((b[22] & 0x3f) << 8) | b[21]);
      const h = 1 + (((b[24] & 0x0f) << 10) | (b[23] << 2) | ((b[22] & 0xc0) >> 6));
      return { w, h };
    }
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if ((m >= 0xc0 && m <= 0xcf) && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

const WA_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';

const PIN_SVG = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>';

const fonts = `
  <link rel="manifest" href="../manifest.webmanifest" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&family=Spectral:ital,wght@1,300&display=swap" rel="stylesheet" />`;

const chrome = {
  nav: `
  <div id="cursor-ring"><span id="cursor-label">View</span></div>
  <div id="cursor-dot"></div>

  <header id="nav">
    <a id="nav-logo" class="av" href="../index.html" aria-label="AnVira — home" style="text-decoration:none" data-cursor>
      <span class="av-an">An</span><span class="av-vira">Vira<span class="av-line"></span></span>
    </a>
    <button id="burger" aria-label="Menu" data-cursor>
      <span class="bl"></span>
      <span class="bl"></span>
    </button>
  </header>

  <div id="menu" role="dialog" aria-label="Navigation">
    <nav>
      <div class="mwrap"><a href="../index.html" class="mlink" data-cursor>Home</a></div>
      <div class="mwrap"><a href="./index.html" class="mlink" data-cursor>All Estates</a></div>
      <div class="mwrap"><a href="#bw" class="mlink" data-cursor>Plan a Stay</a></div>
      <div class="mwrap"><a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener noreferrer" class="mlink" data-cursor>Private Inquiry</a></div>
    </nav>
    <div id="menu-foot">Est. 2018 &mdash; Private Estates</div>
  </div>`,
  trust: `
    <div class="trust-strip fi" aria-label="Why book directly">
      <div class="trust-item"><span class="trust-n">2&nbsp;hrs</span><span class="trust-l">Reply time on WhatsApp, 9am&ndash;9pm IST</span></div>
      <div class="trust-item"><span class="trust-n">0%</span><span class="trust-l">Platform fees &mdash; you book directly with us</span></div>
      <div class="trust-item"><span class="trust-n">Direct</span><span class="trust-l">Line to the caretaker from day one</span></div>
    </div>`,
  footer: `
    <footer>
      <div class="av" style="font-size:1.1rem">
        <span class="av-an">An</span><span class="av-vira" style="font-style:italic">Vira</span>
      </div>
      <div class="fl">
        <a href="../index.html#gal-sec" class="fa" data-cursor>Portfolio</a>
        <a href="./index.html" class="fa" data-cursor>Estates</a>
        <a href="../legal/privacy.html" class="fa" data-cursor>Privacy Policy</a>
        <a href="../legal/terms.html" class="fa" data-cursor>Terms</a>
        <a href="../legal/cancellation.html" class="fa" data-cursor>Cancellation Policy</a>
        <a href="../reviews/submit.html" class="fa" data-cursor>Share a Review</a>
      </div>
      <div>
        <div class="fc">&copy; 2026 AnVira. All rights reserved.</div>
        <div class="fc-gst">GSTIN: To be updated before launch</div>
      </div>
    </footer>

  <div id="scroll-progress" aria-hidden="true"></div>`,
};

function bookingAside(p) {
  const inc = p.pricing.included.map(i => `<li>${esc(i)}</li>`).join('');
  const ext = p.pricing.extra.map(i => `<li class="x">${esc(i)}</li>`).join('');
  const amount = p.pricing.from
    ? `From &#8377;${Number(p.pricing.from).toLocaleString('en-IN')} / night`
    : 'Tariff on request';
  return `
        <aside class="ep-aside">
          <div class="ep-price">
            <p class="ep-price-from">Your stay</p>
            <p class="ep-price-amt">${amount}</p>
            <p class="ep-price-note">${esc(p.pricing.note)}</p>
            <p class="ep-price-min">Minimum ${p.pricing.minNights} night${p.pricing.minNights > 1 ? 's' : ''}</p>
            <div class="ep-incl">
              <p class="ep-incl-title">Included</p>
              <ul>${inc}</ul>
            </div>
            <div class="ep-incl">
              <p class="ep-incl-title">On request</p>
              <ul>${ext}</ul>
            </div>
          </div>
          <form id="bw" novalidate>
            <div class="bw-title">Plan your stay</div>
            <div class="bw-row">
              <div class="bw-field">
                <label class="bw-label" for="bw-in">Check-in</label>
                <input class="bw-input" type="date" id="bw-in" name="checkin" required />
              </div>
              <div class="bw-field">
                <label class="bw-label" for="bw-out">Check-out</label>
                <input class="bw-input" type="date" id="bw-out" name="checkout" required />
              </div>
            </div>
            <div class="bw-row">
              <div class="bw-field">
                <label class="bw-label" for="bw-guests">Guests</label>
                <input class="bw-input" type="number" id="bw-guests" name="guests" min="1" value="2" required />
              </div>
              <div class="bw-field">
                <label class="bw-label" for="bw-name">Your name</label>
                <input class="bw-input" type="text" id="bw-name" name="name" autocomplete="name" required />
              </div>
            </div>
            <p class="bw-err" id="bw-err" role="alert" aria-live="polite"></p>
            <button type="submit" class="cta" data-cursor>Preview Enquiry</button>
            <a class="bw-call" id="bw-call" href="tel:+${WA_NUMBER}" data-cursor>Call instead</a>
          </form>
          <p class="ep-trust">We reply on WhatsApp <b>within 2 hours</b>, 9am&ndash;9pm IST.<br>Direct booking &mdash; no platform fees, ever.</p>
        </aside>`;
}

function storyHTML(p) {
  return p.fullDesc.split('\n\n').map(para => {
    if (para.includes('\n')) {
      const lines = para.split('\n').filter(l => l.trim());
      return `<ul>${lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>`;
    }
    return `<p>${esc(para)}</p>`;
  }).join('\n            ');
}

function estatePage(p) {
  const others = PROPERTIES.filter(o => o.id !== p.id);
  const waText = encodeURIComponent(`Hello AnVira, I'd like to enquire about ${p.name}.`);
  const canonical = `${SITE_URL}/estates/${p.id}.html`;

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: `${p.name} — AnVira Private Estates`,
    description: p.seo.desc,
    image: `${SITE_URL}/${p.images[0]}`,
    priceRange: p.pricing.from ? `From ₹${p.pricing.from}/night` : 'On Request',
    address: { '@type': 'PostalAddress', streetAddress: p.address.replace('\n', ', '), addressCountry: 'IN' },
    url: canonical,
    telephone: `+${WA_NUMBER}`,
    amenityFeature: p.amenities.map(a => ({ '@type': 'LocationFeatureSpecification', name: a })),
  }, null, 2);

  const guide = p.localGuide.map(g => `
            <div class="lg-item">
              <div class="lg-name">${esc(g.name)}</div>
              <p class="lg-desc">${esc(g.desc)}</p>
              <p class="lg-meta">${g.mins} min &nbsp;&middot;&nbsp; <span>Best for:</span> ${esc(g.best)}</p>
            </div>`).join('');

  const reviews = p.reviews.map(r => `
            <div class="testi-card">
              <div class="testi-stars">${'<span class="testi-star">&#9733;</span>'.repeat(r.stars)}</div>
              <p class="testi-text">&ldquo;${esc(r.text)}&rdquo;</p>
              <div class="testi-name">${esc(r.name)}</div>
              <div class="testi-occ">${esc(r.occ)}</div>
            </div>`).join('');

  const similar = others.map(o => `
        <div class="prop-card" data-cursor onclick="location.href='./${o.id}.html'">
          <div class="ci-wrap"><img class="ci" src="../${o.card}" alt="${esc(o.name)}" loading="lazy" /></div>
          <div class="ctag">${esc(o.tag)}</div>
          <div class="crow">
            <div><div class="cname">${esc(o.name)}</div><div class="cloc">${esc(o.loc)}</div></div>
            <div class="cprice">${esc(o.price)}</div>
          </div>
          <div class="cdesc">${esc(o.desc)}</div>
          <div class="cfoot">
            <div class="cm"><div class="cm-n">${o.rooms}</div><div class="cm-l">Rooms</div></div>
            <div class="cm"><div class="cm-n">${o.maxGuests}</div><div class="cm-l">Guests</div></div>
            <div class="cm"><div class="cm-n">${o.baths}</div><div class="cm-l">Baths</div></div>
            <a class="enq" href="./${o.id}.html" data-cursor>View Details</a>
          </div>
        </div>`).join('');

  const gallery = p.images.map((u, i) => {
    const dim = imageSize(join(ROOT, u));
    const size = dim ? ` width="${dim.w}" height="${dim.h}"` : '';
    return `<img src="../${u}" alt="${esc(p.name)} — photograph ${i + 1}"${size} loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async" data-idx="${i}" data-cursor />`;
  }).join('\n            ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(p.seo.title)}</title>
  <meta name="description" content="${esc(p.seo.desc)}" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#F5F1E8" />
  <link rel="canonical" href="${canonical}" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(p.seo.title)}" />
  <meta property="og:description" content="${esc(p.seo.desc)}" />
  <meta property="og:image" content="${SITE_URL}/${p.images[0]}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="AnVira" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(p.seo.title)}" />
  <meta name="twitter:description" content="${esc(p.seo.desc)}" />
  <meta name="twitter:image" content="${SITE_URL}/${p.images[0]}" />

  <script type="application/ld+json">
${jsonld}
  </script>
${fonts}
  <link rel="preload" as="image" href="../${p.images[0]}" />
  <link rel="stylesheet" href="../assets/css/main.css" />
</head>
<body data-base="../" data-estate="${p.id}">
${chrome.nav}

  <main>
    <section class="ep-hero">
      <img src="../${p.images[0]}" alt="${esc(p.name)} — ${esc(p.loc)}" />
      <div class="ep-hero-overlay"></div>
      <div class="ep-hero-caption">
        <p class="ep-crumb"><a href="../index.html" data-cursor>AnVira</a> &nbsp;/&nbsp; <a href="./index.html" data-cursor>Estates</a> &nbsp;/&nbsp; ${esc(p.name)}</p>
        <div id="pd-hero-tag">${esc(p.tag)}</div>
        <h1 id="pd-hero-name">${esc(p.name)}</h1>
        <div id="pd-hero-loc"><a href="${p.mapUrl}" target="_blank" rel="noopener noreferrer" data-cursor>${PIN_SVG} ${esc(p.loc)}</a></div>
      </div>
    </section>

    <div class="ep-wrap">
      <div class="ep-main">
        <article>
          <section class="ep-section fi">
            <div class="jaali" aria-hidden="true"></div>
            <div class="ep-story-text">
            ${storyHTML(p)}
            </div>
            <div class="ep-stats">
              <div><div class="pd-spec-n">${p.rooms}</div><div class="pd-spec-l">Rooms</div></div>
              <div><div class="pd-spec-n">${p.maxGuests}</div><div class="pd-spec-l">Guests</div></div>
              <div><div class="pd-spec-n">${p.baths}</div><div class="pd-spec-l">Baths</div></div>
            </div>
          </section>

          <section class="ep-section fi">
            <p class="ep-sec-title">Amenities &amp; Features</p>
            <div class="pd-amen-grid">
              ${p.amenities.map(a => `<span class="pd-amen-tag">${esc(a)}</span>`).join('\n              ')}
            </div>
          </section>

          <section class="ep-section fi" id="availability">
            <p class="ep-sec-title">Availability &mdash; by month</p>
            <div class="avail-grid" id="pd-avail-grid"></div>
            <div class="avail-legend">
              <span class="avail-key"><span class="avail-dot g"></span>Available</span>
              <span class="avail-key"><span class="avail-dot a"></span>Partial</span>
              <span class="avail-key"><span class="avail-dot x"></span>Booked</span>
            </div>
          </section>

          <section class="ep-section fi">
            <p class="ep-sec-title">Location</p>
            <p id="pd-address">${p.address.replace('\n', '<br>')}</p>
            <a id="pd-map-link" href="${p.mapUrl}" target="_blank" rel="noopener noreferrer" data-cursor style="margin-top:1.1rem">
              ${PIN_SVG}
              Get Directions on Google Maps
            </a>
          </section>

          <section class="ep-section fi">
            <p class="ep-sec-title">Gallery &mdash; ${p.images.length} photographs</p>
            <div id="pd-gallery">
            ${gallery}
            </div>
          </section>

${p.staff.length ? `          <section class="ep-section fi">
            <p class="ep-sec-title">The People of the House</p>
            ${p.staff.map(s => `<div class="lg-item"><div class="lg-name">${esc(s.name)}</div><p class="lg-meta">${esc(s.role)}</p><p class="lg-desc">${esc(s.bio)}</p></div>`).join('\n            ')}
          </section>
` : ''}          <section class="ep-section fi">
            <p class="ep-sec-title">The Local Guide &mdash; curated by our staff</p>
            <div class="lg-grid">${guide}
            </div>
          </section>

          <section class="ep-section fi">
            <p class="ep-sec-title">Guest Voices &mdash; ${esc(p.name)}</p>
            <div class="ep-reviews">${reviews}
            </div>
          </section>
        </article>
${bookingAside(p)}
      </div>
    </div>

    <section class="ep-similar fi">
      <div class="sec-head">
        <div>
          <p class="sec-ey">Continue Exploring</p>
          <h2 class="st">Other AnVira Estates</h2>
        </div>
      </div>
      <div class="cards">${similar}
      </div>
    </section>

    <div id="inquiry" class="fi">
      <div>
        <p class="sec-ey">Private Viewing</p>
        <h2>Undecided? Request a curated showing of ${esc(p.name)}.</h2>
      </div>
      <a class="cta" style="text-decoration:none" href="https://wa.me/${WA_NUMBER}?text=${waText}" target="_blank" rel="noopener noreferrer" data-cursor>Enquire on WhatsApp</a>
    </div>
${chrome.trust}
${chrome.footer}
  </main>

  <div id="float-wa">
    <a href="https://wa.me/${WA_NUMBER}?text=${waText}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">${WA_SVG}</a>
  </div>

  <div id="sticky-book">
    <a href="#bw">${WA_SVG} Check availability &mdash; ${esc(p.name)}</a>
  </div>

  <div id="mpc-wrap" role="dialog" aria-modal="true" aria-label="Enquiry preview">
    <div id="mpc">
      <p class="mpc-eye">Your enquiry</p>
      <p class="mpc-title" id="mpc-prop"></p>
      <div class="mpc-rows">
        <div class="mpc-row"><span>Check-in</span><b id="mpc-in"></b></div>
        <div class="mpc-row"><span>Check-out</span><b id="mpc-out"></b></div>
        <div class="mpc-row"><span>Nights</span><b id="mpc-nights"></b></div>
        <div class="mpc-row"><span>Guests</span><b id="mpc-guests"></b></div>
      </div>
      <div class="bw-field">
        <label class="mpc-note-label" for="mpc-name">Name</label>
        <input class="bw-input" type="text" id="mpc-name" autocomplete="name" />
      </div>
      <div class="bw-field">
        <label class="mpc-note-label" for="mpc-note">Add a note &mdash; occasion, requests (optional)</label>
        <textarea class="bw-input" id="mpc-note" maxlength="300" placeholder="e.g. Our tenth anniversary &mdash; we'd love a quiet corner room."></textarea>
      </div>
      <div class="mpc-preview" id="mpc-preview" aria-live="polite"></div>
      <div class="mpc-actions">
        <button class="mpc-send" id="mpc-send" data-cursor>Send on WhatsApp</button>
        <button class="mpc-cancel" id="mpc-cancel" data-cursor>Cancel</button>
      </div>
    </div>
  </div>

  <div id="lb">
    <button id="lb-close" aria-label="Close">&#xd7;</button>
    <button id="lb-prev" aria-label="Previous">&#x2039;</button>
    <img id="lb-img" src="" alt="" draggable="false" />
    <button id="lb-next" aria-label="Next">&#x203a;</button>
    <div id="lb-dots"></div>
    <div id="lb-counter"></div>
  </div>

  <script src="../assets/js/data.js"></script>
  <script src="../assets/js/core.js"></script>
  <script src="../assets/js/gallery.js"></script>
  <script src="../assets/js/booking.js"></script>
  <script src="../assets/js/estate.js"></script>
</body>
</html>
`;
}

function listingPage() {
  const regions = [...new Set(PROPERTIES.map(p => p.region))];
  const filterBar = `
      <div id="est-filter" class="est-filter" role="group" aria-label="Filter estates">
        <div class="est-pills">
          <button type="button" class="est-pill on" data-region="all" data-cursor>All</button>
          ${regions.map(r => `<button type="button" class="est-pill" data-region="${esc(r)}" data-cursor>${esc(r)}</button>`).join('\n          ')}
        </div>
        <label class="est-guests-label" for="est-guests">Guests
          <select id="est-guests" class="est-guests" data-cursor>
            <option value="0">Any</option>
            <option value="6">6+</option>
            <option value="10">10+</option>
            <option value="15">15+</option>
            <option value="20">20+</option>
          </select>
        </label>
      </div>`;

  const comingSoon = COMING_SOON.map(c => `
        <div class="prop-card prop-card-soon" data-region="${esc(c.region)}">
          <div class="ci-wrap ci-soon" aria-hidden="true"><div class="jaali"></div></div>
          <div class="ctag">${esc(c.tag)}</div>
          <div class="crow">
            <div><div class="cname">${esc(c.name)}</div><div class="cloc">${esc(c.loc)}</div></div>
            <div class="cprice">Opening soon</div>
          </div>
          <div class="cdesc">${esc(c.desc)}</div>
          <div class="cfoot">
            <button type="button" class="enq" data-waitlist="${esc(c.id)}" data-waitlist-name="${esc(`${c.name}, ${c.loc}`)}" data-cursor>Notify me</button>
          </div>
        </div>`).join('');

  const cards = PROPERTIES.map(p => `
        <div class="prop-card" data-region="${esc(p.region)}" data-guests="${p.maxGuests}" data-cursor onclick="location.href='./${p.id}.html'">
          <div class="ci-wrap"><img class="ci" src="../${p.card}" alt="${esc(p.name)}" loading="lazy" /></div>
          <div class="ctag">${esc(p.tag)}</div>
          <div class="crow">
            <div><div class="cname">${esc(p.name)}</div><div class="cloc">${esc(p.loc)}</div></div>
            <div class="cprice">${esc(p.price)}</div>
          </div>
          <div class="cdesc">${esc(p.desc)}</div>
          <div class="cfoot">
            <div class="cm"><div class="cm-n">${p.rooms}</div><div class="cm-l">Rooms</div></div>
            <div class="cm"><div class="cm-n">${p.maxGuests}</div><div class="cm-l">Guests</div></div>
            <div class="cm"><div class="cm-n">${p.baths}</div><div class="cm-l">Baths</div></div>
            <a class="enq" href="./${p.id}.html" data-cursor>View Details</a>
          </div>
        </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Estate Collection — Private Luxury Villas in India | AnVira</title>
  <meta name="description" content="The complete AnVira portfolio — hand-selected private estates in Chail, New Delhi, and Goa. Browse, compare, and book directly." />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#F5F1E8" />
  <link rel="canonical" href="${SITE_URL}/estates/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="The Estate Collection | AnVira" />
  <meta property="og:description" content="Hand-selected private estates in Chail, New Delhi, and Goa. Book directly." />
  <meta property="og:image" content="${SITE_URL}/chail/anvira-terrace.webp" />
${fonts}
  <link rel="stylesheet" href="../assets/css/main.css" />
</head>
<body data-base="../">
${chrome.nav}

  <main>
    <section id="listings" style="padding-top:clamp(120px,16vh,170px)">
      <div class="sec-head">
        <div>
          <p class="sec-ey">Estate Collection</p>
          <h2 class="st">The Portfolio</h2>
        </div>
      </div>
${filterBar}
      <div class="cards" id="est-cards">${cards}
${comingSoon}
      </div>
      <p id="est-empty" class="est-empty" style="display:none">No estate matches that filter yet &mdash; <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello AnVira, I'm looking for an estate — can you help?")}" target="_blank" rel="noopener noreferrer" data-cursor>tell us what you're looking for</a>.</p>
    </section>

    <div id="inquiry" class="fi">
      <div>
        <p class="sec-ey">Private Viewing</p>
        <h2>Request a curated showing.<br>Discretion is our default.</h2>
      </div>
      <a class="cta" style="text-decoration:none" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello AnVira, I'd like to enquire about an estate.")}" target="_blank" rel="noopener noreferrer" data-cursor>Enquire on WhatsApp</a>
    </div>
${chrome.trust}
${chrome.footer}
  </main>

  <div id="float-wa">
    <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello AnVira, I'm browsing your estate collection and have a question.")}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">${WA_SVG}</a>
  </div>

  <div id="wl-wrap" role="dialog" aria-modal="true" aria-label="Join the waitlist">
    <div id="wl">
      <p class="mpc-eye">Under curation</p>
      <p class="mpc-title" id="wl-estate"></p>
      <form id="wl-form" novalidate>
        <p class="wl-blurb">Leave your WhatsApp number and we'll message you the moment this estate opens for enquiries. Nothing else, ever.</p>
        <div class="bw-field">
          <label class="mpc-note-label" for="wl-name">Your name</label>
          <input class="bw-input" type="text" id="wl-name" autocomplete="name" />
        </div>
        <div class="bw-field">
          <label class="mpc-note-label" for="wl-wa">WhatsApp number</label>
          <input class="bw-input" type="tel" id="wl-wa" inputmode="numeric" autocomplete="tel" placeholder="10-digit mobile" />
        </div>
        <label class="wl-consent-row" for="wl-consent">
          <input type="checkbox" id="wl-consent" />
          <span>You may message me on WhatsApp when this estate launches.</span>
        </label>
        <p class="bw-err" id="wl-err" role="alert" aria-live="polite"></p>
        <div class="mpc-actions">
          <button type="submit" class="mpc-send" id="wl-send" data-cursor>Notify me</button>
          <button type="button" class="mpc-cancel" id="wl-cancel" data-cursor>Cancel</button>
        </div>
      </form>
      <div id="wl-done" style="display:none">
        <p class="wl-done-msg">You're on the list. We'll send one message when the estate opens &mdash; nothing else.</p>
        <div class="mpc-actions"><button type="button" class="mpc-cancel" data-cursor onclick="document.getElementById('wl-wrap').classList.remove('open')">Close</button></div>
      </div>
    </div>
  </div>

  <script src="../assets/js/data.js"></script>
  <script src="../assets/js/core.js"></script>
  <script src="../assets/js/listing.js"></script>
</body>
</html>
`;
}

/* ── Shared shell for simple inner pages (arrive / reviews / legal) ── */
function shell({ title, desc, robots = 'index, follow', canonicalPath, body, scripts = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="robots" content="${robots}" />
  <meta name="theme-color" content="#F5F1E8" />
${canonicalPath ? `  <link rel="canonical" href="${SITE_URL}${canonicalPath}" />\n` : ''}${fonts}
  <link rel="stylesheet" href="../assets/css/main.css" />
</head>
<body data-base="../">
${chrome.nav}

  <main>
${body}
${chrome.footer}
  </main>

  <div id="float-wa">
    <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">${WA_SVG}</a>
  </div>

  <script src="../assets/js/data.js"></script>
  <script src="../assets/js/core.js"></script>
${scripts}</body>
</html>
`;
}

/* ── /arrive/[slug] — private pre-arrival page (unlisted, noindex) ── */
function arrivePage(p) {
  const a = p.arrive;
  const distances = a.distances.map(d => `
            <div class="arr-dist">
              <div class="arr-dist-from">${esc(d.from)}</div>
              <div class="arr-dist-time">${esc(d.mode)} &mdash; ${esc(d.time)}</div>
            </div>`).join('');
  const notes = a.notes.map(n => `<li>${esc(n)}</li>`).join('\n              ');
  const bring = a.bring.map(b => `<li>${esc(b)}</li>`).join('\n              ');
  const caretaker = p.staff.length
    ? p.staff.map(s => `<p class="arr-caretaker"><b>${esc(s.name)}</b> &mdash; ${esc(s.role)}. Their direct number is in your booking confirmation.</p>`).join('')
    : `<p class="arr-caretaker">Your caretaker's name and direct number are shared in your booking confirmation. Until then, we are your single point of contact.</p>`;

  const body = `
    <section class="inner-page">
      <p class="sec-ey">Your stay is confirmed</p>
      <h1 class="inner-title">Getting to ${esc(p.name)}</h1>
      <p class="inner-sub">${esc(p.loc)} &mdash; everything you need before you set out. This page is private to confirmed guests; save the link.</p>

      <section class="ep-section">
        <p class="ep-sec-title">The address</p>
        <p id="pd-address">${p.address.replace('\n', '<br>')}</p>
        <a id="pd-map-link" href="${p.mapUrl}" target="_blank" rel="noopener noreferrer" data-cursor style="margin-top:1.1rem">${PIN_SVG} Open directions in Google Maps</a>
      </section>

      <section class="ep-section">
        <p class="ep-sec-title">Getting here</p>
        <div class="arr-dist-grid">${distances}
        </div>
      </section>

      <section class="ep-section">
        <p class="ep-sec-title">Check-in &amp; check-out</p>
        <div class="ep-stats">
          <div><div class="pd-spec-n">${esc(a.checkIn)}</div><div class="pd-spec-l">Check-in from</div></div>
          <div><div class="pd-spec-n">${esc(a.checkOut)}</div><div class="pd-spec-l">Check-out by</div></div>
        </div>
        <p class="arr-note-p">Arriving earlier or leaving later? Tell us on WhatsApp &mdash; we accommodate whenever the calendar allows.</p>
      </section>

      <section class="ep-section">
        <p class="ep-sec-title">The people of the house</p>
        ${caretaker}
        <div class="arr-contact">
          <a class="cta" style="text-decoration:none" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello AnVira, we're arriving at ${p.name} — a quick question.`)}" target="_blank" rel="noopener noreferrer" data-cursor>WhatsApp us</a>
          <a class="bw-call" href="tel:+${WA_NUMBER}" data-cursor>or call +${WA_NUMBER.slice(0,2)} ${WA_NUMBER.slice(2,7)} ${WA_NUMBER.slice(7)}</a>
        </div>
      </section>

      <section class="ep-section">
        <p class="ep-sec-title">House notes</p>
        <ul class="arr-list">
              ${notes}
        </ul>
      </section>

      <section class="ep-section">
        <p class="ep-sec-title">Worth packing</p>
        <ul class="arr-list">
              ${bring}
        </ul>
      </section>
    </section>`;

  return shell({
    title: `Getting to ${p.name} — Pre-Arrival Guide | AnVira`,
    desc: `Private pre-arrival guide for confirmed guests of ${p.name}, ${p.loc}.`,
    robots: 'noindex, nofollow',
    body,
  });
}

/* ── /reviews/submit — post-stay review form ── */
function reviewsPage() {
  const propOptions = PROPERTIES.map(p => `<option value="${esc(`${p.name}, ${p.loc}`)}">${esc(p.name)} &mdash; ${esc(p.loc)}</option>`).join('\n              ');
  const occasions = ['Anniversary', 'Birthday', 'Family Reunion', 'Corporate Retreat', 'Holiday', 'Honeymoon', 'Other'];
  const body = `
    <section class="inner-page">
      <p class="sec-ey">After your stay</p>
      <h1 class="inner-title">Tell us how it was</h1>
      <p class="inner-sub">A few honest lines help the next guest choose well. Reviews are read by the owner and published with your first name only.</p>

      <form id="rv-form" class="rv-form" novalidate>
        <div class="bw-field">
          <label class="mpc-note-label" for="rv-prop">Which estate did you stay at?</label>
          <select class="bw-input" id="rv-prop" required>
            <option value="">Select an estate&hellip;</option>
              ${propOptions}
          </select>
        </div>
        <div class="bw-row">
          <div class="bw-field">
            <label class="mpc-note-label" for="rv-name">Your name</label>
            <input class="bw-input" type="text" id="rv-name" autocomplete="name" />
          </div>
          <div class="bw-field">
            <label class="mpc-note-label" for="rv-phone">Phone (kept private)</label>
            <input class="bw-input" type="tel" id="rv-phone" inputmode="numeric" autocomplete="tel" placeholder="10-digit mobile" />
          </div>
        </div>
        <div class="bw-field">
          <label class="mpc-note-label" for="rv-occ">The occasion</label>
          <select class="bw-input" id="rv-occ">
              ${occasions.map(o => `<option>${o}</option>`).join('\n              ')}
          </select>
        </div>
        <fieldset class="rv-rating" id="rv-rating">
          <legend class="mpc-note-label">Your rating</legend>
          ${[1,2,3,4,5].map(n => `<input type="radio" name="rating" id="rv-star-${n}" value="${n}" /><label for="rv-star-${n}" data-cursor aria-label="${n} star${n > 1 ? 's' : ''}">&#9733;</label>`).join('\n          ')}
        </fieldset>
        <div class="bw-field">
          <label class="mpc-note-label" for="rv-text">Your review &mdash; up to 200 words</label>
          <textarea class="bw-input" id="rv-text" rows="6" placeholder="What stayed with you?"></textarea>
          <p class="rv-count" id="rv-count" aria-live="polite">0 / 200 words</p>
        </div>
        <p class="bw-err" id="rv-err" role="alert" aria-live="polite"></p>
        <button type="submit" class="cta" id="rv-send" data-cursor>Submit review</button>
      </form>

      <div id="rv-done" class="rv-done" style="display:none">
        <p class="ep-sec-title">Thank you.</p>
        <p class="inner-sub">Your review has reached us. Once the owner reads it, it joins the guest voices on the estate page.</p>
        <a class="cta" style="text-decoration:none" href="../estates/index.html" data-cursor>Back to the estates</a>
      </div>
    </section>`;

  return shell({
    title: 'Share Your Review | AnVira',
    desc: 'Stayed with AnVira? Tell us how it was — your review helps the next guest choose well.',
    canonicalPath: '/reviews/submit.html',
    body,
    scripts: '  <script src="../assets/js/review.js"></script>\n',
  });
}

/* ── /legal/* — readable prose, same design language ── */
const LEGAL_PAGES = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    intro: 'We collect almost nothing, and we sell nothing. Here is exactly what happens to your information.',
    sections: [
      ['What we collect', `When you enquire, we receive what you choose to send on WhatsApp — your name, dates, party size, and any note you add. If you join a waitlist or submit a review, we store the name and number you provide in a private spreadsheet accessible only to AnVira's owners.`],
      ['What we use it for', `Replying to your enquiry, holding your dates, and — only if you have explicitly agreed — one message when a new estate opens. We do not run marketing lists, we do not send newsletters, and we never share or sell your details to anyone.`],
      ["What we don't do", `No advertising trackers, no analytics that identify you, no cookies beyond what is technically necessary for the site to function. Conversations happen on WhatsApp, which is end-to-end encrypted.`],
      ['Your choices', `Ask us at any time to delete your details from our records — one WhatsApp message is enough, and we confirm when it is done.`],
      ['Contact', `For anything privacy-related, message us on WhatsApp or call +91 98070 87087.`],
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Stay',
    intro: 'Plain terms for a direct booking — what you can expect of us, and what we ask of you.',
    sections: [
      ['Booking & confirmation', `A booking is confirmed once dates are agreed on WhatsApp and the advance is received. The confirmation message — with your dates, tariff, and inclusions — is the record of our agreement.`],
      ['Tariff & payment', `Tariffs are quoted per stay and include what the confirmation lists. Anything arranged additionally (chef meals, bonfires, excursions, transfers) is settled directly at the estate before check-out.`],
      ['Your stay', `Guest counts must match the booking — our estates are staffed and provisioned for the number agreed. House quiet hours and pool timings are noted on each estate's pre-arrival page. The guest who books is responsible for the conduct of the party and for any damage beyond normal wear.`],
      ['Our responsibilities', `A clean, safe, staffed estate matching its listing; honest photography; a reply within 2 hours, 9am–9pm IST. If something at the estate falls short, tell the caretaker first — most things are fixed within the hour.`],
      ['Liability', `Stays are at the guest's own risk in respect of personal belongings and activities undertaken off the estate. Nothing in these terms limits rights you hold under Indian consumer law.`],
      ['Disputes', `We resolve issues directly and in good faith. These terms are governed by the laws of India.`],
    ],
  },
  {
    slug: 'cancellation',
    title: 'Cancellation Policy',
    intro: 'Plans change. This is how we handle it — stated up front, applied without argument.',
    sections: [
      ['If you cancel', `More than 14 days before check-in: full refund of the advance. 7–14 days before: 50% of the advance is retained. Within 7 days: the advance is retained — though we will always first offer to move your dates instead.`],
      ['Date changes', `One date change is free when requested more than 7 days out, subject to availability. We would always rather move your stay than cancel it.`],
      ['If we cancel', `If an estate becomes unavailable for any reason on our side, you choose: a full and immediate refund, or equivalent dates at the same or another AnVira estate with any tariff difference in your favour.`],
      ['Weather & force majeure', `Mountain roads close, rivers rise. If a verified event beyond anyone's control prevents the stay, we move your dates without penalty.`],
      ['How refunds happen', `Refunds go back the way the payment came, within 7 working days, confirmed on WhatsApp.`],
    ],
  },
];

function legalPage(pg) {
  const sections = pg.sections.map(([h, t]) => `
      <section class="ep-section">
        <p class="ep-sec-title">${esc(h)}</p>
        <p class="legal-p">${esc(t)}</p>
      </section>`).join('');
  const body = `
    <section class="inner-page">
      <p class="sec-ey">AnVira Private Estates</p>
      <h1 class="inner-title">${esc(pg.title)}</h1>
      <p class="inner-sub">${esc(pg.intro)}</p>
${sections}
      <p class="legal-updated">Last updated: June 2026 &mdash; pending final owner approval before launch.</p>
    </section>`;
  return shell({
    title: `${pg.title} | AnVira`,
    desc: pg.intro,
    canonicalPath: `/legal/${pg.slug}.html`,
    body,
  });
}

mkdirSync(join(ROOT, 'estates'), { recursive: true });
for (const p of PROPERTIES) {
  writeFileSync(join(ROOT, 'estates', `${p.id}.html`), estatePage(p));
  console.log(`built estates/${p.id}.html`);
}
writeFileSync(join(ROOT, 'estates', 'index.html'), listingPage());
console.log('built estates/index.html');

mkdirSync(join(ROOT, 'arrive'), { recursive: true });
for (const p of PROPERTIES) {
  writeFileSync(join(ROOT, 'arrive', `${p.id}.html`), arrivePage(p));
  console.log(`built arrive/${p.id}.html`);
}

mkdirSync(join(ROOT, 'reviews'), { recursive: true });
writeFileSync(join(ROOT, 'reviews', 'submit.html'), reviewsPage());
console.log('built reviews/submit.html');

mkdirSync(join(ROOT, 'legal'), { recursive: true });
for (const pg of LEGAL_PAGES) {
  writeFileSync(join(ROOT, 'legal', `${pg.slug}.html`), legalPage(pg));
  console.log(`built legal/${pg.slug}.html`);
}

/* ── sitemap.xml + robots.txt — /arrive is private and excluded ── */
const today = new Date().toISOString().slice(0, 10);
const urls = [
  '/', '/estates/',
  ...PROPERTIES.map(p => `/estates/${p.id}.html`),
  '/reviews/submit.html',
  ...LEGAL_PAGES.map(pg => `/legal/${pg.slug}.html`),
];
writeFileSync(join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`);
console.log('built sitemap.xml');

writeFileSync(join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /arrive/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log('built robots.txt');

/* ── Stamp the service-worker cache version from asset contents so every
   css/js change invalidates the old cache on the next visit. ── */
{
  const { createHash } = await import('node:crypto');
  const { readdirSync } = await import('node:fs');
  const h = createHash('sha1');
  h.update(readFileSync(join(ROOT, 'assets/css/main.css')));
  for (const f of readdirSync(join(ROOT, 'assets/js')).sort()) {
    h.update(readFileSync(join(ROOT, 'assets/js', f)));
  }
  const stamp = `anvira-${h.digest('hex').slice(0, 10)}`;
  const sw = readFileSync(join(ROOT, 'sw.js'), 'utf8')
    .replace(/const VERSION = '[^']*'; \/\* BUILD_VERSION \*\//, `const VERSION = '${stamp}'; /* BUILD_VERSION */`);
  writeFileSync(join(ROOT, 'sw.js'), sw);
  console.log(`stamped sw.js → ${stamp}`);
}
