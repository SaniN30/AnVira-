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
    amenities: ['Private Terrace','Bonfire Pit','Valley Views','Curated Dining','Chef on Request','Gazebo','Indoor Games','24/7 Staff','Free Parking'],
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
  {
    id: 'estate-10',
    name: 'Estate 10',
    loc: 'New Delhi',
    region: 'Delhi',
    tag: 'Urban Estate',
    desc: 'A luxurious urban oasis in New Delhi with a manicured acre lawn, private outdoor pool, in-house temple, and bespoke hospitality — for up to fifteen.',
    fullDesc: 'Tucked away in a peaceful corner amidst the bustling cityscape of New Delhi lies Estate 10 by GTV Estate, a veritable oasis of calm and tranquillity. This hidden gem boasts an unparalleled location and breathtaking interiors that are sure to leave you awestruck.\n\nEstate 10 is special because of its:\nIdeal location away from the noise and bustle of the city\nBeautifully landscaped lawn up to an acre in size, ideal for holding small parties\nPrivate outdoor pool surrounded by chaise lounges and outdoor furniture\nWonderfully constructed in-house temple\nDelicious ensemble of home-cooked meals\nImmersive activities like bonfires\nClose proximity to well-known tourist destinations in Delhi',
    price: 'On Request',
    rooms: 4, guests: 15, baths: 4,
    maxGuests: 15,
    pricing: {
      from: null,
      note: 'Tariff quoted per stay — share your dates on WhatsApp',
      minNights: 1,
      included: ['Housekeeping & concierge', '24/7 security', 'Private pool access', 'Parking'],
      extra: ['Home chef (per meal)', 'Bonfire evenings', 'Event & lawn setup', 'Airport transfers'],
    },
    staff: [],
    localGuide: [
      { name: 'Chhatarpur Temple', desc: 'One of Delhi\'s grandest temple complexes, minutes from the estate gate.', mins: 15, best: 'Quiet mornings', mapUrl: 'https://www.google.com/maps/dir/Dera+Village,+Dera+Mandi,+New+Delhi+110074/Chhatarpur+Mandir,+Chhatarpur,+New+Delhi' },
      { name: 'Qutub Minar', desc: 'The 12th-century minaret and its ruin-strewn gardens — go at opening time.', mins: 30, best: 'Heritage', mapUrl: 'https://www.google.com/maps/dir/Dera+Village,+Dera+Mandi,+New+Delhi+110074/Qutub+Minar,+Mehrauli,+New+Delhi' },
      { name: 'The Seven Style Mile, Mehrauli', desc: 'Delhi\'s quietly glamorous strip of boutiques and destination dining.', mins: 25, best: 'Dinner out', mapUrl: 'https://www.google.com/maps/dir/Dera+Village,+Dera+Mandi,+New+Delhi+110074/The+Seven+Style+Mile,+Mehrauli,+New+Delhi' },
      { name: 'Garden of Five Senses', desc: 'Twenty acres of sculpture gardens and amphitheatre evenings.', mins: 25, best: 'Evening strolls', mapUrl: 'https://www.google.com/maps/dir/Dera+Village,+Dera+Mandi,+New+Delhi+110074/Garden+of+Five+Senses,+Saiyad+ul+Ajaib,+New+Delhi' },
    ],
    reviews: [
      { name: 'The Kapoor Family', occ: 'Family gathering · January 2026', stars: 5, text: 'Estate 10 gave us Delhi on our own terms. The lawn, the pool, the privacy — we hosted a family gathering of fifteen and it still felt intimate.' },
    ],
    seo: {
      title: 'Estate 10, New Delhi — Private Pool Villa with Acre Lawn | AnVira',
      desc: 'A private urban estate in Dera Mandi, New Delhi — acre lawn, outdoor pool, home chef, hosts fifteen. Book directly with AnVira.',
    },
    card: 'Delhi/estate10-exterior.webp',
    address: 'Estate 10, Dera Village, Dera Mandi\nNew Delhi — 110 074',
    mapUrl: 'https://www.google.com/maps/dir/StayVista+At+Estate+10+By+Tarika+%7C+Premium+Villa+With+Private+Pool+In+New+Delhi,+Dera+Village,+Dera+Mandi,+New+Delhi,+Delhi+110074//@28.4475278,77.1686262,18.6z/data=!4m8!4m7!1m5!1m1!1s0x390d1f9265c03145:0x4075d136f2ae3942!2m2!1d77.1680222!2d28.4475384!1m0?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D',
    arrive: {
      checkIn: '1:00 PM', checkOut: '11:00 AM',
      distances: [
        { from: 'IGI Airport (DEL)', mode: 'Drive', time: '≈ 45–60 min · 22 km' },
        { from: 'New Delhi Railway Station', mode: 'Drive', time: '≈ 50 min · 24 km' },
        { from: 'Chhatarpur Metro (Yellow Line)', mode: 'Drive', time: '≈ 15 min' },
      ],
      notes: [
        'The estate is gated — share your car number with us a day ahead so security waves you straight through.',
        'The pool is open 7 am – 8 pm; towels are provided at the poolside.',
        'Outdoor music winds down by 10:30 pm in consideration of the neighbourhood.',
        'The home chef shops fresh each morning — share meal preferences the evening before.',
      ],
      bring: ['Swimwear', 'Government ID for all adult guests', 'Event plans, if any — lawn setups are arranged in advance'],
    },
    amenities: ['Private Pool','Manicured Lawn','Bonfire Area','Home Chef','Party Lawn','Indoor Lounge','24/7 Security','Concierge','Parking'],
    images: [
      'Delhi/estate10-exterior.webp',
      'Delhi/estate-10-by-gtv-estate-b9e624.jpg',
      'Delhi/estate-10-by-tarika-53ed2c.jpg',
      'Delhi/estate10-aerial.webp',
      'Delhi/estate-10-by-tarika-6f83a6.jpg',
      'Delhi/estate-10-by-tarika-662fde.webp',
      'Delhi/estate-10-by-tarika-ddc251.webp',
      'Delhi/estate-10-by-gtv-estate-47400c.webp',
      'Delhi/estate-10-by-tarika-23ddeb.jpg',
      'Delhi/estate-10-by-tarika-2fbb08.webp',
      'Delhi/estate-10-by-tarika-3bf85c.webp',
      'Delhi/estate-10-by-tarika-b66637.webp',
      'Delhi/estate-10-by-tarika-960bbb.webp',
      'Delhi/estate-10-by-tarika-3e4445.webp',
      'Delhi/estate-10-by-tarika-e44219.webp',
      'Delhi/estate-10-by-tarika-758430.webp',
      'Delhi/estate-10-by-tarika-9e7e42.webp',
      'Delhi/estate-10-by-tarika-26f7e4.webp',
      'Delhi/estate-10-by-tarika-ab104b.webp',
      'Delhi/estate-10-by-tarika-f3164b.webp',
      'Delhi/estate-10-by-tarika-d8b583.webp',
      'Delhi/estate-10-by-tarika-88afd5.webp',
      'Delhi/estate-10-by-tarika-a4c50e.webp',
      'Delhi/estate-10-by-tarika-a59423.webp',
      'Delhi/estate-10-by-tarika-3e1a70.webp',
      'Delhi/estate-10-by-tarika-d6d4ff.webp',
      'Delhi/estate-10-by-tarika-793d04.jpg',
      'Delhi/estate-10-by-tarika-036fcf.webp',
    ],
    imageCats: [
      'outdoor', 'outdoor', 'outdoor', 'outdoor', 'outdoor', 'dining', 'living', 'outdoor',
      'outdoor', 'outdoor', 'bedroom', 'bedroom', 'washroom', 'bedroom', 'bedroom', 'washroom',
      'bedroom', 'bedroom', 'washroom', 'bedroom', 'bedroom', 'washroom', 'living', 'outdoor',
      'dining', 'outdoor', 'outdoor', 'outdoor',
    ],
  },
  {
    id: 'tarikas-seascapes',
    name: "Tarika's Seascapes",
    loc: 'Mormugao, Goa',
    region: 'Goa',
    tag: 'River View Villa',
    desc: 'A bayside holiday home on the Zuari River in Goa with a private pool, river-view deck, and 3 elegant bedrooms — a breezy, private Goan escape.',
    fullDesc: 'This charming bayside holiday home offers a breezy Goan escape with enchanting views of the Zuari River.\n\nLocated on the 2nd floor of an apartment complex, the property features 3 elegant bedrooms — 2 on the upper level and 1 on the ground level. The modern living room opens to a deck area overlooking the river, providing a serene spot for relaxation. The dining area comfortably seats 6, and guests can use the well-equipped kitchen to prepare their own meals.\n\nThe private swimming pool offers spectacular views of the river, and the pool deck is equipped with cosy seating for lounging. The spacious terrace and other common areas offer additional hangout spots to soak in the tranquil surroundings. Parking is conveniently available outside the premises.',
    price: 'On Request',
    rooms: 3, guests: 6, baths: 3,
    maxGuests: 6,
    pricing: {
      from: null,
      note: 'Tariff quoted per stay — share your dates on WhatsApp',
      minNights: 2,
      included: ['Housekeeping', 'Private pool & deck', 'Full kitchen', 'Wi-Fi & parking'],
      extra: ['Cook on request', 'Airport pickup (Dabolim, 10 min)', 'Boat trips on the Zuari'],
    },
    staff: [],
    localGuide: [
      { name: 'Bogmalo Beach', desc: 'A small, uncrowded bay the charter crowds never find. Calm water, two shacks.', mins: 12, best: 'A quiet swim', mapUrl: 'https://www.google.com/maps/dir/Infiniti+Bay,+Holy+Cross+Colony,+Mormugao,+Goa+403711/Bogmalo+Beach,+Bogmalo,+Goa' },
      { name: 'Naval Aviation Museum', desc: 'India\'s only museum of its kind — vintage aircraft on a sea-cliff lawn.', mins: 12, best: 'Rainy mornings', mapUrl: 'https://www.google.com/maps/dir/Infiniti+Bay,+Holy+Cross+Colony,+Mormugao,+Goa+403711/Naval+Aviation+Museum,+Vasco+da+Gama,+Goa' },
      { name: 'Issorcim Beach', desc: 'A fishing-village stretch of sand for long, empty evening walks.', mins: 15, best: 'Sunset walks', mapUrl: 'https://www.google.com/maps/dir/Infiniti+Bay,+Holy+Cross+Colony,+Mormugao,+Goa+403711/Issorcim+Beach,+Goa' },
      { name: "Martin's Corner", desc: 'The Goan institution for pork sorpotel and king prawns. Book ahead.', mins: 25, best: 'Goan dinner', mapUrl: 'https://www.google.com/maps/dir/Infiniti+Bay,+Holy+Cross+Colony,+Mormugao,+Goa+403711/Martins+Corner,+Betalbatim,+Salcete,+Goa' },
    ],
    reviews: [
      { name: 'Priya N.', occ: 'Winter holiday · December 2025', stars: 5, text: 'Waking up to the Zuari River from the terrace — there is simply no comparison. Goa, finally, without the noise. The pool and the sunsets made every morning feel earned.' },
    ],
    seo: {
      title: "Tarika's Seascapes, Goa — 3-BHK River-View Pool Villa | AnVira",
      desc: 'A bayside 3-bedroom holiday home on the Zuari River, Goa — private pool, river-view deck, sleeps six. Book directly with AnVira.',
    },
    card: 'Goa/tarikas-seascapes-2d5a5c.webp',
    address: 'Infiniti Bay, Holy Cross Colony\nMormugao, Ijorshi, Goa — 403 711',
    mapUrl: 'https://www.google.com/maps/dir/Infiniti+Bay,+Holy+Cross+Colony,+Mormugao,+Ijorshi,+Goa+403711/Infiniti+Bay,+Holy+Cross+Colony,+Mormugao,+Ijorshi,+Goa+403711/@15.3978297,73.8537601,17.6z/data=!4m13!4m12!1m5!1m1!1s0x3bbfb86dd979769b:0xc7a61f530f5a48b5!2m2!1d73.854648!2d15.3983042!1m5!1m1!1s0x3bbfb86dd979769b:0xc7a61f530f5a48b5!2m2!1d73.854648!2d15.3983042?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D',
    arrive: {
      checkIn: '1:00 PM', checkOut: '11:00 AM',
      distances: [
        { from: 'Dabolim Airport (GOI)', mode: 'Drive', time: '≈ 10 min · 6 km' },
        { from: 'Madgaon Railway Station', mode: 'Drive', time: '≈ 30 min · 22 km' },
        { from: 'Vasco da Gama town', mode: 'Drive', time: '≈ 15 min' },
      ],
      notes: [
        'The home is on the 2nd floor of the Infiniti Bay complex — there are stairs; let us know in advance if any guest needs assistance.',
        'Parking is just outside the premises; the watchman will guide you in.',
        'The kitchen is fully equipped if you\'d like to cook; a Goan cook is available on request with a day\'s notice.',
        'Sunset from the river deck is the house ritual — pour something cold and be there by 6.',
      ],
      bring: ['Swimwear and sunscreen', 'Government ID for all adult guests', 'Light cottons — Goa stays warm year-round'],
    },
    amenities: ['Private Pool','Sea View Terrace','Home Theatre','Smart TV','Full Kitchen','Workspace','2 Balconies','Private Entrance','24/7 Staff','Parking'],
    images: [
      'Goa/tarikas-seascapes-2d5a5c.webp',
      'Goa/tarikas-seascapes-dabolim-3-bhk-villa-in-goa-with-private-pool-and-spacious-rooms-1a519f.webp',
      'Goa/tarikas-seascapes-7f1d7d.jpg',
      'Goa/tarikas-seascapes-79fbc7.webp',
      'Goa/tarikas-seascapes-48e097.webp',
      'Goa/tarikas-seascapes-08e013.jpg',
      'Goa/tarikas-seascapes-24f804.jpg',
      'Goa/tarikas-seascapes-071f66.webp',
      'Goa/tarikas-seascapes-d00853.webp',
      'Goa/tarikas-seascapes-6729c9.webp',
      'Goa/tarikas-seascapes-a18a09.webp',
      'Goa/tarikas-seascapes-ac1fe6.webp',
      'Goa/tarikas-seascapes-caeaf7.webp',
      'Goa/tarikas-seascapes-2d5a5c.webp',
      'Goa/tarikas-seascapes-79da66.webp',
      'Goa/tarikas-seascapes-4a6927.webp',
      'Goa/tarikas-seascapes-9c6688.webp',
      'Goa/tarikas-seascapes-dd4b25.webp',
      'Goa/tarikas-seascapes-f931e4.webp',
      'Goa/tarikas-seascapes-df6813.webp',
      'Goa/tarikas-seascapes-288959.webp',
      'Goa/tarikas-seascapes-243ea1.webp',
      'Goa/tarikas-seascapes-644930.webp',
      'Goa/tarikas-seascapes-5fd21e.webp',
      'Goa/tarikas-seascapes-e34f07.webp',
      'Goa/tarikas-seascapes-75b43e.webp',
    ],
    imageCats: [
      'outdoor', 'living', 'outdoor', 'living', 'living', 'outdoor', 'outdoor', 'living',
      'dining', 'bedroom', 'bedroom', 'washroom', 'washroom', 'outdoor', 'living', 'bedroom',
      'washroom', 'bedroom', 'dining', 'dining', 'bedroom', 'bedroom', 'washroom', 'washroom',
      'living', 'outdoor',
    ],
  },
];

