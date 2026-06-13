/* ── AnVira — service worker — offline estate pages (Phase 6) ──
   Strategy: network-first for HTML (content freshness), cache-first
   for assets (css/js/images). Precaches the shell + all estate pages
   so a guest who opened an estate once can reread it offline. */
'use strict';

/* Stamped by tools/build-estates.mjs from a hash of css/js contents —
   any asset change produces a new cache and retires the old one. */
const VERSION = 'anvira-3f6b1e8c0d'; /* BUILD_VERSION */

const PRECACHE = [
  './',
  './index.html',
  './estates/index.html',
  './estates/villa-anvira.html',
  './estates/estate-10.html',
  './estates/tarikas-seascapes.html',
  './assets/css/main.css',
  './assets/js/data.js',
  './assets/js/core.js',
  './assets/js/booking.js',
  './assets/js/gallery.js',
  './assets/js/estate.js',
  './assets/js/listing.js',
  './brand/logo-transparent.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; /* fonts/CDNs: let the browser handle */

  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    /* network-first: fresh content when online, cache when not */
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  /* css/js: stale-while-revalidate — serve cache instantly, refresh it
     in the background so fixes propagate one visit later at worst */
  if (/\.(css|js)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then(hit => {
        const refresh = fetch(req).then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => hit);
        return hit || refresh;
      })
    );
    return;
  }

  /* images & the rest: cache-first, populate on miss */
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
