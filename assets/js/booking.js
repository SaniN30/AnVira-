/* ── AnVira — booking.js — availability calendar, booking widget, Message Preview Card ── */
'use strict';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW_SHORT   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

let calOffset = 0;      /* months from today shown as first calendar month */
let calPickIn  = null;  /* Date — check-in selected, waiting for check-out  */

function renderAvailability(p) {
  const container = document.getElementById('pd-avail-grid');
  if (!container) return;

  const overrides = AVAILABILITY[p.id] || {};
  const today     = new Date(); today.setHours(0,0,0,0);

  /* All rendered day cells across both visible months, keyed by ISO date */
  const cellMap = {};

  /* ── Commit a finalised range to the booking inputs ── */
  function commitRange(start, end) {
    const inEl  = document.getElementById('bw-in');
    const outEl = document.getElementById('bw-out');
    inEl.value  = toISO(start);
    outEl.value = toISO(end);
    [inEl, outEl].forEach(el => {
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    });
  }

  /* ── Apply range highlight classes to every rendered cell ── */
  function paintRange(start, end) {
    const s = start ? start.getTime() : null;
    const e = end   ? end.getTime()   : null;
    Object.entries(cellMap).forEach(([iso, cell]) => {
      const t = new Date(iso).getTime();
      cell.classList.remove('cal-start', 'cal-end', 'cal-in-range', 'cal-hover-range');
      if (s && t === s)           cell.classList.add('cal-start');
      if (e && t === e)           cell.classList.add('cal-end');
      if (s && e && t > s && t < e) cell.classList.add('cal-in-range');
    });
  }

  /* ── Update the status bar text ── */
  function setStatus(msg) {
    const bar = container.querySelector('.avail-cal-status');
    if (bar) bar.textContent = msg;
  }

  /* ── Handle a day click ── */
  function onDayClick(dt) {
    if (!calPickIn) {
      /* First click — set check-in */
      calPickIn = dt;
      paintRange(calPickIn, null);
      setStatus(`Check-in: ${fmtDate(toISO(dt))}  —  now select check-out`);
    } else if (dt <= calPickIn) {
      /* Clicked same day or earlier — restart */
      calPickIn = dt;
      paintRange(calPickIn, null);
      setStatus(`Check-in: ${fmtDate(toISO(dt))}  —  now select check-out`);
    } else {
      /* Second click — set check-out */
      commitRange(calPickIn, dt);
      paintRange(calPickIn, dt);
      setStatus(`Check-in: ${fmtDate(toISO(calPickIn))}  ·  Check-out: ${fmtDate(toISO(dt))}`);
      calPickIn = null; /* reset for next selection */
    }
  }

  /* ── Hover preview while waiting for check-out ── */
  function onDayHover(dt) {
    if (!calPickIn || dt <= calPickIn) return;
    Object.entries(cellMap).forEach(([iso, cell]) => {
      const t = new Date(iso).getTime();
      cell.classList.toggle('cal-hover-range', t > calPickIn.getTime() && t < dt.getTime());
    });
  }

  function buildCalendar() {
    container.innerHTML = '';
    Object.keys(cellMap).forEach(k => delete cellMap[k]); /* clear map */

    const wrap = document.createElement('div');
    wrap.className = 'avail-cal-wrap';

    /* ── Nav row ── */
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

    /* ── Status bar ── */
    const statusBar = document.createElement('div');
    statusBar.className = 'avail-cal-status';
    statusBar.textContent = calPickIn
      ? `Check-in: ${fmtDate(toISO(calPickIn))}  —  now select check-out`
      : 'Select your check-in date';
    wrap.appendChild(statusBar);

    /* ── Month grids ── */
    const months = document.createElement('div');
    months.className = 'avail-cal-months';

    for (let k = 0; k < 2; k++) {
      const base       = new Date(today.getFullYear(), today.getMonth() + calOffset + k, 1);
      const yr         = base.getFullYear();
      const mo         = base.getMonth();
      const ym         = `${yr}-${String(mo + 1).padStart(2, '0')}`;
      const status     = overrides[ym] || 'available';
      const daysInMonth = new Date(yr, mo + 1, 0).getDate();
      const startDow   = base.getDay();

      const col = document.createElement('div');
      col.className = 'avail-cal-month';

      const title = document.createElement('div');
      title.className = 'avail-cal-month-title';
      title.textContent = `${MONTH_FULL[mo]} ${yr}`;
      col.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'avail-cal-grid';

      DOW_SHORT.forEach(d => {
        const hdr = document.createElement('div');
        hdr.className = 'avail-cal-dow'; hdr.textContent = d;
        grid.appendChild(hdr);
      });

      for (let i = 0; i < startDow; i++) {
        const empty = document.createElement('div');
        empty.className = 'avail-cal-day empty';
        grid.appendChild(empty);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dt    = new Date(yr, mo, day);
        const iso   = toISO(dt);
        const isPast   = dt < today;
        const isToday  = dt.getTime() === today.getTime();
        const isBooked = !isPast && status === 'booked';

        let cls = 'avail-cal-day';
        if (isPast)       cls += ' past';
        else if (isBooked) cls += ' booked';
        else               cls += ` ${status}`;
        if (isToday) cls += ' today';

        const cell = document.createElement('div');
        cell.className = cls;
        cell.textContent = day;
        cell.setAttribute('aria-label', `${day} ${MONTH_NAMES[mo]} ${yr} — ${isPast ? 'past' : status}`);

        if (!isPast && !isBooked) {
          cell.setAttribute('tabindex', '0');
          cell.setAttribute('role', 'button');
          cell.addEventListener('click',      () => onDayClick(dt));
          cell.addEventListener('mouseenter', () => onDayHover(dt));
          cell.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDayClick(dt); }
          });
          cellMap[iso] = cell;
        }

        grid.appendChild(cell);
      }

      col.appendChild(grid);
      months.appendChild(col);
    }

    wrap.appendChild(months);
    container.appendChild(wrap);

    /* Restore any existing selection after a nav rebuild */
    const inVal  = document.getElementById('bw-in')?.value;
    const outVal = document.getElementById('bw-out')?.value;
    if (inVal && outVal) paintRange(new Date(inVal), new Date(outVal));
    else if (calPickIn)  paintRange(calPickIn, null);
  }

  buildCalendar();
}

