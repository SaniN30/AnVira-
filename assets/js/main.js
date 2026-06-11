  (() => {
    'use strict';

    const isTouchDevice = window.matchMedia('(hover: none)').matches;


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
      // Wait for the logo to be fully decoded so it never pops in,
      // but never hold the page hostage if the image stalls.
      const logoReady = introLogo.decode
        ? introLogo.decode().catch(() => {})
        : Promise.resolve();
      Promise.race([logoReady, new Promise(r => setTimeout(r, 1200))]).then(() => {
        requestAnimationFrame(() => {
          introLogo.classList.add('show');
          iLine.classList.add('full');
        });
        introTimer = setTimeout(() => endIntro(false), 2400);
      });
      introEl.addEventListener('click', () => endIntro(true));
      window.addEventListener('keydown', function skipOnce(e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          endIntro(true);
          window.removeEventListener('keydown', skipOnce);
        }
      });
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
        `<img class="acol-img${j === 0 ? ' active' : ''}" src="${url}" alt="${p.name}" loading="${j === 0 ? 'eager' : 'lazy'}" />`
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

      col.addEventListener('click', () => openDetail(p));
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
        <div class="ci-wrap"><img class="ci" src="${p.card}" alt="${p.name}" loading="lazy" /></div>
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
      el.addEventListener('click', () => openDetail(p));
      grid.appendChild(el);
    });

    /* ── Detail overlay ─────────────────────────────────────── */
    const detail = document.getElementById('detail');
    const pdBack = document.getElementById('pd-back');
    let currentProp = null;


    const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    function renderAvailability(p) {
      const grid = document.getElementById('pd-avail-grid');
      const now  = new Date();
      const overrides = AVAILABILITY[p.id] || {};
      grid.innerHTML = '';
      for (let k = 0; k < 6; k++) {
        const d  = new Date(now.getFullYear(), now.getMonth() + k, 1);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const status = overrides[ym] || 'available';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `avail-month ${status}`;
        btn.setAttribute('data-cursor', '');
        btn.textContent = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
        btn.disabled = status === 'booked';
        btn.setAttribute('aria-label', `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()} — ${status}`);
        if (status !== 'booked') {
          btn.addEventListener('click', () => {
            /* pre-fill booking widget with the 1st of the month (or today) */
            const start = k === 0 ? now : d;
            const inEl  = document.getElementById('bw-in');
            const outEl = document.getElementById('bw-out');
            inEl.value = toISO(start);
            const end = new Date(start); end.setDate(end.getDate() + 2);
            outEl.value = toISO(end);
            document.getElementById('bw')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
        grid.appendChild(btn);
      }
    }

    function toISO(dt) {
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    }

    function openDetail(p) {
      currentProp = p;
      renderAvailability(p);
      const guestsEl = document.getElementById('bw-guests');
      guestsEl.max = p.guests;
      if (+guestsEl.value > p.guests) guestsEl.value = Math.min(2, p.guests);
      document.getElementById('bw-err').textContent = '';
      document.getElementById('bw-in').min = toISO(new Date());
      document.getElementById('bw-out').min = toISO(new Date());
      document.getElementById('pd-hero-img').src          = p.images[0];
      document.getElementById('pd-hero-img').alt          = p.name;
      document.getElementById('pd-hero-tag').textContent  = p.tag;
      document.getElementById('pd-hero-name').textContent = p.name;
      document.getElementById('pd-hero-loc').innerHTML    =
        `<a href="${p.mapUrl}" target="_blank" rel="noopener noreferrer" data-cursor>
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
           ${p.loc}
         </a>`;
      const descEl = document.getElementById('pd-desc-text');
      const paragraphs = (p.fullDesc || p.desc).split('\n\n');
      descEl.innerHTML = paragraphs.map(para => {
        if (para.includes('\n')) {
          const lines = para.split('\n').filter(l => l.trim());
          return `<ul>${lines.map(l => `<li>${l}</li>`).join('')}</ul>`;
        }
        return `<p>${para}</p>`;
      }).join('');
      document.getElementById('pd-spec-rooms').textContent  = p.rooms;
      document.getElementById('pd-spec-guests').textContent = p.guests;
      document.getElementById('pd-spec-baths').textContent  = p.baths;

      document.getElementById('pd-amenities-list').innerHTML =
        p.amenities.map(a => `<span class="pd-amen-tag">${a}</span>`).join('');

      document.getElementById('pd-address').innerHTML =
        p.address.replace(/\n/g, '<br>');
      const mapLink = document.getElementById('pd-map-link');
      mapLink.href = p.mapUrl;

      const galEl = document.getElementById('pd-gallery');
      galEl.innerHTML = p.images.map((url, idx) =>
        `<img src="${url}" alt="${p.name}" loading="${idx < 4 ? 'eager' : 'lazy'}" data-idx="${idx}" />`
      ).join('');
      galEl.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', () => openLb(p.images, +img.dataset.idx, p.name));
      });

      detail.classList.add('open');
      document.body.classList.add('detail-open');
      detail.scrollTop = 0;
      document.body.style.overflow = 'hidden';
    }

    function closeDetail() {
      detail.classList.remove('open');
      document.body.classList.remove('detail-open');
      document.body.style.overflow = '';
    }

    pdBack.addEventListener('click', closeDetail);
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      /* lightbox and preview card have their own Escape handling */
      if (document.getElementById('lb').classList.contains('open')) return;
      if (document.getElementById('mpc-wrap').classList.contains('open')) return;
      closeDetail();
    });

    /* ── Scroll fade-ins ─────────────────────────────────────── */
    const fObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); fObs.unobserve(e.target); } });
    }, { threshold: 0.07 });
    document.querySelectorAll('.fi').forEach(el => fObs.observe(el));

    /* ── Lightbox ────────────────────────────────────────────── */
    const lb      = document.getElementById('lb');
    const lbImg   = document.getElementById('lb-img');
    const lbCtr   = document.getElementById('lb-counter');
    const lbDots  = document.getElementById('lb-dots');
    const lbClose = document.getElementById('lb-close');
    const lbPrev  = document.getElementById('lb-prev');
    const lbNext  = document.getElementById('lb-next');
    let lbImages = [], lbIdx = 0, lbName = '';

    function buildLbDots() {
      const count = Math.min(lbImages.length, 12);
      lbDots.innerHTML = lbImages.slice(0, count).map((_, i) =>
        `<span class="lb-dot${i === lbIdx ? ' on' : ''}"></span>`
      ).join('');
      lbDots.style.display = lbImages.length <= 1 ? 'none' : '';
    }

    function updateLbUI() {
      lbCtr.textContent = `${lbIdx + 1} / ${lbImages.length}`;
      lbDots.querySelectorAll('.lb-dot').forEach((d, i) =>
        d.classList.toggle('on', i === lbIdx)
      );
    }

    function showLbImg(direction) {
      lbImg.style.opacity = '0';
      lbImg.style.transform = direction === 1 ? 'translateX(18px)' : direction === -1 ? 'translateX(-18px)' : 'none';
      setTimeout(() => {
        lbImg.src = lbImages[lbIdx];
        lbImg.alt = lbName;
        lbImg.style.transition = 'opacity .28s ease, transform .35s var(--lux)';
        lbImg.style.opacity = '1';
        lbImg.style.transform = 'translateX(0)';
        updateLbUI();
      }, 180);
    }

    function openLb(images, idx, name) {
      lbImages = images; lbIdx = idx; lbName = name || '';
      lbImg.style.transition = 'none';
      lbImg.src = lbImages[lbIdx];
      lbImg.alt = lbName;
      buildLbDots();
      updateLbUI();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLb() {
      lb.classList.remove('open');
      document.body.style.overflow = detail.classList.contains('open') ? 'hidden' : '';
    }

    function lbGo(dir) {
      lbIdx = (lbIdx + dir + lbImages.length) % lbImages.length;
      showLbImg(dir);
    }

    lbClose.addEventListener('click', closeLb);
    lbPrev.addEventListener('click', () => lbGo(-1));
    lbNext.addEventListener('click', () => lbGo(1));

    lb.addEventListener('click', e => {
      if (e.target === lb) closeLb();
    });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'ArrowLeft')  lbGo(-1);
      if (e.key === 'ArrowRight') lbGo(1);
      if (e.key === 'Escape') closeLb();
    });

    /* Touch swipe for lightbox */
    let lbTouchX = null;
    lb.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (lbTouchX === null) return;
      const dx = e.changedTouches[0].clientX - lbTouchX;
      if (Math.abs(dx) > 48) lbGo(dx < 0 ? 1 : -1);
      lbTouchX = null;
    });

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

    /* ── Scroll progress bar ────────────────────────────────── */
    const progEl = document.getElementById('scroll-progress');
    if (progEl) {
      window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        progEl.style.width = max > 0 ? `${(h.scrollTop / max) * 100}%` : '0';
      }, { passive: true });
    }

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

    /* ── Scroll indicator hide-on-scroll ────────────────────── */
    const scrollInd = document.getElementById('scroll-ind');
    if (scrollInd) {
      let siGone = false;
      window.addEventListener('scroll', () => {
        if (!siGone && window.scrollY > 80) { scrollInd.classList.add('gone'); siGone = true; }
      }, { passive: true });
    }

    /* ── Floating WhatsApp — show after hero leaves viewport ── */
    const floatWa   = document.getElementById('float-wa');
    const stickyBk  = document.getElementById('sticky-book');
    const heroEl    = document.getElementById('hero');
    if (floatWa && heroEl) {
      const waObs = new IntersectionObserver(entries => {
        const leaving = !entries[0].isIntersecting;
        floatWa.classList.toggle('show', leaving);
        if (stickyBk) stickyBk.classList.toggle('show', leaving);
      }, { threshold: 0.15 });
      waObs.observe(heroEl);
    }

    /* ── Testimonials carousel ──────────────────────────────── */
    const track     = document.getElementById('testi-track');
    const progBar   = document.getElementById('testi-prog-bar');
    const tPrev     = document.getElementById('testi-prev');
    const tNext     = document.getElementById('testi-next');
    if (track) {
      const cards   = track.querySelectorAll('.testi-card');
      const total   = cards.length;
      let   tIdx    = 0;
      let   tTimer  = null;

      function teScrollTo(i) {
        tIdx = (i + total) % total;
        const card   = cards[tIdx];
        const wrap   = track.parentElement;
        const wrapL  = wrap.getBoundingClientRect().left;
        const cardL  = card.getBoundingClientRect().left;
        const scroll = track.parentElement.scrollLeft + (cardL - wrapL) - parseFloat(getComputedStyle(track).paddingLeft || 24);
        track.parentElement.scrollTo({ left: scroll, behavior: 'smooth' });
        if (progBar) progBar.style.width = `${((tIdx + 1) / total) * 100}%`;
      }

      function teStart() { tTimer = setInterval(() => teScrollTo(tIdx + 1), 5000); }
      function teStop()  { clearInterval(tTimer); tTimer = null; }

      if (tPrev) tPrev.addEventListener('click', () => { teStop(); teScrollTo(tIdx - 1); teStart(); });
      if (tNext) tNext.addEventListener('click', () => { teStop(); teScrollTo(tIdx + 1); teStart(); });

      /* swipe on the track */
      let tTouchX = null;
      track.addEventListener('touchstart', e => { tTouchX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', e => {
        if (tTouchX === null) return;
        const dx = e.changedTouches[0].clientX - tTouchX;
        if (Math.abs(dx) > 44) { teStop(); teScrollTo(dx < 0 ? tIdx + 1 : tIdx - 1); teStart(); }
        tTouchX = null;
      });

      /* init progress bar + auto-advance */
      if (progBar) progBar.style.width = `${(1 / total) * 100}%`;
      teStart();

      /* pause on hover */
      track.addEventListener('mouseenter', teStop);
      track.addEventListener('mouseleave', teStart);
    }

    /* ── CTA buttons → WhatsApp ─────────────────────────────── */
    const WA_BASE = `https://wa.me/${WA_NUMBER}?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20an%20AnVira%20estate.`;
    document.querySelectorAll('.cta, button.ghost').forEach(btn => {
      btn.addEventListener('click', () => {
        if (detail.classList.contains('open')) return; /* detail page has its own CTA */
        window.open(WA_BASE, '_blank', 'noopener,noreferrer');
      });
    });
    /* ── Booking widget → Message Preview Card ──────────────── */
    const bwForm   = document.getElementById('bw');
    const mpcWrap  = document.getElementById('mpc-wrap');
    const mpcName  = document.getElementById('mpc-name');
    const mpcNote  = document.getElementById('mpc-note');
    const mpcPrev  = document.getElementById('mpc-preview');
    let enquiry = null;

    function fmtDate(iso) {
      const [y, m, d] = iso.split('-').map(Number);
      return `${String(d).padStart(2, '0')} ${MONTH_NAMES[m - 1]} ${y}`;
    }

    function buildMessage() {
      if (!enquiry) return '';
      const lines = [
        `Hello AnVira, I'd like to enquire about ${enquiry.prop}.`,
        `Check-in: ${fmtDate(enquiry.checkin)}`,
        `Check-out: ${fmtDate(enquiry.checkout)}`,
        `Nights: ${enquiry.nights}`,
        `Guests: ${enquiry.guests}`,
        `Name: ${mpcName.value.trim() || '—'}`,
      ];
      const note = mpcNote.value.trim();
      if (note) lines.push(`Note: ${note}`);
      return lines.join('\n');
    }

    function refreshPreview() { mpcPrev.textContent = buildMessage(); }
    mpcName.addEventListener('input', refreshPreview);
    mpcNote.addEventListener('input', refreshPreview);

    function openMpc() {
      document.getElementById('mpc-prop').textContent   = enquiry.prop;
      document.getElementById('mpc-in').textContent     = fmtDate(enquiry.checkin);
      document.getElementById('mpc-out').textContent    = fmtDate(enquiry.checkout);
      document.getElementById('mpc-nights').textContent = enquiry.nights;
      document.getElementById('mpc-guests').textContent = enquiry.guests;
      mpcName.value = enquiry.name;
      refreshPreview();
      mpcWrap.classList.add('open');
      mpcName.focus();
    }

    function closeMpc() { mpcWrap.classList.remove('open'); }

    bwForm.addEventListener('submit', e => {
      e.preventDefault();
      e.stopPropagation();
      const errEl   = document.getElementById('bw-err');
      const checkin  = document.getElementById('bw-in').value;
      const checkout = document.getElementById('bw-out').value;
      const guests   = +document.getElementById('bw-guests').value;
      const name     = document.getElementById('bw-name').value.trim();
      const cap      = currentProp ? currentProp.guests : 99;

      const today = toISO(new Date());
      let err = '';
      if (!checkin || !checkout)            err = 'Please select check-in and check-out dates.';
      else if (checkin < today)             err = 'Check-in cannot be in the past.';
      else if (checkout <= checkin)         err = 'Check-out must be after check-in.';
      else if (!guests || guests < 1)       err = 'Please enter the number of guests.';
      else if (guests > cap)                err = `This estate hosts up to ${cap} guests.`;
      else if (!name)                       err = 'Please tell us your name.';
      errEl.textContent = err;
      if (err) return;

      const nights = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
      enquiry = { prop: currentProp ? currentProp.name : 'an AnVira estate', checkin, checkout, nights, guests, name };
      openMpc();
    });

    document.getElementById('mpc-send').addEventListener('click', () => {
      const msg = encodeURIComponent(buildMessage());
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
      closeMpc();
    });
    document.getElementById('mpc-cancel').addEventListener('click', closeMpc);
    mpcWrap.addEventListener('click', e => { if (e.target === mpcWrap) closeMpc(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mpcWrap.classList.contains('open')) closeMpc(); });

  })();
