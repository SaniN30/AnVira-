# AnVira — Platform Ideas V2
### The Top-of-Line Standard
*Written from the dual perspective of a luxury hospitality designer + a seasoned hotelier*

---

## Preface: What "Top of Line" Actually Means

Most luxury villa websites look expensive. AnVira must *feel* expensive — and more importantly, *feel trustworthy*.

A guest spending ₹1,50,000/night on a private estate is not just buying rooms. They are buying certainty. They are buying the feeling that every detail has been thought of, that the person on the other end of that WhatsApp message knows exactly what they need before they ask, and that nothing will go wrong. The platform must communicate all of that before a single message is sent.

References for ambition:
- **Aman Resorts** — the architecture of restraint, photography that feels like breath
- **The Oberoi Group** — Indian warmth coded into every line of copy
- **Six Senses** — sensory storytelling, the guest journey as a narrative arc
- **Domaine des Etangs (France)** — direct booking, personal, no OTA presence
- **LVMH Hospitality** — brand discipline above all else

AnVira is building in that tier. Not aspiring to it — *building in it from day one.*

---

## Part I — The Guest Journey (Hotelier's Lens)

A hotelier thinks in journeys, not pages. Every touchpoint from first Google search to post-checkout follow-up is a managed experience. The platform must serve all six stages.

```
DISCOVERY → CONSIDERATION → DECISION → PRE-ARRIVAL → STAY → POST-STAY
```

### Stage 1: Discovery
*How do guests find AnVira?*

- **Search** — "luxury private villa Chail," "exclusive estate Goa river view," "private villa Delhi for family"
- **Instagram** — visual luxury, reels of property walks, morning light on a terrace
- **Word of Mouth** — the primary channel at this tier; the platform must be share-worthy
- **Direct referral** — past guests forwarding the link; the URL must load beautifully on WhatsApp preview

**Platform requirements:**
- OG image per property — photographed specifically for social preview (1200×630px, not a cropped gallery shot)
- Page load under 2 seconds on 4G — a slow page kills a referral instantly
- "Share this estate" button that generates a beautiful preview link

---

### Stage 2: Consideration
*How does a guest evaluate AnVira against alternatives?*

At this tier, guests are comparing AnVira against:
- Airbnb Luxe
- StayVista / SaffronStays
- Direct competitor villas

They are asking:
- Is this legitimate?
- Is this worth the price?
- Can I trust these people with my family/celebration?
- What is actually included?

**Platform requirements:**
- **Trust signals** prominently placed: established year (Est. 2018), total guests hosted, review count
- **Photography standard** — minimum 30 images per property, professionally shot. No phone photos. Interior details matter as much as exterior.
- **Video walkthroughs** — a 60–90 second ambient property film per estate (no voiceover, just sound + visuals). This is non-negotiable at this tier.
- **Staff introductions** — one paragraph + portrait of the in-house caretaker for each estate. Guests want to see the face of the person who will serve them.
- **Verified reviews** — not anonymous stars. Guest name, occasion (anniversary, family reunion), date of stay. Fewer but more credible.
- **Frequently asked questions** — specific to each property: parking, nearest airport, pet policy, liquor policy, generator backup, cook arrangements.
- **Rate transparency** — "On Request" is acceptable for the headline rate, but include a "From ₹X,000 per night" anchor so guests can self-qualify before enquiring.

---

### Stage 3: Decision
*The moment that matters most.*

The guest has decided they want this estate. Now they need to be able to act immediately and effortlessly — on whatever device they're using, at whatever hour they're browsing.