let currentProp = null;

/* Estate pages call this once their data object is resolved. */
function initBooking(p) {
  currentProp = p;

  /* ── Live availability fetch — merges Sheet data over hardcoded fallback ── */
  fetch(API_ENDPOINT + '?action=availability')
    .then(r => r.json())
    .then(json => {
      if (json.success && json.data && json.data[p.id]) {
        Object.assign(AVAILABILITY[p.id] = AVAILABILITY[p.id] || {}, json.data[p.id]);
      }
    })
    .catch(() => { /* silently fall back to hardcoded AVAILABILITY */ })
    .finally(() => renderAvailability(p));

  /* Render immediately from hardcoded data, then patch if fetch succeeds */
  renderAvailability(p);

  /* Parse base (included) vs max (chargeable above base) guests.
     p.guests can be '14 / 20' (base / max) or a plain number. */
  const baseGuests = typeof p.guests === 'string'
    ? parseInt(p.guests.split('/')[0].trim(), 10)
    : p.maxGuests;

  /* Replace <input type="number"> with a <select> so we can label
     chargeable tiers directly inside the dropdown options. */
  const numInput = document.getElementById('bw-guests');
  const sel = document.createElement('select');
  sel.id        = 'bw-guests';
  sel.name      = 'guests';
  sel.className = 'bw-input';
  sel.required  = true;
  for (let i = 1; i <= p.maxGuests; i++) {
    const opt = document.createElement('option');
    opt.value       = i;
    opt.textContent = i > baseGuests
      ? `${i} guests  (+  chargeable)`
      : `${i} guest${i > 1 ? 's' : ''}`;
    if (i === 2) opt.selected = true;
    sel.appendChild(opt);
  }
  numInput.replaceWith(sel);

  /* Chargeable note below the guests field */
  const guestsField = sel.closest('.bw-field');
  if (guestsField && !guestsField.querySelector('.bw-charge-note')) {
    const note = document.createElement('p');
    note.className = 'bw-charge-note';
    note.innerHTML = `<span class="bw-charge-asterisk">*</span> Up to <strong>${baseGuests}</strong> guests included. Additional guests above this limit are chargeable — mention in your note.`;
    guestsField.appendChild(note);
  }

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

  /* ── Post-send confirmation state ── */
  const mpcEl = document.getElementById('mpc');
  mpcEl.classList.add('mpc-sent');
  const confirm = document.createElement('div');
  confirm.className = 'mpc-confirm';
  confirm.innerHTML = '<span class="mpc-confirm-icon">✓</span><p>Enquiry sent!</p><p class="mpc-confirm-sub">We\'ll reply on WhatsApp within 2 hours.</p>';
  mpcEl.appendChild(confirm);
  setTimeout(() => {
    mpcEl.classList.remove('mpc-sent');
    mpcEl.removeChild(confirm);
    closeMpc();
  }, 2500);
});
document.getElementById('mpc-cancel').addEventListener('click', closeMpc);
mpcWrap.addEventListener('click', e => { if (e.target === mpcWrap) closeMpc(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && mpcWrap.classList.contains('open')) closeMpc(); });

