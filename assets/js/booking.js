/* ── AnVira — booking.js — availability calendar, booking widget, Message Preview Card ── */
'use strict';

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
        /* brief brass flash confirms the dates landed in the widget */
        [inEl, outEl].forEach(el => {
          el.classList.remove('flash');
          void el.offsetWidth; /* restart the animation on repeat clicks */
          el.classList.add('flash');
        });
        document.getElementById('bw')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
    grid.appendChild(btn);
  }
}

let currentProp = null;

/* Estate pages call this once their data object is resolved. */
function initBooking(p) {
  currentProp = p;
  renderAvailability(p);
  const guestsEl = document.getElementById('bw-guests');
  guestsEl.max = p.maxGuests;
  if (+guestsEl.value > p.maxGuests) guestsEl.value = Math.min(2, p.maxGuests);
  document.getElementById('bw-in').min  = toISO(new Date());
  document.getElementById('bw-out').min = toISO(new Date());
}

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
  const cap      = currentProp ? currentProp.maxGuests : 99;

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
  /* Log to the owner's sheet in the background — WhatsApp opens regardless. */
  logToSheet('enquiry', {
    property: enquiry.prop,
    checkIn: enquiry.checkin,
    checkOut: enquiry.checkout,
    guests: enquiry.guests,
    name: mpcName.value.trim() || enquiry.name,
    note: mpcNote.value.trim(),
  });
  const msg = encodeURIComponent(buildMessage());
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
  closeMpc();
});
document.getElementById('mpc-cancel').addEventListener('click', closeMpc);
mpcWrap.addEventListener('click', e => { if (e.target === mpcWrap) closeMpc(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && mpcWrap.classList.contains('open')) closeMpc(); });

