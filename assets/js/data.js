/* ════════════════════════════════════════════════════════════
   AnVira — estate data (single source of truth)
   Schema follows the AnViraEstate interface in claude.md §5.
   Loaded before main.js on every page.
   ════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   PROPERTY DATA
   images[0..5] → accordion hover cycling
   images (all) → detail page gallery
═══════════════════════════════════════════════════════════════ */
const PROPERTIES = [
  {
    id: 'villa-anvira',
    name: 'Villa AnVira',
    loc: 'Chail, Himachal Pradesh',
    region: 'Himachal',
    tag: 'Hill Retreat',
    desc: 'An elegant pine-framed mountain villa in Chail with sweeping valley views, a bonfire terrace, and curated hospitality — crafted for families and groups.',
    fullDesc: 'Formerly known as Tarika Residences, Villa Anvira by GTV Estate is an elegant 7-bedroom luxury villa in Chail. Set amidst whispering pine trees and overlooking the tranquil valleys of Himachal, this private mountain retreat is thoughtfully crafted for families and large groups of friends seeking space and serenity.\n\nEach bedroom opens to a private balcony with sweeping forest or valley views, welcoming sunlit mornings, and refreshing mountain winds. Guests can spend their days exploring scenic trails around the estate and their evenings indulging in barbecue feasts and cosy bonfires under the stars. A charming gazebo, high-speed Wi-Fi, and freshly prepared meals on request elevate both leisurely escapes and peaceful workcations.\n\nLocated near Shimla\'s popular attractions yet peacefully tucked away from the crowds, Villa Anvira by GTV Estate offers quiet luxury, natural beauty, and togetherness at the heart of the Himalayas.',
    price: 'On Request',
    rooms: 7, guests: '14 / 20', baths: 6,
    maxGuests: 20,
    pricing: {
      from: null,                       /* owner input pending — renders "On Request" */
      note: 'Tariff quoted per stay — share your dates on WhatsApp',
      minNights: 2,
      included: ['Caretaker & staff on site', 'Daily housekeeping', 'Wi-Fi & parking', 'Morning tea service'],
      extra: ['Chef-prepared meals', 'Bonfire evenings', 'Barbecue setup', 'Local excursions'],
    },
    staff: [],                          /* owner input pending — section hidden until filled */
    localGuide: [
      { name: 'Chail Palace', desc: "The Maharaja of Patiala's 1891 summer retreat — deodar walks, lawns, and high tea.", mins: 15, best: 'Heritage', mapUrl: 'https://www.google.com/maps/dir/Villa+AnVira,+Kufri+Rd,+Kandaghat,+Chail,+Himachal+Pradesh+173217/Chail+Palace,+Chail,+Solan,+Himachal+Pradesh' },
      { name: 'Kali Ka Tibba', desc: 'A hilltop temple with a 360° sweep of the Shivalik ranges. Go an hour before sunset.', mins: 25, best: 'Sunset views', mapUrl: 'https://www.google.com/maps/dir/Villa+AnVira,+Kufri+Rd,+Kandaghat,+Chail,+Himachal+Pradesh+173217/Kali+Ka+Tibba,+Chail,+Himachal+Pradesh' },
      { name: 'Chail Cricket Ground', desc: 'The highest cricket pitch in the world, ringed entirely by pine.', mins: 20, best: 'Morning walks', mapUrl: 'https://www.google.com/maps/dir/Villa+AnVira,+Kufri+Rd,+Kandaghat,+Chail,+Himachal+Pradesh+173217/Chail+Cricket+Ground,+Chail,+Solan,+Himachal+Pradesh' },
      { name: 'Sadhupul Lake', desc: 'Riverside cafés where lunch is eaten with your feet in the stream.', mins: 35, best: 'Lazy afternoons', mapUrl: 'https://www.google.com/maps/dir/Villa+AnVira,+Kufri+Rd,+Kandaghat,+Chail,+Himachal+Pradesh+173217/Sadhupul,+Himachal+Pradesh' },
    ],
    reviews: [
      { name: 'Meera & Rohan S.', occ: 'Anniversary escape · March 2026', stars: 5, text: 'Villa AnVira was unlike anything we had experienced. The pine forest, the silence, the attentiveness of the staff — it reset something in us that a normal holiday never could.' },
      { name: 'Vikram A.', occ: 'Corporate retreat · April 2026', stars: 5, text: 'The team handled every detail — from late arrival to a special dietary request at breakfast. Discretion and warmth in equal measure.' },
    ],
    seo: {
      title: 'Villa AnVira, Chail — 7-Bedroom Private Mountain Estate | AnVira',
      desc: 'A pine-framed 7-bedroom luxury villa in Chail, Himachal — valley views, bonfire terrace, staff of four. Book directly with AnVira.',
    },
    card: 'chail/villa-anvira-by-gtv-estate-6e2617.jpg',
    address: 'Villa AnVira, Kufri Road, Kandaghat\nChail, Himachal Pradesh — 173 217',
    mapUrl: 'https://www.google.com/maps/dir//Villa+AnVira+,+Chail,+Kufri+Rd,+Kandaghat,+Chail,+Himachal+Pradesh+173217/@29.6872837,75.9435921,8.4z/data=!4m8!4m7!1m0!1m5!1m1!1s0x390f8162e0bd3713:0xb48395c65f24bfa9!2m2!1d77.1870428!2d30.9700264?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D',
    arrive: {
      checkIn: '1:00 PM', checkOut: '11:00 AM',
      distances: [
        { from: 'Chandigarh Airport (IXC)', mode: 'Drive', time: '≈ 3.5 hrs · 110 km' },
        { from: 'Kalka Railway Station', mode: 'Drive', time: '≈ 2.5 hrs · 85 km' },
        { from: 'Shimla', mode: 'Drive', time: '≈ 1.5 hrs · 45 km' },
      ],
      notes: [
        'The final stretch is a mountain road — arrive before dusk if you can; the drive up is part of the experience in daylight.',
        'The last full market is in Kandaghat (30 min before the villa). Stock up on anything specific there; the kitchen handles the rest.',
        'Evenings are cool year-round, even in summer. The bonfire is lit on request — let the caretaker know a day ahead.',
        'Mobile coverage is good (Jio/Airtel); Wi-Fi covers the whole villa.',
      ],
      bring: ['Warm layers for the evenings', 'Walking shoes for the forest trails', 'Government ID for all adult guests', 'Any regular medication — the nearest chemist is 20 minutes away'],
    },
    amenities: ['Private Terrace','Bonfire Pit','Valley Views','Curated Dining','Chef on Request','Gazebo','Indoor Games','24/7 Staff','Free Parking','Pet Friendly'],
    petFriendly: true,
    images: [
      'chail/anvira-terrace.webp',
      'chail/villa-anvira-by-gtv-estate-6e2617.jpg',
      'chail/vansh-batra-chail-0a7c5f.jpg',
      'chail/vansh-batra-chail-3e6885.jpg',
      'chail/vansh-batra-chail-8a6042.jpg',
      'chail/anvira-building.webp',
      'chail/vansh-batra-chail-4dc64f.jpg',
      'chail/vansh-batra-chail-f8c6c6.jpg',
      'chail/vansh-batra-chail-97c101.jpg',
      'chail/vansh-batra-chail-dda2f6.jpg',
      'chail/vansh-batra-chail-d1e0eb.jpg',
      'chail/vansh-batra-chail-e3c996.jpg',
      'chail/vansh-batra-chail-5f7c70.jpg',
      'chail/vansh-batra-chail-f0919a.webp',
      'chail/vansh-batra-chail-7df5fb.jpg',
      'chail/vansh-batra-chail-ca8eca.jpg',
      'chail/vansh-batra-chail-ea841b.webp',
      'chail/vansh-batra-chail-d94e84.webp',
      'chail/vansh-batra-chail-a1bce5.webp',
      'chail/vansh-batra-chail-bb69cc.webp',
      'chail/vansh-batra-chail-04fcfe.jpg',
      'chail/vansh-batra-chail-e10d4c.webp',
      'chail/vansh-batra-chail-04c053.webp',
      'chail/vansh-batra-chail-3017b9.webp',
      'chail/vansh-batra-chail-15789f.webp',
      'chail/vansh-batra-chail-bf2b8d.webp',
      'chail/vansh-batra-chail-0180b6.webp',
      'chail/vansh-batra-chail-987d3d.webp',
      'chail/vansh-batra-chail-3b541a.webp',
      'chail/vansh-batra-chail-8b689b.webp',
      'chail/vansh-batra-chail-7e3c7d.webp',
      'chail/vansh-batra-chail-c1f9e0.webp',
      'chail/vansh-batra-chail-36157b.webp',
      'chail/vansh-batra-chail-ab62a1.webp',
      'chail/vansh-batra-chail-901d88.webp',
      'chail/vansh-batra-chail-186fa6.jpg',
      'chail/vansh-batra-chail-f4b990.jpg',
    ],
    /* gallery filter category per image (same order as images):
       outdoor | living | bedroom | dining | washroom */
    imageCats: [
      'outdoor', 'outdoor', 'outdoor', 'outdoor', 'outdoor', 'outdoor', 'outdoor', 'living',
      'bedroom', 'dining', 'bedroom', 'bedroom', 'outdoor', 'washroom', 'outdoor', 'bedroom',
      'washroom', 'bedroom', 'bedroom', 'washroom', 'outdoor', 'dining', 'dining', 'living',
      'bedroom', 'bedroom', 'washroom', 'bedroom', 'bedroom', 'washroom', 'living', 'bedroom',
      'bedroom', 'living', 'dining', 'outdoor', 'outdoor',
    ],
  },
];