**Platform requirements:**
- **Booking widget always visible** — not buried, not hidden behind a "Contact" nav link
- **Date availability hint** — a simple calendar showing blocked/available months (not exact dates, just month-level). Guests should know if December is available before starting a conversation.
- **Minimum stay display** — "Minimum 2 nights" or "Minimum 3 nights on weekends" clearly stated upfront, not discovered in the WhatsApp conversation
- **Instant vs. Request** clarity — "We respond within 2 hours" with a WhatsApp response time badge
- **The Message Preview Moment** — (from V1, elevated) — before opening WhatsApp, show the guest the full pre-filled message in a floating card. Let them edit their name and add a note. This is the digital equivalent of a concierge handing a guest a beautifully printed card.
- **Fallback: Phone** — some guests (especially older, HNI segment) will not use WhatsApp. The phone number must be one tap away, always.

---

### Stage 4: Pre-Arrival
*The gap between booking confirmation and check-in. Most hospitality brands abandon guests here. AnVira should not.*

This stage is primarily off-platform (WhatsApp conversations), but the platform can support it:

**Platform requirements:**
- **Guest Information Page** (accessible via a link in the booking confirmation message):
  - Directions with map + Google Maps link
  - Nearest airport / railway station distances
  - Local emergency contacts
  - Property-specific house notes ("The pool is heated on request, inform staff 2 hours in advance")
  - Caretaker contact number
  - What to bring / what's provided
  - Check-in time, early check-in policy, late check-out policy
- This page can be a private `/arrive/[property-slug]` URL shared only with confirmed guests

---

### Stage 5: The Stay
*The platform's role during the stay is minimal but must not fail.*

**Platform requirements:**
- The property page must load instantly on mobile (guests will share it with friends)
- Local recommendations section per property: *"What our guests love nearby"* — 4–6 curated spots (restaurants, treks, experiences). Not a generic travel guide. Staff picks.
- A QR code in the physical property that links to the property page (for guests to share with friends who ask "where are you staying?")

---

### Stage 6: Post-Stay
*The most underused stage in hospitality. This is where loyalty is built.*

**Platform requirements:**
- A **Review Submission Page** — simple, elegant, triggered via a WhatsApp message after check-out:
  *"Thank you for staying at Villa AnVira. If you'd like to share your experience, it takes 2 minutes and means the world to future guests."*
  - Fields: Name, Occasion, Rating (1–5, displayed as a subtle star), Written review (max 200 words)
  - No login required. Name + phone verification is enough.
  - Submitted reviews queue for owner approval before appearing on the site
- A **Return Guest Recognition System** — when a returning guest sends a WhatsApp enquiry, the system (manual or simple CRM) flags them. They receive a personalised note: *"Welcome back. We've set aside [X] for you."* The platform can support this with a simple guest log (name + phone + property + dates — nothing more complex than a Google Sheet for now).

---

## Part II — Design System V2 (Designer's Lens)

### The Core Critique of V1

V1's design was good but had one risk: *Ivory Shell + Antique Brass + Cormorant* is approaching the warm-cream-serif default that the design skill explicitly warns against. It's not wrong — it matches the brief — but it needs a *differentiating layer* that makes it unmistakably AnVira and not just "any luxury villa site."

**The differentiating layer: Indian Spatial Geometry.**

AnVira's estates are in India. The design should carry a subtle trace of Indian architectural DNA — not decorative (no lotus motifs, no obvious Indian patterns), but *structural*. The geometry of a jali screen. The proportions of a haveli courtyard. The asymmetric framing of a hill-station veranda.

This manifests in:
- **Section dividers** that use a single, precise geometric rule — not a full-width line but an inset line starting at the left margin, 60% width, 0.5px, brass-toned
- **Image frames** on property cards that are slightly asymmetric — the image bleeds off one edge while the card border holds the other. Like a photograph pinned to a wall.
- **The hero layout** — not centered, but left-anchored text against a full-bleed right-side image. The asymmetry of a framed courtyard view.
- **A recurring micro-motif**: a single 4×4 dot grid (not a pattern, just 16 dots in 4 rows) used as a section marker. Structural, not decorative. Inspired by jaali puncture geometry.

---

### Updated Color Palette

