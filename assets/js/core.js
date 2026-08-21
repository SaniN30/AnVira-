/* ── AnVira — core.js — shared chrome: cursor, nav, menu, fade-ins, progress, WhatsApp float ── */
'use strict';

const isTouchDevice = window.matchMedia('(hover: none)').matches;
/* Pages deeper in the tree set <body data-base="../"> so repo-relative
   asset paths in data.js resolve from any directory. */
const ASSET_BASE = document.body.dataset.base || './';
const img = path => ASSET_BASE + path;

/* ── Cursor ─────────────────────────────────────────────── */
const ring = document.getElementById('cursor-ring');
const dot  = document.getElementById('cursor-dot');
if (!isTouchDevice && ring && dot) {
  document.addEventListener('mousemove', e => {
    const x = e.clientX, y = e.clientY;
    ring.style.transform = `translate(${x - 18}px, ${y - 18}px)`;
    dot.style.transform  = `translate(${x - 2}px,  ${y - 2}px)`;
    ring.classList.add('active');
    dot.classList.add('active');
    const el = document.elementFromPoint(x, y);
    el && el.closest('[data-cursor]') ? ring.classList.add('on') : ring.classList.remove('on');
  });
  /* Hide again the moment the pointer leaves the viewport (e.g. to the
     browser chrome) so it never lingers mid-page. */
  document.addEventListener('mouseleave', () => {
    ring.classList.remove('active');
    dot.classList.remove('active');
  });
}

/* ── Scroll — logo + nav + parallax ────────────────────── */
const navEl   = document.getElementById('nav');
const hwm     = document.getElementById('hwm');
const navLogo = document.getElementById('nav-logo');
const avLines = document.querySelectorAll('.av-line');

function onScroll() {
  const sy   = window.scrollY;
  const prog = Math.min(sy / 300, 1);
  navEl.classList.toggle('scrolled', sy > 50);
  if (hwm) {
    hwm.style.transform = `translateY(${sy * 0.28}px)`;
    hwm.style.opacity   = String(Math.max(0, 1 - sy / 330));
  }
  avLines.forEach(l => { l.style.transform = `scaleX(${prog})`; });
  navLogo.style.letterSpacing = `${(0.12 - prog * 0.04).toFixed(3)}em`;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Burger / menu (right-side slide panel) ─────────────── */
const burger = document.getElementById('burger');
const menu   = document.getElementById('menu');

/* Inject the dim-scrim behind the panel */
const scrim = document.createElement('div');
scrim.id = 'menu-scrim';
document.body.appendChild(scrim);

let menuOpen = false;
let releaseMenuTrap = null;

function openMenu() {
  menuOpen = true;
  burger.classList.add('open');
  menu.classList.add('open');
  scrim.classList.add('show');
  if (releaseMenuTrap) { releaseMenuTrap(); }
  releaseMenuTrap = trapFocus(menu);
}
function closeMenu() {
  menuOpen = false;
  burger.classList.remove('open');
  menu.classList.remove('open');
  scrim.classList.remove('show');
  if (releaseMenuTrap) { releaseMenuTrap(); releaseMenuTrap = null; }
}

burger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
scrim.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
menu.querySelectorAll('.mlink').forEach(a => a.addEventListener('click', closeMenu));

/* ── Scroll fade-ins ─────────────────────────────────────── */
const fObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); fObs.unobserve(e.target); } });
}, { rootMargin: '0px 0px -20% 0px', threshold: 0 });
document.querySelectorAll('.fi').forEach(el => fObs.observe(el));

/* ── Scroll indicator hide-on-scroll ────────────────────── */
const scrollInd = document.getElementById('scroll-ind');
if (scrollInd) {
  let siGone = false;
  window.addEventListener('scroll', () => {
    if (!siGone && window.scrollY > 80) { scrollInd.classList.add('gone'); siGone = true; }
  }, { passive: true });
}

/* ── Scroll progress bar ────────────────────────────────── */
const progEl = document.getElementById('scroll-progress');
if (progEl) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progEl.style.width = max > 0 ? `${(h.scrollTop / max) * 100}%` : '0';
  }, { passive: true });
}

/* ── Floating WhatsApp — show after hero leaves viewport ── */
const floatWa   = document.getElementById('float-wa');
const stickyBk  = document.getElementById('sticky-book');
const heroEl    = document.getElementById('hero');
if (floatWa && !heroEl) {
  /* No hero (estate / inner pages): show immediately */
  floatWa.classList.add('show');
  if (stickyBk) stickyBk.classList.add('show');
}
if (floatWa && heroEl) {
  const waObs = new IntersectionObserver(entries => {
    const leaving = !entries[0].isIntersecting;
    floatWa.classList.toggle('show', leaving);
    if (stickyBk) stickyBk.classList.toggle('show', leaving);
  }, { threshold: 0.15 });
  waObs.observe(heroEl);
}

/* ── Homepage hero — slow auto-advancing crossfade through the real
   photo set (same images used in the gallery), instead of one fixed
   frame. Reduced-motion: stays on the first frame, no cycling. ─── */