/* Month-level availability — owner-maintained.
   Override per month: AVAILABILITY['villa-anvira']['2026-08'] = 'partial' | 'booked'
   Months not listed default to 'available'. */
const AVAILABILITY = {
  'villa-anvira': {
    /* June 2026 — sourced from inventory calendar 2026-06-17 */
    '2026-06-01': 'booked',
    '2026-06-04': 'booked',
    '2026-06-05': 'booked',
    '2026-06-06': 'booked',
    '2026-06-07': 'booked',
    '2026-06-11': 'tentative',
    '2026-06-16': 'owner',
    '2026-06-17': 'owner',
    '2026-06-22': 'owner',
    '2026-06-24': 'owner',
    '2026-06-26': 'owner',
    '2026-06-27': 'owner',
  },
};

const WA_NUMBER = '919807087087';

/* Google Apps Script web-app endpoint (enquiry log / waitlist / reviews).
   Empty string = logging disabled; every form still degrades gracefully.
   Set after the owner deploys tools/apps-script.gs (see tools/APPS_SCRIPT_SETUP.md). */
const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzHjD3cKsgHmznDuc0V-GIfr1rMTAmFaKIZ9GMDaAP2TTSrKBtnBoNursfULudgsRIL/exec';

/* Fire-and-forget logger — never blocks or breaks the guest flow.
   Apps Script web apps require no CORS preflight when sent as text/plain.
   Returns a promise resolving to true/false (never rejects) so callers
   that need a genuine success signal (e.g. conversion tracking) can opt in. */
function logToSheet(type, payload) {
  if (!API_ENDPOINT) return Promise.resolve(false);
  try {
    return fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type, ...payload }),
      keepalive: true,
    }).then(() => true).catch(() => false);
  } catch (_) { /* logging must never affect the guest */ return Promise.resolve(false); }
}
