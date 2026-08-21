/* ── AnVira — intro.js — page-load wordmark intro, skippable ── */
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