(function initHeroShuffle() {
  const hero = document.getElementById('hero');
  const media = hero && (hero.querySelector('.ep-hero-media') || hero);
  const baseImg = media && media.querySelector(':scope > img');
  if (!hero || !media || !baseImg || typeof PROPERTIES === 'undefined') return;
  const prop = PROPERTIES.find(p => p.id === document.body.dataset.estate) || PROPERTIES[0];
  const images = (prop && prop.images) ? prop.images.slice(1, 9) : [];
  if (!images.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = images.map(src => {
    const el = baseImg.cloneNode(false);
    el.removeAttribute('srcset');
    el.removeAttribute('sizes');
    el.src = img(src);
    el.loading = 'eager';
    el.decoding = 'async';
    el.style.position = 'absolute';
    el.style.inset = '0';
    el.style.opacity = '0';
    el.style.transition = 'opacity 1.8s ease';
    media.insertBefore(el, media.querySelector('.ep-hero-overlay'));
    return el;
  });
  baseImg.style.transition = 'opacity 1.8s ease';

  const frames = [baseImg, ...layers];
  let idx = 0;
  setInterval(() => {
    const next = (idx + 1) % frames.length;
    frames[next].style.opacity = '1';
    frames[idx].style.opacity = '0';
    idx = next;
  }, 6000);
})();

/* ── PWA — offline estate pages (Phase 6) ─────────────────── */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(ASSET_BASE + 'sw.js').catch(() => {});
  });
}

/* ── Focus trap for overlays (menu, lightbox, modals) ─────
   Call on open; invoke the returned function on close to
   release the trap and restore focus to the opener. */
function trapFocus(container) {
  const opener = document.activeElement;
  const sel = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = () => [...container.querySelectorAll(sel)].filter(el => el.offsetParent !== null || container.contains(el));
  const first = focusables()[0];
  if (first) first.focus();
  function onKey(e) {
    if (e.key !== 'Tab') return;
    const els = focusables();
    if (!els.length) return;
    const a = els[0], z = els[els.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
  document.addEventListener('keydown', onKey);
  return () => {
    document.removeEventListener('keydown', onKey);
    if (opener && opener.focus) opener.focus();
  };
}

function toISO(dt) {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

/* ── Lead-capture popup ──────────────────────────────────── */
(function initLeadPopup() {
  const wrap = document.getElementById('lead-popup-wrap');
  if (!wrap) return;
  if (localStorage.getItem('av_lead_captured')) return;

  const closePopup = () => wrap.classList.remove('show');
  document.getElementById('lead-popup-close').addEventListener('click', closePopup);
  wrap.addEventListener('click', e => { if (e.target === wrap) closePopup(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && wrap.classList.contains('show')) closePopup();
  });

  document.getElementById('lead-popup-form').addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('lp-name').value.trim();
    const email = document.getElementById('lp-email').value.trim();
    const phone = document.getElementById('lp-phone').value.trim();
    if (!name || !email) return;
    if (typeof logToSheet === 'function') {
      logToSheet('lead', { name, email, phone, page: location.pathname });
    }
    localStorage.setItem('av_lead_captured', '1');
    closePopup();
  });

  /* Show after 3.5 s — allows intro animation to finish */
  setTimeout(() => wrap.classList.add('show'), 3500);
})();

/* ── Background video frames — swap poster for the real loop once it
   can play, so slow connections always show a still, never a blank
   box. Reused by every .av-video-frame / .av-video-card. ─────────── */
document.querySelectorAll('.av-video-frame video, .av-video-card video').forEach(v => {
  const wrap = v.closest('.av-video-frame, .av-video-card');
  v.addEventListener('canplay', () => wrap.classList.add('loaded'), { once: true });
});

/* ── Video playlist cycling — every background-video slot rotates
   through ALL of the site's clips back-to-back (not just its own),
   crossfading between two stacked <video> layers so a clip ending
   never shows a blank frame before the next one starts. ─────────── */
(function initVideoPlaylists() {
  const PLAYLIST = [
    'assets/video/villa-terrace-firepit-story.mp4',
    'assets/video/valley-terrace-golden-hour.mp4'
  ].map(img);
  if (PLAYLIST.length < 2) return;

  document.querySelectorAll('.av-video-frame, .av-video-card').forEach(wrap => {
    const vA = wrap.querySelector('video');
    if (!vA) return;

    const srcEl = vA.querySelector('source');
    const startFile = (srcEl ? srcEl.getAttribute('src') : vA.getAttribute('src') || '').split('/').pop();
    let idx = PLAYLIST.findIndex(p => p.endsWith(startFile));
    if (idx < 0) idx = 0;

    vA.loop = false;
    vA.removeAttribute('loop');
    if (srcEl) srcEl.remove();
    vA.src = PLAYLIST[idx];
    vA.load();
    vA.play().catch(() => {});

    const vB = vA.cloneNode(false);
    vB.removeAttribute('id');
    vB.muted = true; vB.playsInline = true; vB.autoplay = false; vB.preload = 'auto';
    vB.style.opacity = '0';
    vB.style.transition = 'opacity .6s ease';
    vA.style.transition = 'opacity .6s ease';
    wrap.appendChild(vB);

    let active = vA, standby = vB, activeIdx = idx;

    function armStandby() {
      const nextIdx = (activeIdx + 1) % PLAYLIST.length;
      standby.dataset.idx = String(nextIdx);
      standby.src = PLAYLIST[nextIdx];
      standby.currentTime = 0;
      standby.load();
    }
    armStandby();

    function crossfade() {
      standby.style.opacity = '1';
      active.style.opacity = '0';
      standby.play().catch(() => {});
      setTimeout(() => {
        active.pause();
        const tmp = active; active = standby; standby = tmp;
        activeIdx = Number(active.dataset.idx || 0);
        armStandby();
      }, 620);
    }

    const poll = setInterval(() => {
      if (!wrap.isConnected) { clearInterval(poll); return; }
      if (!active.duration || active.seeking) return;
      if (active.duration - active.currentTime < 0.45 && standby.readyState >= 3) {
        crossfade();
      }
    }, 150);
  });
})();
