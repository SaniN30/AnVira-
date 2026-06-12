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
if (!isTouchDevice) {
  document.addEventListener('mousemove', e => {
    const x = e.clientX, y = e.clientY;
    ring.style.transform = `translate(${x - 18}px, ${y - 18}px)`;
    dot.style.transform  = `translate(${x - 2}px,  ${y - 2}px)`;
    const el = document.elementFromPoint(x, y);
    el && el.closest('[data-cursor]') ? ring.classList.add('on') : ring.classList.remove('on');
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

/* ── Burger / menu ──────────────────────────────────────── */
const burger = document.getElementById('burger');
const menu   = document.getElementById('menu');
let menuOpen = false;
burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  burger.classList.toggle('open', menuOpen);
  menu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});
menu.querySelectorAll('.mlink').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false; burger.classList.remove('open'); menu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

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

function toISO(dt) {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}
