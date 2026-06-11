/* ── AnVira — gallery.js — image lightbox ── */
'use strict';

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
  document.body.style.overflow = '';
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

