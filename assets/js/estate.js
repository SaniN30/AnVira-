/* ── AnVira — estate.js — estate page runtime (content is pre-baked by tools/build-estates.mjs) ── */
'use strict';

const EP = PROPERTIES.find(p => p.id === document.body.dataset.estate);

if (EP) {
  /* Booking widget: capacity cap, date floors, availability calendar */
  initBooking(EP);

  /* Gallery → lightbox */
  const epImages = EP.images.map(img);
  document.querySelectorAll('#pd-gallery img').forEach(el => {
    el.addEventListener('click', () => openLb(epImages, +el.dataset.idx, EP.name));
  });
}