| Role               | Name               | Hex        | Note                                                        |
|--------------------|--------------------|------------|-------------------------------------------------------------|
| Page Background    | Lime Wash          | `#F5F1E8`  | Slightly more yellow-warm than V1 — lime plaster, not paper |
| Surface / Cards    | Bone               | `#FAF8F3`  | Near-white, warm cast                                       |
| Primary Text       | Ink                | `#18181A`  | Near-black, not pure black — softer on the warm background  |
| Secondary Text     | Dust               | `#7A7670`  | Warm grey, not cold                                         |
| Accent             | Patina Brass       | `#A87C45`  | Deeper, older brass — more aged metal than polished gold    |
| Accent Wash        | Turmeric Mist      | `#EFE0C0`  | Very diluted gold — for section backgrounds, blockquotes    |
| Structural         | Linen Rule         | `#D6CEBF`  | Borders, dividers, card edges                               |
| WhatsApp           | Monsoon Green      | `#1F9E5F`  | Slightly desaturated WhatsApp green — doesn't fight palette |
| Error / Alert      | Fired Clay         | `#B5513A`  | Warm error state, consistent with palette                   |

**The rule:** no element uses pure `#000000` or `#FFFFFF`. Everything lives in the warm tonal range.

---

### Typography V2

The V1 pairing (Cormorant + DM Sans) is retained but with new rules and a third voice.

| Role                  | Typeface                  | Variant              | Usage                                        |
|-----------------------|---------------------------|----------------------|----------------------------------------------|
| Display / Hero        | **Cormorant Garamond**    | Light Italic, 300    | Hero titles, pull quotes, estate names       |
| Editorial Headings    | **Cormorant Garamond**    | Regular, 400         | Section titles, property page headings       |
| UI / Body             | **DM Sans**               | Regular 400          | All body copy, UI labels, nav                |
| UI Emphasis           | **DM Sans**               | Medium 500           | Buttons, form labels, amenity tags           |
| Data / Numbers        | **DM Mono**               | Regular 400          | Rates, room counts, dates in booking widget  |
| *New: Micro / Detail* | **Spectral**              | Light Italic, 300    | Pull-quote attribution, location bylines, legal footer |

**Spectral** (a Google Fonts serif designed for screen reading) is the new addition. Used sparingly — only for attribution lines like *"The Kapoor Family — Estate 10, New Delhi"* and location taglines like *"Chail, 2,250m above sea level."* It adds a literary register that neither Cormorant (too dramatic) nor DM Sans (too clean) provides.

---

### Layout Philosophy: The Unhurried Scroll

Luxury hospitality does not rush the eye. The pacing of scroll on an Aman page is deliberate — each section breathes.

**Rules:**
- Section vertical padding: `160px` desktop, `80px` mobile. More generous than V1.
- No section fights the one above it for attention. Each section has one focal point.
- White space is not emptiness — it is *arrival time* for the eye.
- The grid is 10-column (not 12) — this forces slightly wider margins, which reads as more refined.
- Maximum content width: `1080px` — narrower than V1's `1200px`. This keeps line lengths readable and the page feels less like a brochure.