/* Month-level availability — owner-maintained.
   Override per property/month: AVAILABILITY['estate-10']['2026-08'] = 'partial' | 'booked'
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
  'estate-10':         {},
  'tarikas-seascapes': {},
};

/* ── Estates "Under Curation" — coming-soon cards on /estates/.
   Guests can join a notify-me waitlist; rows land in the Waitlist sheet tab. */
const COMING_SOON = [
  {
    id: 'coming-soon-mukteshwar',
    name: 'An Orchard House',
    loc: 'Mukteshwar, Uttarakhand',
    region: 'Uttarakhand',
    tag: 'Under Curation',
    desc: 'A Himalayan-facing home set in apple and apricot orchards at 2,200 metres — wood fires, glass-walled views of the Nanda Devi range. Currently under development to AnVira standards.',
    image: 'brand/mukteshwar-placeholder.svg',
  },
];

const WA_NUMBER = '919807087087';

/* Google Apps Script web-app endpoint (enquiry log / waitlist / reviews).
   Empty string = logging disabled; every form still degrades gracefully.
   Set after the owner deploys tools/apps-script.gs (see tools/APPS_SCRIPT_SETUP.md). */
const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzHjD3cKsgHmznDuc0V-GIfr1rMTAmFaKIZ9GMDaAP2TTSrKBtnBoNursfULudgsRIL/exec';

/* Fire-and-forget logger — never blocks or breaks the guest flow.
   Apps Script web apps require no CORS preflight when sent as text/plain. */
function logToSheet(type, payload) {
  if (!API_ENDPOINT) return;
  try {
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type, ...payload }),
      keepalive: true,
    }).catch(() => {});
  } catch (_) { /* logging must never affect the guest */ }
}
