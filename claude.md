# AnVira — Master Document
### Ideas, Vision & Development Roadmap
*Compiled from ideasV2.md — June 2026*

---

## 1. Project Vision

AnVira is a direct-booking platform for India's top-tier private villa estates — competing not with OTAs but with the digital experience of Aman, Oberoi, and Six Senses. The platform must not just look luxury — it must *feel* trustworthy and certain to a guest spending ₹1,50,000/night.

**Core positioning:** Private estates. Direct access. No OTA presence.

**Reference brands:** Aman Resorts, The Oberoi Group, Six Senses, Domaine des Etangs, LVMH Hospitality.

---

## 2. Guest Journey (6 Stages)

Every platform decision maps back to one of these six stages:

```
DISCOVERY → CONSIDERATION → DECISION → PRE-ARRIVAL → STAY → POST-STAY
```

| Stage | Key Platform Requirement |
|---|---|
| Discovery | OG image per property, sub-2s load, WhatsApp-preview-ready share link |
| Consideration | 30+ pro photos, video walkthrough, staff intro, verified reviews, anchor pricing |
| Decision | Sticky booking widget, month-level availability calendar, Message Preview Card |
| Pre-Arrival | Private `/arrive/[slug]` guest info page — directions, caretaker contact, house notes |
| Stay | Local staff-curated recommendations, QR code in property linking to page |
| Post-Stay | Review submission page, return guest recognition via WhatsApp + simple CRM log |

---

## 3. Design System

### Color Palette

| Role | Name | Hex |
|---|---|---|
| Page Background | Lime Wash | `#F5F1E8` |
| Surface / Cards | Bone | `#FAF8F3` |
| Primary Text | Ink | `#18181A` |
| Secondary Text | Dust | `#7A7670` |
| Accent | Patina Brass | `#A87C45` |
| Accent Wash | Turmeric Mist | `#EFE0C0` |
| Structural | Linen Rule | `#D6CEBF` |
| WhatsApp | Monsoon Green | `#1F9E5F` |
| Error | Fired Clay | `#B5513A` |

**Rule:** No pure `#000000` or `#FFFFFF` anywhere. Everything lives in the warm tonal range.

### Typography

| Role | Typeface | Variant |
|---|---|---|
| Display / Hero | Cormorant Garamond | Light Italic 300 |
| Editorial Headings | Cormorant Garamond | Regular 400 |
| UI / Body | DM Sans | Regular 400 |
| UI Emphasis | DM Sans | Medium 500 |
| Data / Numbers | DM Mono | Regular 400 |
| Micro / Attribution | Spectral | Light Italic 300 |

### Design Language: Indian Spatial Geometry
The differentiating layer — not decorative, but *structural*:
- **Section dividers:** inset brass line, 60% width, 0.5px, starting at left margin
- **Image frames:** image bleeds off one edge, border holds the other — like a pinned photograph
- **Hero layout:** left-anchored text, full-bleed image on the right (asymmetric, like a courtyard framing)
- **Micro-motif:** a 4×4 dot grid (16 dots) used as a section marker — inspired by jaali geometry

### Layout
- Grid: 10-column (wider margins, more refined feel)
- Max content width: `1080px`
- Section padding: `160px` desktop / `80px` mobile
- One focal point per section — no competing sections

### Motion Principles
*Unhurried but precise:*
- Hero text: word-by-word stagger, 40ms delay
- Hero image: Ken Burns slow zoom 100→103% over 8s
- Section entry: fade-up 30px, 0.7s ease-out, triggered at 20% viewport
- Property card hover: image scale 1.0→1.04, shadow deepens, brass underline grows
- Booking widget: slides in from right on first scroll past hero
- Message preview card: unfolds from button like paper — scale + opacity, 0.5s spring
- WhatsApp button: soft concentric pulse, 4s interval, 0.3 opacity max
- **Not animated:** nav links, body text, buttons (only color change / underline wipe)

---

## 4. Key Feature Specs

### 4.1 The Message Preview Card (Signature Interaction)
When the guest taps "Book via WhatsApp":
1. Button reads "Preparing your enquiry..." (0.3s)
2. A card unfolds from the button (CSS scale-Y + opacity from origin point)
3. Card shows: property name, check-in/out, nights, guest count, editable name field, optional note field
4. Guest sees exactly what will be sent — can edit before sending
5. "Send on WhatsApp" opens `wa.me` with full pre-filled message
6. Card closes with soft collapse