**ASCII Wireframe — Homepage:**
```
┌─────────────────────────────────────────────────────────────┐
│ NAV: AnVira [logo]           Portfolio  Estates  Enquire    │
├────────────────────────────────┬────────────────────────────┤
│                                │                            │
│  HERO TEXT (left, 45% width)   │   FULL-BLEED IMAGE         │
│                                │   (right, 55% width,       │
│  "Private Estates.             │    bleeds to edge)         │
│   Direct Access."              │                            │
│                                │                            │
│  [Book via WhatsApp]           │                            │
│  [Explore Estates →]           │                            │
│                                │                            │
├────────────────────────────────┴────────────────────────────┤
│                                                             │
│              THE COLLECTION (full width)                    │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐              │
│   │ IMAGE    │   │ IMAGE    │   │ IMAGE    │              │
│   │          │   │          │   │          │              │
│   │ Chail    │   │ Delhi    │   │ Goa      │              │
│   │ 12 guests│   │ 15 guests│   │ 10 guests│              │
│   └──────────┘   └──────────┘   └──────────┘              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PHILOSOPHY (centered, narrow, generous whitespace)         │
│  Block quote in Cormorant Italic / Turmeric Mist bg        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  EXPERIENCE PILLARS (2 col, staggered reveal)               │
│  [icon] Private by Design    [icon] Dedicated Staffing      │
│  [icon] Curated Interiors    [icon] Unhurried Rhythm        │
│  [icon] Gated Security       [icon] White-Glove Support     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  GUEST VOICES (full width, large quote, carousel)           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FINAL CTA STRIP (Turmeric Mist background)                 │
│  "Ready to enquire?"   [WhatsApp]  [Call]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**ASCII Wireframe — Property Page:**
```
┌─────────────────────────────────────────────────────────────┐
│  FULL-SCREEN HERO (100vh, parallax)                         │
│  Estate name bottom-left in Cormorant Italic                │
│  Location tag in Spectral below it                          │
├────────────────────────────────────┬────────────────────────┤
│                                    │  STICKY BOOKING PANEL  │
│  THE STORY (prose, 600px wide)     │  ┌──────────────────┐  │
│                                    │  │ Check-in  [date] │  │
│  QUICK STATS                       │  │ Check-out [date] │  │
│  5 Rooms · 12 Guests · 5 Baths    │  │ Guests    [  2 ] │  │
│                                    │  │ Name   [______]  │  │
│  GALLERY (masonry, 3 cols)         │  │                  │  │
│                                    │  │ [Preview Message]│  │
│  AMENITIES (icon grid)             │  │ [WhatsApp ↗]     │  │
│                                    │  │ [Call Instead]   │  │
│  LOCATION (map embed)              │  └──────────────────┘  │
│                                    │                        │
│  STAFF INTRODUCTION               │  From ₹X,000/night     │
│  [Photo] Ramu, Caretaker           │  Min. 2 nights         │
│  "I have cared for this estate...  │                        │
│                                    │                        │
│  LOCAL GUIDE (4 cards)             │                        │
│                                    │                        │
│  REVIEWS (2–3, this property)      │                        │
│                                    │                        │
│  SIMILAR ESTATES                   │                        │
└────────────────────────────────────┴────────────────────────┘
```

---

### Motion Design V2

**Principle: Motion should feel like the estate itself — unhurried but precise.**

| Element                     | Animation                                                      | Timing           |
|-----------------------------|----------------------------------------------------------------|------------------|
| Page load                   | Logo fades in from 0 opacity over 0.8s, then nav slides down  | Sequential       |
| Hero text                   | Words appear left-to-right with a 40ms stagger per word        | On load          |
| Hero image                  | Ken Burns effect — slow zoom 100%→103% over 8s, looping        | Continuous       |
| Section entry               | Fade up 30px, opacity 0→1, 0.7s ease-out, triggered at 20% viewport | On scroll   |
| Property card hover         | Image scale 1.0→1.04, shadow deepens, brass line grows under title | 0.4s ease   |
| Booking widget              | Slides in from right on desktop on first scroll past hero      | On scroll        |
| Message preview card        | Expands from button like a paper unfolding — scale + opacity   | 0.5s spring      |
| Testimonial transition      | Cross-fade with a 60px vertical rise on the incoming quote     | 0.6s             |
| WhatsApp button pulse       | Soft concentric ring — 4s interval, 0.3 opacity max           | Continuous       |
| Gallery lightbox open       | Background darkens, image scales from thumbnail to full        | 0.4s ease-out    |

**What is deliberately NOT animated:**
- Nav links (no hover animations — just color change, 0.2s)
- Body text (no stagger — it's not editorial enough to justify it)
- Buttons (only the underline wipe — no scale, no bounce)

---

## Part III — Hotelier's Requirements Checklist

These are requirements a hospitality director would mandate before going live. Most are absent from competitor villa websites.

### Trust & Credibility
- [ ] Physical address in footer (even if just city) — a real address signals a real business
- [ ] GSTIN or business registration number in footer — legally required, builds trust
- [ ] Privacy policy page — mandatory for any contact form / WhatsApp CTA
- [ ] Terms & conditions page — covering cancellation, damage policy, force majeure
- [ ] Cancellation policy clearly displayed on every property page (not buried in T&Cs)
- [ ] SSL certificate + HTTPS (Vercel handles this, but verify)
- [ ] WhatsApp Business verified account with green tick — guests notice this

### Photography Standards
- [ ] Minimum 30 images per property (exterior, each room, bathrooms, kitchen, outdoor spaces, staff, detail shots)
- [ ] Shot at golden hour AND midday — guests want to see it in different light
- [ ] At least 1 aerial/drone shot per property — establishes setting and scale
- [ ] No people in standard estate shots — privacy associations matter at this tier
- [x] Image alt text for every photo — SEO + accessibility
- [ ] WebP format with AVIF fallback — 40% smaller than JPEG, critical for load speed
- [ ] Video: 60–90 second ambient walkthrough per property. Silent or natural sound. No stock music. No voiceover.

### Pricing & Availability Transparency
- [ ] "From ₹X,000/night" anchor price visible without enquiring — guests self-qualify
- [x] Month-level availability calendar per property (blocks months that are full, no exact dates needed)
- [ ] Minimum stay clearly stated (per property, per season — weekends may differ from weekdays)
- [ ] Peak season / off-season pricing hint: "Rates vary by season — enquire for exact quote"
- [ ] What is included in the rate vs. additional charges: cook charges, firewood, extra guests, alcohol, laundry
- [ ] Security deposit policy (exists at most properties — guests want to know upfront)

### Booking Communication Standards
- [ ] WhatsApp Business profile: professional photo, description, business hours, address, website link
- [ ] Response time SLA displayed on site: "We respond within 2 hours" — and honour it
- [ ] Away message configured for 11pm–8am: warm, professional, sets expectation
- [ ] Quick replies saved in WhatsApp Business for: availability query, rate sheet, T&Cs, directions, booking confirmation
- [ ] Booking confirmation message template: property, dates, rate, deposit amount, payment link, caretaker contact — sent within 30 minutes of verbal agreement
- [ ] Pre-arrival message: 48 hours before check-in — directions, caretaker number, weather, what to bring

### Legal & Policy Requirements (India-specific)
- [ ] GST on accommodation (18% applicable above ₹7,500/night) — displayed in T&Cs
- [ ] Guest registration / Form C compliance for foreign nationals (if applicable to the properties)
- [ ] ID verification policy stated on site — "Guests are required to share a government ID for booking confirmation"
- [ ] Cancellation tiers: full refund >30 days, 50% refund 15–30 days, no refund <15 days (or property-specific)
- [ ] Force majeure clause (natural disasters, government restrictions)

### Accessibility
- [ ] WCAG AA contrast ratios throughout — warm palette needs careful checking (Dust `#7A7670` on Bone `#FAF8F3` must pass)
- [x] Keyboard navigation throughout — tab order logical, focus visible
- [x] All images have descriptive alt text
- [x] Form fields have visible labels (not just placeholder text)
- [x] `prefers-reduced-motion` respected globally
- [ ] Font size minimum 16px for body — no 12px "elegant" small text that's unreadable

