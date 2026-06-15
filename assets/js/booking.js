/* ── AnVira — booking.js — availability calendar, booking widget, Message Preview Card ── */
'use strict';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW_SHORT   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

let calOffset = 0; /* months from today shown as first calendar month */

function prefilDate(dateObj) {
  const inEl  = document.getElementById('bw-in');
  const outEl = document.getElementById('bw-out');
  inEl.value  = toISO(dateObj);
  const end   = new Date(dateObj); end.setDate(end.getDate() + 2);
  outEl.value = toISO(end);
  [inEl, outEl].forEach(el => {
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  });
  document.getElementById('bw')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderAvailability(p) {
  const container = document.getElementById('pd-avail-grid');
  if (!container) return;

  const overrides = AVAILABILITY[p.id] || {};
  const today     = new Date(); today.setHours(0,0,0,0);

  function buildCalendar() {
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'avail-cal-wrap';

    /* nav row */
    const nav = document.createElement('div');
    nav.className = 'avail-cal-nav';
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button'; prevBtn.className = 'avail-cal-nav-btn';
    prevBtn.textContent = '‹ Earlier'; prevBtn.disabled = calOffset <= 0;
    prevBtn.addEventListener('click', () => { calOffset = Math.max(0, calOffset - 2); buildCalendar(); });
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button'; nextBtn.className = 'avail-cal-nav-btn';
    nextBtn.textContent = 'Later ›';
    nextBtn.addEventListener('click', () => { calOffset += 2; buildCalendar(); });
    nav.appendChild(prevBtn); nav.appendChild(nextBtn);
    wrap.appendChild(nav);

    /* months row */
    const months = document.createElement('div');
    months.className = 'avail-cal-months';

    for (let k = 0; k < 2; k++) {
      const base    = new Date(today.getFullYear(), today.getMonth() + calOffset + k, 1);
      const yr      = base.getFullYear();
      const mo      = base.getMonth();
      const ym      = `${yr}-${String(mo + 1).padStart(2, '0')}`;
      const status  = overrides[ym] || 'available';
      const daysInMonth = new Date(yr, mo + 1, 0).getDate();
      const startDow    = base.getDay(); /* 0 = Sun */

      const col = document.createElement('div');
      col.className = 'avail-cal-month';

      const title = document.createElement('div');
      title.className = 'avail-cal-month-title';
      title.textContent = `${MONTH_FULL[mo]} ${yr}`;
      col.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'avail-cal-grid';

      /* day-of-week headers */
      DOW_SHORT.forEach(d => {
        const hdr = document.createElement('div');
        hdr.className = 'avail-cal-dow';
        hdr.textContent = d;
        grid.appendChild(hdr);
      });

      /* empty cells before 1st */
      for (let i = 0; i < startDow; i++) {
        const empty = document.createElement('div'); empty.className = 'avail-cal-day empty'; grid.appendChild(empty);
      }

      /* date cells */
      for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        const dt = new Date(yr, mo, day);
        const isPast = dt < today;
        const isToday = dt.getTime() === today.getTime();
        let cls = 'avail-cal-day';
        if (isPast) { cls += ' past'; }
        else { cls += ` ${status}`; }
        if (isToday) cls += ' today';
        cell.className = cls;
        cell.textContent = day;
        cell.setAttribute('aria-label', `${day} ${MONTH_NAMES[mo]} ${yr} — ${isPast ? 'past' : status}`);
        if (!isPast && status !== 'booked') {
          cell.setAttribute('tabindex', '0');
          cell.setAttribute('role', 'button');
          cell.addEventListener('click', () => prefilDate(dt));
          cell.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); prefilDate(dt); } });
        }
        grid.appendChild(cell);
      }

      col.appendChild(grid);
      months.appendChild(col);
    }

    wrap.appendChild(months);
    container.appendChild(wrap);
  }

  buildCalendar();
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
  mpcRelease = trapFocus(mpcWrap);
  mpcName.focus();
}

let mpcRelease = null;
function closeMpc() {
  mpcWrap.classList.remove('open');
  if (mpcRelease) { mpcRelease(); mpcRelease = null; }
}

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