**The "add a note" field** captures occasion context (anniversary, corporate retreat) that otherwise takes 2–3 WhatsApp messages to surface.

### 4.2 Availability Calendar (Lightweight)
- Month-view only — no exact date engine
- Green = available, Amber = partial, Grey = fully booked
- Clicking an available month pre-fills the booking widget
- Data source: JSON file or Google Sheet, updated manually by owner once a week

### 4.3 Pre-Arrival Guest Info Page
- Private URL: `/arrive/[property-slug]` — shared only in booking confirmation
- Contents: directions + Google Maps link, airport/railway distances, caretaker contact, house-specific notes, check-in/out times, what to bring

### 4.4 Post-Stay Review Page (`/reviews/submit`)
- Triggered via WhatsApp message after checkout
- Fields: Name, Occasion, Rating (1–5), Written review (max 200 words)
- No login required — name + phone verification only
- Reviews queue for owner approval before going live

### 4.5 "Coming Soon" Estate System
- Blurred/greyscale card or geometric Linen Rule placeholder
- Tag: *"Under Curation"* or *"Opening [Season/Year]"*
- "Notify me" CTA — saves WhatsApp number to waitlist
- On launch: WhatsApp broadcast to waitlist

---

## 5. Technical Architecture

### Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS with custom design tokens
- **Images:** Vercel Image Optimization or Cloudinary (WebP/AVIF)
- **Analytics:** Plausible or Vercel Analytics (privacy-first, no cookie banner)
- **Fonts:** `font-display: swap` + preload for Cormorant and DM Sans

### Performance Targets
- Lighthouse: 90+ across all four categories
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Page load: under 2 seconds on 4G
- PWA: installable on mobile, service worker for offline property page caching

### URL Structure
```
/                             → Homepage
/estates                      → Full portfolio
/estates/[slug]               → Property page
/arrive/[slug]                → Pre-arrival guest info (private)
/reviews/submit               → Post-stay review form
/about                        → Brand story (optional)
/legal/privacy
/legal/terms
/legal/cancellation
```

### Booking Flow (Technical)
```
Guest fills widget
  → Validates dates + guest count
  → Generates pre-filled message string
  → Opens Message Preview Card
  → Guest edits name + note
  → Click "Send on WhatsApp"
  → window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`)
  → [Optional] POST to /api/log-enquiry → Google Sheet via Sheets API
