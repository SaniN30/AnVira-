/* ── AnVira — home.js — homepage: intro, hero, accordion, cards, testimonials ── */
'use strict';

/* ── Intro sequence — logo reveal, skippable ────────────── */
const introEl   = document.getElementById('intro');
const introLogo = document.getElementById('intro-logo');
const iLine     = document.getElementById('intro-line');
const page      = document.getElementById('page');
const noMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let introEnded  = false;
let introTimer;

function endIntro(fast) {
  if (introEnded) return;
  introEnded = true;
  clearTimeout(introTimer);
  introLogo.classList.add('hide');
  const exitDelay = fast ? 120 : 520;
  setTimeout(() => {
    introEl.classList.add('out');
    page.classList.add('show');
    window.dispatchEvent(new CustomEvent('anvira:enter'));
  }, exitDelay);
  setTimeout(() => introEl.remove(), exitDelay + 1100);
}

if (noMotion) {
  introEl.remove();
  page.classList.add('show');
  window.dispatchEvent(new CustomEvent('anvira:enter'));
} else {
  // Small beat before the wordmark settles in; never blocks the page.
  Promise.race([Promise.resolve(), new Promise(r => setTimeout(r, 300))]).then(() => {
    requestAnimationFrame(() => {
      introLogo.classList.add('show');
      iLine.classList.add('full');
    });
    introTimer = setTimeout(() => endIntro(false), 2800);
  });

  // Interactive: the wordmark drifts gently toward the pointer until you enter.
  const introStage = document.getElementById('intro-stage');
  if (introStage) {
    let raf = 0;
    let px = 50, py = 44;
    const onMove = e => {
      if (introEnded) return;
      px = (e.clientX / window.innerWidth) * 100;
      py = (e.clientY / window.innerHeight) * 100;
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        introStage.style.transform =
          `translate(${x * 26}px, ${y * 18}px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg)`;
        introEl.style.setProperty('--mx', px + '%');
        introEl.style.setProperty('--my', py + '%');
      });
    };
    introEl.addEventListener('pointermove', onMove);
    introEl.addEventListener('pointerleave', () => {
      introStage.style.transform = '';
      introEl.style.setProperty('--mx', '50%');
      introEl.style.setProperty('--my', '44%');
    });
  }

  introEl.addEventListener('click', () => endIntro(true));
  window.addEventListener('keydown', function skipOnce(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      endIntro(true);
      window.removeEventListener('keydown', skipOnce);
    }
  });
}

/* ── Brand logo draw + sway ─────────────────────────────── */
const brandLogo  = document.getElementById('brand-logo');
const logoTagline = document.getElementById('logo-tagline');
if (brandLogo) {
  let logoRevealed = false;
  const revealHeroLogo = () => {
    if (logoRevealed) return;
    logoRevealed = true;
    setTimeout(() => {
      brandLogo.classList.add('drawn');
      if (logoTagline) logoTagline.style.opacity = '1';
    }, 250);
    setTimeout(() => brandLogo.classList.add('swaying'), 2200);
  };
  window.addEventListener('anvira:enter', revealHeroLogo, { once: true });
  // Intro already gone (reduced motion fired the event before this ran)
  if (page.classList.contains('show')) revealHeroLogo();
}

/* ── Stats count-up ─────────────────────────────────────── */
const cObs = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    cObs.unobserve(target);
    const end = +target.dataset.count, sfx = target.dataset.sfx;
    let t0 = null;
    const tick = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / 2400, 1);
      target.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * end) + sfx;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.sn').forEach(el => cObs.observe(el));

/* ── Accordion — image cycling, click/tap → detail ─────── */
const accord = document.getElementById('accordion');
let activeIdx = null;

