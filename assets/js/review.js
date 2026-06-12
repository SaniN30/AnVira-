/* ── AnVira — review.js — /reviews/submit form ── */
'use strict';

(function initReviewForm() {
  const form   = document.getElementById('rv-form');
  if (!form) return;
  const propEl  = document.getElementById('rv-prop');
  const nameEl  = document.getElementById('rv-name');
  const phoneEl = document.getElementById('rv-phone');
  const occEl   = document.getElementById('rv-occ');
  const textEl  = document.getElementById('rv-text');
  const countEl = document.getElementById('rv-count');
  const errEl   = document.getElementById('rv-err');
  const sendBtn = document.getElementById('rv-send');
  const doneEl  = document.getElementById('rv-done');

  /* Pre-select the estate when arriving from an estate page's
     "Write a review" card (?estate=<name, loc>) */
  const fromEstate = new URLSearchParams(location.search).get('estate');
  if (fromEstate && [...propEl.options].some(o => o.value === fromEstate)) {
    propEl.value = fromEstate;
  }

  const words = () => textEl.value.trim().split(/\s+/).filter(Boolean).length;
  textEl.addEventListener('input', () => {
    const n = words();
    countEl.textContent = `${n} / 200 words`;
    countEl.classList.toggle('over', n > 200);
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const rating = +(form.querySelector('input[name="rating"]:checked')?.value || 0);
    const phone  = phoneEl.value.replace(/\D/g, '').slice(-10);
    const n      = words();
    let err = '';
    if (!propEl.value)                      err = 'Please select the estate you stayed at.';
    else if (nameEl.value.trim().length < 2) err = 'Please tell us your name.';
    else if (!/^[6-9]\d{9}$/.test(phone))    err = 'Please enter a valid 10-digit mobile number.';
    else if (!rating)                        err = 'Please choose a rating.';
    else if (n < 5)                          err = 'A few more words, please — at least 5.';
    else if (n > 200)                        err = 'Please trim your review to 200 words.';
    errEl.textContent = err;
    if (err) return;

    const payload = {
      type: 'review',
      property: propEl.value,
      name: nameEl.value.trim(),
      phone,
      occasion: occEl.value,
      rating,
      review: textEl.value.trim(),
    };

    /* No endpoint yet → hand the review over on WhatsApp so it still reaches the owner. */
    if (!API_ENDPOINT) {
      const msg = encodeURIComponent(
        `Hello AnVira, a review of my stay at ${payload.property}:\n` +
        `Rating: ${'★'.repeat(rating)}\nOccasion: ${payload.occasion}\n\n` +
        `${payload.review}\n\n— ${payload.name}`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
      form.style.display = 'none';
      doneEl.style.display = '';
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';
    try {
      const res  = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) { errEl.textContent = data.error || 'Something went wrong. Please try again.'; return; }
      form.style.display = 'none';
      doneEl.style.display = '';
    } catch {
      errEl.textContent = 'Network error. Please check your connection and try again.';
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Submit review';
    }
  });
})();
