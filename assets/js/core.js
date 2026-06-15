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
