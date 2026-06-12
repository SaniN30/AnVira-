/* ── AnVira — listing.js — /estates/ filter + "Notify me" waitlist ── */
'use strict';

/* ── Location / capacity filter ─────────────────────────────────
   Cards carry data-region and data-guests; coming-soon cards carry
   data-region only and are hidden when a capacity filter is active. */
(function initFilter() {
  const bar = document.getElementById('est-filter');
  if (!bar) return;
  const cards = [...document.querySelectorAll('#est-cards .prop-card')];
  const empty = document.getElementById('est-empty');
  let region = 'all', guests = 0;

  function apply() {
    let shown = 0;
    cards.forEach(c => {
      const okRegion = region === 'all' || c.dataset.region === region;
      const cap = +c.dataset.guests || 0;
      const okGuests = !guests || cap >= guests;
      const show = okRegion && okGuests;
      c.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    if (empty) empty.style.display = shown ? 'none' : '';
  }

  bar.querySelectorAll('.est-pill[data-region]').forEach(btn => {
    btn.addEventListener('click', () => {
      region = btn.dataset.region;
      bar.querySelectorAll('.est-pill[data-region]').forEach(b => b.classList.toggle('on', b === btn));
      apply();
    });
  });
  const sel = document.getElementById('est-guests');
  if (sel) sel.addEventListener('change', () => { guests = +sel.value || 0; apply(); });
})();

/* ── Waitlist modal ─────────────────────────────────────────── */
(function initWaitlist() {
  const wrap = document.getElementById('wl-wrap');
  if (!wrap) return;
  const form    = document.getElementById('wl-form');
  const nameEl  = document.getElementById('wl-name');
  const waEl    = document.getElementById('wl-wa');
  const consent = document.getElementById('wl-consent');
  const errEl   = document.getElementById('wl-err');
  const sendBtn = document.getElementById('wl-send');
  const doneEl  = document.getElementById('wl-done');
  let estate = '';

  function open(id, label) {
    estate = id;
    document.getElementById('wl-estate').textContent = label;
    form.style.display = '';
    doneEl.style.display = 'none';
    errEl.textContent = '';
    wrap.classList.add('open');
    nameEl.focus();
  }
  function close() { wrap.classList.remove('open'); }

  document.querySelectorAll('[data-waitlist]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      open(btn.dataset.waitlist, btn.dataset.waitlistName || 'this estate');
    });
  });
  document.getElementById('wl-cancel').addEventListener('click', close);
  wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open')) close(); });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = nameEl.value.trim();
    const wa   = waEl.value.replace(/\D/g, '').slice(-10);
    let err = '';
    if (name.length < 2)            err = 'Please tell us your name.';
    else if (!/^[6-9]\d{9}$/.test(wa)) err = 'Please enter a valid 10-digit mobile number.';
    else if (!consent.checked)      err = 'Please confirm we may message you on WhatsApp.';
    errEl.textContent = err;
    if (err) return;

    /* No endpoint configured yet → fall back to a pre-filled WhatsApp message
       so no lead is ever lost. */
    if (!API_ENDPOINT) {
      const msg = encodeURIComponent(`Hello AnVira, please notify me when ${document.getElementById('wl-estate').textContent} opens. — ${name}`);
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
      form.style.display = 'none';
      doneEl.style.display = '';
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Joining…';
    try {
      const res  = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ type: 'waitlist', estate, name, whatsapp: wa, consent: true }),
      });
      const data = await res.json();
      if (!data.success) { errEl.textContent = data.error || 'Something went wrong. Please try again.'; return; }
      form.style.display = 'none';
      doneEl.style.display = '';
    } catch {
      errEl.textContent = 'Network error. Please check your connection and try again.';
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Notify me';
    }
  });
})();
