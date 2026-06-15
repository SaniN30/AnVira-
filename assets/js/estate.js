/* ── AnVira — estate.js — estate page runtime (content is pre-baked by tools/build-estates.mjs) ── */
'use strict';

const EP = PROPERTIES.find(p => p.id === document.body.dataset.estate);

if (EP) {
  /* Booking widget: capacity cap, date floors, availability calendar */
  initBooking(EP);

  /* Gallery → lightbox (lightbox follows the active category filter) */
  const epImages = EP.images.map(img);
  const galTiles = [...document.querySelectorAll('#pd-gallery img')];
  let galCat = 'all';
  const visibleIdx = () => galTiles
    .filter(t => galCat === 'all' || t.dataset.cat === galCat)
    .map(t => +t.dataset.idx);
  galTiles.forEach(el => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    const show = () => {
      const vis = visibleIdx();
      openLb(vis.map(i => epImages[i]), vis.indexOf(+el.dataset.idx), EP.name);
    };
    el.addEventListener('click', show);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }
    });
  });

  /* Category chips: hide non-matching tiles, move the editorial
     lead span to the first visible tile */
  document.querySelectorAll('#pd-gallery-tabs .gal-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      galCat = btn.dataset.cat;
      document.querySelectorAll('#pd-gallery-tabs .gal-tab').forEach(b => {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-selected', String(on));
      });
      let lead = true;
      galTiles.forEach(t => {
        const shown = galCat === 'all' || t.dataset.cat === galCat;
        t.classList.toggle('gal-hide', !shown);
        t.classList.toggle('lead', shown && lead);
        if (shown) lead = false;
      });
    });
  });

  /* Hero name — word stagger (40ms per word, claude.md §3) */
  const heroName = document.getElementById('pd-hero-name');
  if (heroName) {
    const wordSpans = heroName.textContent.trim().split(/\s+/)
      .map((w, i) => `<span class="hw" style="--wi:${i}">${w}</span>`);
    heroName.innerHTML = wordSpans.join(' ');
  }

  /* ── Local guide map links ───────────────────────────────── */
  if (EP.localGuide) {
    const lgItems = document.querySelectorAll('.lg-item');
    lgItems.forEach((item, i) => {
      const guide = EP.localGuide[i];
      if (!guide || !guide.mapUrl) return;
      const link = document.createElement('a');
      link.href = guide.mapUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'lg-map-link';
      link.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg> Get directions';
      item.appendChild(link);
    });
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