---

## Part IV — The Booking Experience in Full Detail

### The Message Preview Moment (V2 — Elevated)

This is the signature interaction. Described briefly in V1; fully designed here.

**Trigger:** Guest fills booking widget → taps "Book via WhatsApp"

**The sequence:**
1. Button label changes to "Preparing your enquiry..." (0.3s)
2. A card **unfolds** from the button like a piece of paper — using a CSS scale-Y + opacity animation from the button's origin point
3. The card shows:

```
┌─────────────────────────────────────────────────────┐
│  AnVira — Your Enquiry                         ✕    │
│  ─────────────────────────────────────────────────  │
│  Hi AnVira 🏡                                       │
│                                                     │
│  I'd like to enquire about                          │
│  *Villa AnVira, Chail*                              │
│                                                     │
│  📅 Check-in:   15 December 2025                   │
│  📅 Check-out:  18 December 2025 (3 nights)        │
│  👥 Guests:     6                                   │
│  👤 Name:       [Rohan _________________ ]          │
│                                                     │
│  Add a note (optional):                             │
│  [We're celebrating an anniversary _________ ]      │
│                                                     │
│  [  Send on WhatsApp  ↗  ]   [  Edit Details  ]   │
└─────────────────────────────────────────────────────┘
```

4. Guest sees exactly what will be sent. They can edit their name and add a note.
5. On "Send on WhatsApp" — opens `wa.me` with the full pre-filled message.
6. The card closes with a soft collapse animation.

