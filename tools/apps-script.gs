/* ════════════════════════════════════════════════════════════════
   AnVira — Google Apps Script web-app backend
   One endpoint, three actions, routed by the "type" field:
     enquiry  → "Enquiries" tab   (WhatsApp booking enquiry log)
     waitlist → "Waitlist" tab    ("Notify me" signups, coming-soon estates)
     review   → "Reviews" tab     (post-stay reviews, Phase 3)
   Deploy: see tools/APPS_SCRIPT_SETUP.md
   ════════════════════════════════════════════════════════════════ */

var SHEET_ID = '1sKq1Ctziur_iRWnS10sXctoPXJUQkyeBlemavOzQt6c'; // from the sheet URL: docs.google.com/spreadsheets/d/<THIS>/edit

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var type = String(body.type || '');
    if (type === 'enquiry')  return handleEnquiry(body);
    if (type === 'waitlist') return handleWaitlist(body);
    if (type === 'review')   return handleReview(body);
    return reply(false, 'Unknown type');
  } catch (err) {
    return reply(false, 'Bad request');
  }
}

function handleEnquiry(b) {
  if (!str(b.property) || !str(b.name)) return reply(false, 'property and name are required');
  appendRow('Enquiries', [
    timestamp(), str(b.property), fmtDate(b.checkIn), fmtDate(b.checkOut),
    Number(b.guests) || '', str(b.name), str(b.note), 'New',
  ]);
  return reply(true);
}

function handleWaitlist(b) {
  var wa = str(b.whatsapp).replace(/\D/g, '').slice(-10);
  if (!str(b.estate))            return reply(false, 'estate is required');
  if (str(b.name).length < 2)    return reply(false, 'Please tell us your name.');
  if (!/^[6-9]\d{9}$/.test(wa))  return reply(false, 'Please enter a valid 10-digit mobile number.');
  if (b.consent !== true)        return reply(false, 'Consent is required to join the waitlist.');
  appendRow('Waitlist', [timestamp(), str(b.estate), str(b.name), "+91" + wa, 'Yes']);
  return reply(true);
}

function handleReview(b) {
  var words = str(b.review).split(/\s+/).filter(String).length;
  var rating = Number(b.rating);
  if (str(b.property).length < 2)             return reply(false, 'property is required');
  if (str(b.name).length < 2)                 return reply(false, 'Please tell us your name.');
  if (!(rating >= 1 && rating <= 5))          return reply(false, 'rating must be 1–5');
  if (words < 5 || words > 200)               return reply(false, 'Review must be 5–200 words.');
  appendRow('Reviews', [
    timestamp(), str(b.property), str(b.name), str(b.phone),
    str(b.occasion), rating, str(b.review), 'Pending',
  ]);
  return reply(true);
}

/* ── helpers ───────────────────────────────────────────────────── */

var HEADERS = {
  Enquiries: ['Timestamp', 'Property', 'Check-in', 'Check-out', 'Guests', 'Name', 'Note', 'Status'],
  Waitlist:  ['Timestamp', 'Estate', 'Name', 'WhatsApp', 'Consent'],
  Reviews:   ['Timestamp', 'Property', 'Name', 'Phone', 'Occasion', 'Rating', 'Review', 'Status'],
};

function appendRow(tab, values) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(tab);
  if (!sheet) {
    sheet = ss.insertSheet(tab);
    sheet.appendRow(HEADERS[tab]);
  }
  sheet.appendRow(values);
}

function str(v) { return typeof v === 'string' ? v.trim().slice(0, 500) : ''; }

function fmtDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso))) return '';
  var d = new Date(iso + 'T00:00:00+05:30');
  return Utilities.formatDate(d, 'Asia/Kolkata', 'd MMM yyyy');
}

function timestamp() {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', "d MMM yyyy, h:mm a") + ' IST';
}

function reply(success, error) {
  var out = { success: success };
  if (error) out.error = error;
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