PROPERTIES.forEach((p, i) => {
  const col     = document.createElement('div');
  col.className = 'acol'; col.setAttribute('data-cursor', '');

  const cyclePics = p.images.slice(0, 6);
  const imgsHTML  = cyclePics.map((url, j) =>
    `<img class="acol-img${j === 0 ? ' active' : ''}" src="${img(url)}" alt="${p.name}" loading="${j === 0 ? 'eager' : 'lazy'}" />`
  ).join('');
  const dotsHTML = cyclePics.map((_, j) =>
    `<span class="acol-dot${j === 0 ? ' on' : ''}"></span>`
  ).join('');
  const num = String(i + 1).padStart(2, '0');

  col.innerHTML = `
    <div class="acol-imgs">${imgsHTML}</div>
    <div class="acol-g"></div>
    <div class="acol-num">${num}</div>
    <div class="acol-counter">1 / ${cyclePics.length}</div>
    <div class="acol-info">
      <div class="acol-type">${p.tag}</div>
      <div class="acol-name">${p.name}</div>
      <div class="acol-loc">${p.loc}</div>
      <div class="acol-bar"></div>
      <div class="acol-hint">${isTouchDevice ? 'Tap to view' : 'Click to explore'}</div>
    </div>
    <div class="acol-dots">${dotsHTML}</div>
    <div class="acol-vert">${p.name}</div>`;

  const imgs    = col.querySelectorAll('.acol-img');
  const dots    = col.querySelectorAll('.acol-dot');
  const counter = col.querySelector('.acol-counter');
  let cycleIdx = 0, timer = null;

  function updateCycleUI() {
    dots.forEach((d, di) => d.classList.toggle('on', di === cycleIdx));
    if (counter) counter.textContent = `${cycleIdx + 1} / ${imgs.length}`;
  }

  function startCycle() {
    if (timer) return;
    timer = setInterval(() => {
      imgs[cycleIdx].classList.remove('active');
      cycleIdx = (cycleIdx + 1) % imgs.length;
      imgs[cycleIdx].classList.add('active');
      updateCycleUI();
    }, 1800);
  }

  function stopCycle() {
    clearInterval(timer); timer = null;
  }

  function resetToFirst() {
    setTimeout(() => {
      imgs[cycleIdx].classList.remove('active');
      cycleIdx = 0;
      imgs[0].classList.add('active');
      updateCycleUI();
    }, 650);
  }

  if (isTouchDevice) {
    /* On touch: auto-cycle while card is in viewport */
    const vObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) startCycle();
        else { stopCycle(); resetToFirst(); }
      });
    }, { threshold: 0.45 });
    vObs.observe(col);
  } else {
    col.addEventListener('mouseenter', () => {
      activeIdx = i; redraw();
      startCycle();
    });
    col.addEventListener('mouseleave', () => {
      stopCycle();
      activeIdx = null; redraw();
      resetToFirst();
    });
  }

  col.addEventListener('click', () => { location.href = ASSET_BASE + 'estates/' + p.id + '.html'; });
  accord.appendChild(col);
});

function redraw() {
  if (isTouchDevice) return;
  accord.querySelectorAll('.acol').forEach((col, i) => {
    col.style.flexGrow = activeIdx === null ? '1' : i === activeIdx ? '5.5' : '0.22';
  });
  accord.querySelectorAll('.acol-vert').forEach((v, i) => {
    v.style.opacity = activeIdx === null ? '0.22'
      : i === activeIdx ? '0'
      : '0.5';
  });
}

/* ── Property cards — click → detail ───────────────────── */
const grid = document.getElementById('cards-grid');
PROPERTIES.forEach(p => {
  const el = document.createElement('div');
  el.className = 'prop-card'; el.setAttribute('data-cursor', '');
  el.innerHTML = `
    <div class="ci-wrap"><img class="ci" src="${img(p.card)}" alt="${p.name}" loading="lazy" /></div>
    <div class="ctag">${p.tag}</div>
    <div class="crow">
      <div><div class="cname">${p.name}</div><div class="cloc">${p.loc}</div></div>
      <div class="cprice">${p.price}</div>
    </div>
    <div class="cdesc">${p.desc}</div>
    <div class="cfoot">
      <div class="cm"><div class="cm-n">${p.rooms}</div><div class="cm-l">Rooms</div></div>
      <div class="cm"><div class="cm-n">${p.guests}</div><div class="cm-l">Guests</div></div>
      <div class="cm"><div class="cm-n">${p.baths}</div><div class="cm-l">Baths</div></div>
      <button class="enq" data-cursor>View Details</button>
    </div>`;
  el.addEventListener('click', () => { location.href = ASSET_BASE + 'estates/' + p.id + '.html'; });
  grid.appendChild(el);
});

