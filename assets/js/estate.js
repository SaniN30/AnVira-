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

  /* Hero name — word stagger (40ms per word, claude.md §3) */
  const heroName = document.getElementById('pd-hero-name');
  if (heroName) {
    const wordSpans = heroName.textContent.trim().split(/\s+/)
      .map((w, i) => `<span class="hw" style="--wi:${i}">${w}</span>`);
    heroName.innerHTML = wordSpans.join(' ');
  }

  /* Booking panel slides in on first scroll past the hero */
  const aside = document.querySelector('.ep-aside');
  const epHero = document.querySelector('.ep-hero');
  if (aside && epHero) {
    aside.classList.add('pre');
    const asideObs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) {
        aside.classList.remove('pre');
        aside.classList.add('in');
        asideObs.disconnect();
      }
    }, { threshold: 0.55 });
    asideObs.observe(epHero);
    /* loaded mid-page (anchor link / restored scroll): show immediately */
    if (window.scrollY > window.innerHeight * 0.45) {
      aside.classList.remove('pre');
      aside.classList.add('in');
      asideObs.disconnect();
    }
  }
}