```

The enquiry log sheet columns: `Timestamp | Property | Check-in | Check-out | Guests | Name | Status`

### Data Model (Property)
```typescript
interface AnViraEstate {
  slug: string;
  name: string;
  tagline: string;
  location: {
    display: string;
    altitude?: string;
    coordinates: [number, number];
    directions_url: string;
    nearest_airport: string;
  };
  capacity: {
    rooms: number;
    guests: number;
    bathrooms: number;
    area_sqft?: number;
  };
  pricing: {
    from_per_night: number;
    currency: "INR";
    note: string;
    minimum_nights: number;
    minimum_nights_weekend?: number;
    whats_included: string[];
    whats_extra: string[];
  };
  media: {
    hero_image: string;
    og_image: string;        // 1200×630px for social sharing
    gallery: string[];
    video_url?: string;
  };
  availability: {
    [yearMonth: string]: "available" | "partial" | "booked";
  };
  amenities: Amenity[];
  staff: { name: string; role: string; bio: string; photo: string; }[];
  local_guide: LocalSpot[];
  faq: { question: string; answer: string; }[];
  cancellation_policy: string;
  reviews: Review[];
  contact: {
    whatsapp: string;
    phone: string;
    whatsapp_message_template: string;
  };
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
    schema: object;          // JSON-LD LodgingBusiness
  };
  status: "active" | "coming_soon" | "seasonal";
  opening?: string;
}
```

### CMS Strategy
| Phase | Condition | Solution |
|---|---|---|
| Phase 1 | Now | JSON files in `/data/estates/*.json` — version controlled |
| Phase 2 | 3+ estates or first non-technical co-manager | Sanity.io (free tier) |
| Phase 3 | 10+ estates | Custom admin panel or Sanity with custom schemas |

---

## 6. Content Standards

### Photography (per estate)
**Hero shots (3–4):** arrival/driveway, signature outdoor space at golden hour, best bedroom, gathering space.

**Supporting shots (20–25):** each bedroom, each bathroom, kitchen detail, staff portrait, local surroundings, night exterior shots, detail shots (brass hardware, linen, candles).

**Avoid:** fish-eye lenses, HDR processing, empty pools, visible cleaning supplies, stock "people enjoying villa" photos.

### Copy Voice
- Confident without arrogant. Warm without casual. Specific, not superlative. Indian in reference, international in register.

| Avoid | Use instead |
|---|---|
| "Stunning mountain views" | "The ridge at Chail sits at 2,250 metres. The view earns it." |
| "Luxurious amenities" | "Five bedrooms. A heated pool. A staff of four who know this house intimately." |
| "Book now for an unforgettable stay" | "Enquire. We'll take care of the rest." |

### Local Recommendations Format (per property, 4–6 spots)
Each entry: Name · one-line description in AnVira voice · distance in minutes · Best for: [single label]

---

## 7. Development Roadmap

### Phase 0 — Foundation (Before Any Code)
- [x] Finalise design tokens (colors, type scale, spacing) in a Figma/tokens file
- [ ] Confirm WhatsApp Business number (verified, green tick)
- [ ] Confirm dedicated business phone line
- [ ] Decide on CMS approach (Phase 1: JSON files)
- [ ] Set up Google Sheet for enquiry logging
- [x] Define 3 launch properties and their slugs

---

### Phase 1 — Core Pages (MVP)

**1.1 Homepage**
- [ ] Left-anchored hero (45% text / 55% full-bleed image)
- [ ] Estate collection grid (3 cards, asymmetric image frames)
- [x] Philosophy block (Cormorant Italic quote, Turmeric Mist background)
- [ ] Experience Pillars section (6 icons, 2-column, staggered reveal)
- [x] Guest Voices carousel (named, occasion-specific testimonials)
- [x] Final CTA strip — WhatsApp + Call

**1.2 Estate Listing Page (`/estates`)**
- [x] All active estates as cards
- [ ] Coming Soon cards with "Notify me" waitlist capture
- [ ] Filter by: location / capacity (simple, not complex)

**1.3 Property Page (`/estates/[slug]`)**
- [ ] 100vh parallax hero, estate name bottom-left (Cormorant Italic), location in Spectral
- [ ] Sticky booking panel (desktop right column)
- [ ] Property story prose (600px max width)
- [x] Quick stats (rooms · guests · baths)
- [x] Masonry gallery (3-column, lightbox on click)
- [x] Amenities icon grid
- [x] Month-level availability calendar
- [x] Location section with Google Maps embed
- [ ] Staff introduction (photo + bio paragraph)
- [ ] Local guide (4–6 curated spots)
- [ ] Reviews section (approved, named, dated)
- [ ] Similar estates (2 cards)
- [ ] Anchor price + minimum nights + what's included/extra

**1.4 Booking Widget + Message Preview Card**
- [x] Date inputs (check-in / check-out) with validation
- [x] Guest count input with capacity cap
- [x] Name field
- [x] "Preview Message" button
- [x] Message Preview Card animation (paper unfold from button)
- [x] "Add a note" optional field in card
- [x] "Send on WhatsApp" → `wa.me` deep link
- [x] "Call Instead" fallback
- [ ] `/api/log-enquiry` → Google Sheets logging

**1.5 Legal & Policy Pages**
- [ ] `/legal/privacy`
- [ ] `/legal/terms`
- [ ] `/legal/cancellation`

---

### Phase 2 — Guest Journey Completion

**2.1 Pre-Arrival Pages**
- [ ] `/arrive/[slug]` — private, link-shared with confirmed guests only
- [ ] Contents: directions, map, airport/rail distances, caretaker contact, house notes, check-in policy

**2.2 Review Submission**
- [ ] `/reviews/submit` — triggered via post-stay WhatsApp message
- [ ] Form: name, occasion, star rating, written review (200 words max)
- [ ] No login — phone verification
- [ ] Owner approval queue before public display

**2.3 Coming Soon Waitlist**
- [ ] "Notify me" form on Coming Soon cards → saves name + WhatsApp number
- [ ] Simple storage (Google Sheet)

---

### Phase 3 — Polish & Performance

**3.1 Performance**
- [ ] Lighthouse audit — target 90+ all categories
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] Image pipeline: WebP with AVIF fallback
- [ ] Font preloading: Cormorant + DM Sans
- [ ] PWA: service worker, offline caching for property pages

**3.2 SEO**
- [ ] `meta_title` + `meta_description` per page
- [x] JSON-LD `LodgingBusiness` schema per property
- [ ] OG image (1200×630px) per property for social previews
- [ ] Sitemap + Google Search Console submission

**3.3 Accessibility**
- [ ] WCAG AA contrast — check Dust `#7A7670` on Bone `#FAF8F3`
- [x] Keyboard navigation + visible focus states
- [x] Descriptive alt text for all images
- [x] Visible form labels (not just placeholder text)
- [x] `prefers-reduced-motion` respected globally
- [ ] Body font minimum 16px

**3.4 Motion System**
- [x] Global scroll-triggered fade-up (IntersectionObserver)
- [ ] Hero Ken Burns (CSS animation)
- [x] WhatsApp button pulse
- [x] Property card hover states
- [x] Message Preview Card unfold animation
- [x] Gallery lightbox open/close

---

### Phase 4 — Operations & Growth

**4.1 CMS Migration (Sanity.io)**
- Trigger: 3+ estates or first non-technical co-manager
- [ ] Sanity schema matching `AnViraEstate` TypeScript interface
- [ ] GROQ queries replacing JSON imports
- [ ] Owner/editor login for content updates

**4.2 Return Guest Recognition**
- [ ] Guest log: name + phone + property + dates (Google Sheet, Phase 1)
- [ ] Manual flag for returning guests in WhatsApp conversation
- [ ] Personalised welcome-back message template

**4.3 Instagram / Social**
- [ ] OG image per property confirmed and tested in WhatsApp/iMessage preview
- [ ] "Share this estate" button generating preview link
- [ ] QR code per property (for physical display in estate) → links to property page

---

## 8. Pre-Launch Checklist

### Soft Launch (3 properties)
- [ ] WhatsApp Business verified (green tick)
- [ ] Professional photography complete (min. 20 images per property)
- [ ] Video walkthrough for at least 1 estate
- [ ] Pricing anchors confirmed
- [ ] Cancellation policy written and reviewed
- [ ] Privacy policy + T&Cs live
- [ ] GSTIN in footer
- [ ] All 3 property pages complete (story, gallery, amenities, FAQ, local guide, caretaker)
- [ ] WhatsApp Business: profile, description, hours, quick replies, away message
- [ ] Google Search Console connected + sitemap submitted
- [ ] Lighthouse 90+ verified
- [ ] Tested on: iPhone Safari, Android Chrome, iPad, desktop Chrome + Safari
- [ ] All phone/WhatsApp links tested
- [ ] Message preview card tested end-to-end
- [ ] Availability calendar seeded

### Public Launch
- [ ] Instagram account: minimum 12 posts live
- [ ] Google Business Profile created for AnVira
- [ ] 3 founding reviews live on site (real past guests)
- [ ] Press mention in Indian luxury/travel publication (optional but powerful)
- [ ] Enquiry log (Google Sheet) live and monitored
- [ ] WhatsApp 2-hour response SLA being honoured

---

## 9. Competitive Edge Summary

| What most villa sites do | What AnVira does instead |
|---|---|
| "Contact us" form | WhatsApp with fully pre-filled context |
| Generic "luxury" copy | Property-specific prose that earns the word |
| No pricing until enquiry | Anchor "from" price + inclusions, prominently |
| Anonymous star reviews | Named, dated, occasion-specific testimonials |
| Staff invisible | Caretaker introduced by name and photograph |
| No local guidance | Staff-curated 4–6 spot local guide |
| Guest abandoned post-booking | Pre-arrival info page + 48h check-in message |
| No post-stay follow-up | Review request + return guest recognition |
| "Under construction" for new estates | "Under Curation" card with waitlist capture |
| Slow mobile experience | Sub-2s load, offline caching, native inputs |

---

*AnVira Private Estates — Internal Development Document*
*Based on ideasV2.md — Version 2.0, June 2026*