/* ── Property card tilt (desktop only) ──────────────────── */
if (!isTouchDevice) {
  document.querySelectorAll('.prop-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -3.5;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 3.5;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Testimonials carousel ──────────────────────────────── */
const track     = document.getElementById('testi-track');
const progBar   = document.getElementById('testi-prog-bar');
const tPrev     = document.getElementById('testi-prev');
const tNext     = document.getElementById('testi-next');

/* Property display names for homepage cards */
const PROP_DISPLAY = {
  'villa-anvira':      'Villa AnVira, Chail',
  'estate-10':         'Estate 10, New Delhi',
  'tarikas-seascapes': "Tarika's Seascapes, Goa",
};

function initTeCarousel() {
  if (!track) return;
  const cards = track.querySelectorAll('.testi-card');
  const total = cards.length;
  if (!total) return;
  let tIdx   = 0;
  let tTimer = null;

  function teScrollTo(i) {
    tIdx = (i + total) % total;
    const card  = cards[tIdx];
    const wrap  = track.parentElement;
    const wrapL = wrap.getBoundingClientRect().left;
    const cardL = card.getBoundingClientRect().left;
    const scroll = wrap.scrollLeft + (cardL - wrapL) - parseFloat(getComputedStyle(track).paddingLeft || 24);
    wrap.scrollTo({ left: scroll, behavior: 'smooth' });
    if (progBar) progBar.style.width = `${((tIdx + 1) / total) * 100}%`;
  }

  function teStart() { tTimer = setInterval(() => teScrollTo(tIdx + 1), 5000); }
  function teStop()  { clearInterval(tTimer); tTimer = null; }

  if (tPrev) tPrev.addEventListener('click', () => { teStop(); teScrollTo(tIdx - 1); teStart(); });
  if (tNext) tNext.addEventListener('click', () => { teStop(); teScrollTo(tIdx + 1); teStart(); });

  let tTouchX = null;
  track.addEventListener('touchstart', e => { tTouchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (tTouchX === null) return;
    const dx = e.changedTouches[0].clientX - tTouchX;
    if (Math.abs(dx) > 44) { teStop(); teScrollTo(dx < 0 ? tIdx + 1 : tIdx - 1); teStart(); }
    tTouchX = null;
  });

  if (progBar) progBar.style.width = `${(1 / total) * 100}%`;
  teStart();
  track.addEventListener('mouseenter', teStop);
  track.addEventListener('mouseleave', teStart);
}

/* Fetch approved reviews from Sheet, inject into carousel, then init */
if (track) {
  fetch(API_ENDPOINT + '?action=reviews')
    .then(r => r.json())
    .then(json => {
      if (!json.success || !json.data) return;
      /* Flatten all estates' approved reviews into one list */
      const all = Object.entries(json.data).flatMap(([estateId, reviews]) =>
        reviews.map(r => ({ ...r, estateId }))
      );
      if (!all.length) return;
      track.innerHTML = all.map(r => {
        const propLabel = PROP_DISPLAY[r.estateId] || r.prop || r.estateId;
        return `<div class="testi-card">
          <div class="testi-stars">${'<span class="testi-star">&#9733;</span>'.repeat(Math.min(5, r.stars))}</div>
          <p class="testi-text">“${r.text}”</p>
          <div class="testi-name">${r.name}</div>
          <div class="testi-prop">${propLabel}</div>
          ${r.occ ? `<div class="testi-occ">${r.occ}</div>` : ''}
        </div>`;
      }).join('');
    })
    .catch(() => { /* keep hardcoded cards on any error */ })
    .finally(() => initTeCarousel());
}

/* ── CTA buttons → WhatsApp ─────────────────────────────── */
const WA_BASE = `https://wa.me/${WA_NUMBER}?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20an%20AnVira%20estate.`;
document.querySelectorAll('.cta, button.ghost').forEach(btn => {
  btn.addEventListener('click', () => {
    window.open(WA_BASE, '_blank', 'noopener,noreferrer');
  });
});