**Why this works (hotelier's view):**
- The "add a note" field captures occasion context (anniversary, birthday, corporate retreat) that the host needs to prepare — this information usually comes out 2–3 messages into the conversation. Now it arrives in the first message.
- The name field ensures the host knows who they're speaking with from message one.
- The preview builds trust — guests know exactly what they're initiating.

---

### Availability Calendar (Lightweight)

Not a full booking engine. Just honest availability.

- A month-view calendar per property showing:
  - **Green** months: available
  - **Amber** months: partially booked (contact to check)
  - **Grey** months: fully booked
- Clicking an available month pre-fills the booking widget with that month
- Data source: a simple JSON file or a Google Sheet (manual update by owner)
- No real-time sync needed — owner updates once a week

This solves the biggest guest frustration: enquiring for dates that are already blocked.

---

### The "Coming Soon" Estate System

As AnVira grows beyond 3 properties, the portfolio page needs a dignified way to show upcoming estates without over-promising.

**Design:**
- A card with a blurred or black-and-white image (or a geometric placeholder in Linen Rule color)
- Estate name (if confirmed) or location only
- Tag: *"Opening [Season/Year]"* or *"Under Curation"*
- A single CTA: *"Notify me"* → saves their WhatsApp number (with consent) to a waitlist
- When the estate goes live, a WhatsApp broadcast to the waitlist

This creates anticipation, builds the contact list, and signals growth without revealing operational details.

---

## Part V — Content Strategy

### Photography Direction (per estate)

A luxury property photographer's brief for AnVira:

**Hero shots (3–4 per property):**
- The approach / driveway — arrival feeling
- The signature outdoor space (terrace / lawn / pool) at golden hour
- The best bedroom — bedside table in focus, window view beyond
- The gathering space — dining table set, or living room with fireplace/etc.

**Supporting shots (20–25 per property):**
- Each bedroom individually
- Each bathroom (lighting key — avoid blown-out mirrors)
- Kitchen — clean, with a detail (a bowl of fruit, fresh flowers)
- Staff portrait — natural light, warm, not posed
- Local surroundings — the forest, the view, the river, the lane outside
- Night shots — property lit from within, exterior dark, feels intimate
- Detail shots: a brass doorknob, linen fold, a book on a side table, a candle

**What to avoid:**
- Fish-eye lenses (distorts, feels cheap)
- HDR processing (fake, harsh)
- Empty swimming pools
- Visible cleaning supplies, wires, AC units
- Stock photos of "people enjoying a villa" — AnVira's guests are private people

---

### Copy Voice (expanded)

**The AnVira voice is:**
- Confident without being arrogant
- Warm without being casual
- Specific rather than superlative
- Indian in its references, international in its register

**Examples:**

| Generic (avoid)                          | AnVira (use)                                                       |
|------------------------------------------|--------------------------------------------------------------------|
| "Stunning mountain views"               | "The ridge at Chail sits at 2,250 metres. The view earns it."     |
| "Luxurious amenities"                   | "Five bedrooms. A heated pool. A staff of four who know this house intimately." |
| "Perfect for family getaways"           | "Twelve guests, one gate, no strangers. Your family, your pace."  |
| "Book now for an unforgettable stay"    | "Enquire. We'll take care of the rest."                           |
| "Amazing reviews from our guests"       | "Those who have stayed speak plainly."                             |

---

### Local Recommendations Format

Per property, 4–6 staff-curated local recommendations. Not TripAdvisor. Not generic.

Each entry:
- **Name** of place (no hyperlink — if they want to find it, they'll find it)
- **One-line description** in AnVira's voice
- **Distance** from property in minutes
- **Best for:** (a single label: breakfast / a long walk / a quiet evening / provisions)

Example for Villa AnVira, Chail:
```
Chail Creamery — The milk comes from down the hill. The coffee is simple and correct. 8 minutes. Best for: a slow morning.
Chail Palace Ground — Walk the perimeter at dusk. The deodar cedars are older than the estate. 12 minutes. Best for: an evening walk.
```

---

## Part VI — Technical Architecture V2

### Performance Requirements
- **Lighthouse score:** 90+ on all four categories (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Image delivery:** Vercel Image Optimization (built-in) or Cloudinary for on-the-fly WebP/AVIF
- **Font loading:** `font-display: swap` + preload for Cormorant and DM Sans
- **No third-party trackers:** no Facebook Pixel, no Google Analytics (use Plausible or Vercel Analytics — privacy-first, no cookie banner)
- **PWA basics:** installable on mobile, service worker for offline property page caching (guests check directions offline)

### URL Structure
```
/                          → Homepage
/estates                   → Full portfolio
/estates/villa-anvira-chail
/estates/estate-10-delhi
/estates/tarikas-seascapes-goa
/arrive/villa-anvira-chail  → Pre-arrival guest info (private, linked in confirmation)
/reviews/submit             → Post-stay review form
/about                      → Optional brand story page
/legal/privacy
/legal/terms
/legal/cancellation
```

### Data Model (Property)

```typescript
interface AnViraEstate {
  slug: string;
  name: string;
  tagline: string;                 // One line. Cormorant Italic under the name.
  location: {
    display: string;               // "Chail, Himachal Pradesh"
    altitude?: string;             // "2,250m above sea level"
    coordinates: [number, number]; // For map embed
    directions_url: string;        // Google Maps link
    nearest_airport: string;       // "Chandigarh Airport — 90km, ~2.5 hrs"
  };
  capacity: {
    rooms: number;
    guests: number;
    bathrooms: number;
    area_sqft?: number;
  };
  pricing: {
    from_per_night: number;        // Anchor price in INR
    currency: "INR";
    note: string;                  // "Rates vary by season"
    minimum_nights: number;
    minimum_nights_weekend?: number;
    whats_included: string[];
    whats_extra: string[];
  };
  media: {
    hero_image: string;
    og_image: string;              // 1200x630px for social sharing
    gallery: string[];
    video_url?: string;
  };
  availability: {
    [yearMonth: string]: "available" | "partial" | "booked"; // "2025-12": "booked"
  };
  amenities: Amenity[];
  staff: {
    name: string;
    role: string;
    bio: string;
    photo: string;
  }[];
  local_guide: LocalSpot[];
  faq: { question: string; answer: string; }[];
  cancellation_policy: string;
  reviews: Review[];              // Approved reviews only
  contact: {
    whatsapp: string;             // "+91XXXXXXXXXX"
    phone: string;
    whatsapp_message_template: string;
  };
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
    schema: object;               // JSON-LD LodgingBusiness
  };
  status: "active" | "coming_soon" | "seasonal";
  opening?: string;              // For "coming soon" — "Winter 2026"
}
```

### CMS Strategy
- **Phase 1 (now):** JSON files in `/data/estates/*.json` — edited manually, version controlled
- **Phase 2 (3+ estates or first non-technical co-manager):** Sanity.io — free tier handles 3–5 estates easily
- **Phase 3 (10+ estates):** Custom admin panel or Sanity with custom schemas

### Booking Flow — Technical
```
Guest fills widget
  → Validates dates (check-out must be after check-in)
  → Validates guests (≤ estate max capacity)
  → Generates pre-filled message string
  → Opens Message Preview Card
  → Guest edits name + optional note
  → Click "Send on WhatsApp"
  → window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`)
  → [Optional] Log enquiry: POST to /api/log-enquiry → Google Sheet via Sheets API
```

The `/api/log-enquiry` endpoint simply writes to a Google Sheet:
`Timestamp | Property | Check-in | Check-out | Guests | Name | Status: New`

This is the AnVira enquiry log. No CRM needed at this stage.

---

## Part VII — The Competitive Edge Summary

| What most villa sites do              | What AnVira does instead                                    |
|---------------------------------------|-------------------------------------------------------------|
| "Contact us" form                     | Direct WhatsApp with fully pre-filled context               |
| Generic "luxury" copy                 | Property-specific prose that earns the word                 |
| Photo galleries without story        | Each image has a purpose in the property narrative          |
| No pricing until enquiry              | Anchor "from" price + what's included, prominently          |
| Anonymous guest reviews               | Named, dated, occasion-specific testimonials                |
| Staff invisible                       | Caretaker introduced by name and photograph                 |
| No local guidance                     | Staff-curated 4–6 spot local guide per property             |
| Guest abandoned post-booking          | Pre-arrival info page + 48h check-in message                |
| No post-stay follow-up                | Review request + return guest recognition                   |
| Coming soon = under construction page | "Under Curation" card with waitlist capture                 |
| Slow mobile experience                | Sub-2s load, offline caching, native mobile inputs          |

---

## Part VIII — Launch Checklist

### Before Soft Launch (3 properties live)
- [ ] Real WhatsApp Business number (verified, green tick)
- [ ] Real phone number (dedicated business line or routed mobile)
- [ ] Professional photography done for all 3 properties (minimum 20 images each)
- [ ] Video walkthrough for at least 1 property (the hero estate)
- [ ] Pricing anchors decided and approved
- [ ] Cancellation policy written and reviewed
- [ ] Privacy policy + T&Cs pages live
- [ ] GSTIN in footer
- [ ] All 3 property pages complete with: story, gallery, amenities, FAQ, local guide, caretaker intro
- [ ] WhatsApp Business: profile photo, description, hours, quick replies, away message
- [ ] Google Search Console connected + sitemap submitted
- [ ] Lighthouse score 90+ verified
- [ ] Tested on: iPhone (Safari), Android (Chrome), iPad, desktop (Chrome + Safari)
- [ ] All phone/WhatsApp links tested and working
- [ ] Message preview card tested end-to-end
- [ ] Availability calendar seeded with current bookings

### Before Public Launch
- [ ] Instagram account active with minimum 12 posts (property photography)
- [ ] Google Business Profile created for AnVira
- [ ] 3 founding reviews live on the site (from real past guests)
- [ ] Press/media mention on an Indian luxury/travel publication (optional but powerful)
- [ ] Internal ops: booking log (Google Sheet) live and monitored
- [ ] WhatsApp response time SLA being honoured (2-hour rule)

---

*Document prepared for AnVira Private Estates*
*Version 2.0 — June 2026*
*Dual perspective: Luxury Hospitality Design + Hotel Operations*
