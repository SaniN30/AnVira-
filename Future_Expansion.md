# AnVira — Future Expansion Roadmap
### From Enquiry Platform → Direct Booking Platform
*Prepared June 2026*

---

## Vision

Transform AnVira from a WhatsApp-enquiry site into India's most trusted direct-booking platform for ultra-luxury private estates — where guests confirm, pay, and arrive without a single manual step from the owner, while preserving the personal, high-touch experience that defines the brand.

**North Star:** A guest lands on AnVira, picks their estate, selects dates, pays the advance, and receives everything they need — all within 10 minutes, without a phone call.

---

## Where We Are Today

| Capability | Current State |
|-----------|---------------|
| Property showcase | Live — 3 estates + 1 under curation |
| Booking flow | Enquiry only — guest fills form, WhatsApp opens |
| Payments | Manual — owner collects outside the platform |
| Availability | Static placeholder calendar |
| Reviews | Manually curated, owner-approved |
| Guest accounts | None |
| Host dashboard | None |
| Search | None — 3 properties listed flat |
| Notifications | None — all on WhatsApp manually |

---

## Guiding Principles

1. **Never lose the luxury feel** — every new feature must match the design standard already set. No generic UI components.
2. **WhatsApp stays** — it remains the human fallback at every stage. Direct booking supplements it, never replaces it.
3. **Build for 10 properties, design for 100** — architecture decisions now must not need rebuilding at scale.
4. **Revenue before complexity** — each phase must independently generate or protect revenue before the next begins.
5. **Owner-first** — the platform must reduce the owner's daily operational load, not add to it.

---

## Phase 0 — Pre-Build Decisions
### Timeline: 2–4 weeks | Cost: Minimal | Team: Owner + 1 developer

Before writing a line of new code, lock these decisions. Every phase depends on them.

### 0.1 Technology Stack
The current static site cannot support bookings. The migration path:

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 (App Router) | Already in the roadmap (claude.md §5); SSR for SEO; React ecosystem |
| Database | PostgreSQL via Supabase | Managed, real-time, free tier, built-in auth |
| Hosting | Vercel | Zero-config Next.js deployment, edge network, India CDN |
| Payments | Razorpay | India-native, UPI + cards + net banking, instant settlements |
| Email | Resend or Postmark | Transactional email, high deliverability |
| SMS / OTP | MSG91 | India SMS, WhatsApp Business API, OTP verification |
| Storage | Cloudflare R2 | Property images at scale — cheaper than S3 |

### 0.2 Business Decisions Needed from Owner

- [ ] Platform commission model — does AnVira take a % from third-party host listings, or remain own-properties only?
- [ ] Instant booking vs. request-to-book — does the owner want to approve every booking manually or allow instant confirmation?
- [ ] Refund policy — current T&C says non-refundable; Razorpay requires a stated refund policy for activation
- [ ] GST registration number (required for payment gateway KYC)
- [ ] PAN + bank account for Razorpay payout setup

### 0.3 Legal Groundwork

- [ ] Updated Terms of Stay to cover online payments and automatic cancellation
- [ ] Privacy Policy updated for storing guest payment data (PCI compliance note)
- [ ] Host Agreement template (if third-party properties onboard later)
- [ ] Consult CA on TCS obligations under Section 194-O (e-commerce operator)

---

## Phase 1 — Live Availability + Razorpay Payments
### Timeline: 8–10 weeks | Closes the core conversion gap

This is the single highest-impact phase. A guest can select real dates, pay the 60% advance online, and receive instant confirmation — without WhatsApp for the transaction.

### 1.1 Live Availability Calendar

**How it works:**
- Availability stored in Supabase: `bookings` table with `property_id`, `check_in`, `check_out`, `status`
- Calendar on each estate page queries live availability via API
- Booked dates are blocked and visually greyed out
- Guest selects check-in → check-out → available nights confirm instantly
- Owner can manually block dates (personal use, maintenance) from a simple admin view

**What the guest sees:**
- Same calendar UI as today but dates are real — green = available, grey = booked
- Selecting dates instantly shows total nights + estimated total price
- "Book Now" button replaces "Enquire on WhatsApp" when dates are available

### 1.2 Razorpay Payment Integration

**Booking flow:**
1. Guest selects estate + dates + guest count
2. Summary screen: nights × nightly rate, 60% advance amount, balance due at check-in
3. Guest enters name + phone + email
4. Razorpay checkout opens (UPI, card, net banking, EMI)
5. On payment success → booking confirmed, dates blocked, confirmation sent
6. On payment failure → dates released, guest shown retry option

**What gets automated:**
- Booking confirmation email to guest (PDF-style, with dates, estate, amount paid, balance due)
- WhatsApp message to guest via MSG91 template (same info, one tap to save contact)
- Notification to owner (new booking alert with full details)
- Google Sheet row created (existing logging preserved as backup)

**Advance + balance logic:**
- 60% charged at booking via Razorpay
- Remaining 40% collected at check-in by estate staff (cash or UPI — not on platform yet)
- Receipt for advance sent automatically

### 1.3 Booking Confirmation Page

After payment, guest lands on `/booking/confirmed/[booking-id]`:
- Booking reference number
- Estate name, dates, guest count
- Amount paid + balance due at check-in
- Add to Google Calendar button
- Link to the `/arrive/[slug]` pre-arrival page (now sent automatically, not just on request)
- "Questions? Message us" WhatsApp button

### 1.4 Simple Owner Admin

A password-protected page at `/admin` (not public, not indexed):
- View all upcoming bookings in a table
- Block dates manually (owner personal use)
- Mark a booking as checked-in / checked-out
- Basic revenue summary: this month's confirmed advance total

**Quality Gate:**
- End-to-end booking tested on iPhone Safari + Android Chrome
- Payment failure + retry tested
- Date conflict (two guests same dates) tested — second guest must see dates as unavailable
- Confirmation email + WhatsApp delivered within 60 seconds of payment

---

## Phase 2 — Guest Accounts + Booking Management
### Timeline: 6–8 weeks | Builds retention and trust

### 2.1 Guest Authentication

- Sign up / login with phone number + OTP (no passwords — OTP via MSG91)
- Optional: Google OAuth for faster login
- Guest profile: name, phone, email, nationality (for ID verification later)

**Guest dashboard at `/account`:**
- Upcoming bookings — dates, estate, balance due, pre-arrival link
- Past bookings — history, receipt download, review prompt
- Saved estates (wishlist)
- Edit profile

### 2.2 Booking Modification & Cancellation

Self-serve (within policy):
- Date change request — guest selects new dates, system checks availability, charges any difference
- Cancellation — current policy (non-refundable) enforced automatically; system shows clear warning before confirming
- Owner can override cancellation policy for exceptional cases from admin panel

### 2.3 Automated Pre-Arrival Sequence

Triggered automatically based on check-in date:

| Timing | Channel | Message |
|--------|---------|---------|
| Immediately on booking | Email + WhatsApp | Confirmation + pre-arrival page link |
| 7 days before check-in | WhatsApp | "Your stay is in 7 days — here's everything you need" |
| 3 days before | WhatsApp | Balance reminder (40% due at check-in) + caretaker number |
| Day of check-in (9 AM) | WhatsApp | "Check-in is today at 2 PM — safe travels" |
| Day of check-out | WhatsApp | "Hope you had a wonderful stay — share a review" + link |

### 2.4 Verified Reviews (Post-Stay Only)

Reviews are now unlocked automatically 24 hours after check-out:
- Guest receives WhatsApp + email with review link
- Review form shows the booking details pre-filled (property, dates)
- Submitted reviews enter the approval queue as before
- "Verified Stay" badge shown on approved reviews

**Quality Gate:**
- OTP login tested across telecom providers (Jio, Airtel, Vi)
- Booking modification with date availability conflict tested
- Automated message sequence tested end-to-end with real bookings

---

## Phase 3 — Dynamic Pricing + Revenue Tools
### Timeline: 4–6 weeks | Maximises revenue per property

### 3.1 Pricing Engine

Replace "On Request" with a real pricing model:

- **Base nightly rate** per property (set by owner)
- **Weekend premium** — Friday/Saturday auto +X%
- **Peak season pricing** — Dec 15–Jan 15, summer holidays — separate rate
- **Last-minute discount** — within 7 days of check-in, auto-reduce by X%
- **Long-stay discount** — 7+ nights, auto-reduce by X%
- **Minimum stay rules** — per season (e.g., min 2 nights on weekends, min 3 nights during peak)

Owner sets these rules once in the admin panel. The system applies them automatically.

### 3.2 Revenue Dashboard (Owner)

- Occupancy rate per property per month
- Revenue: confirmed vs. projected
- Average booking value
- Peak vs. off-peak nights sold
- Cancellation rate
- Top enquiry sources (organic, WhatsApp link, direct)

### 3.3 Balance Payment (Online)

Phase 1 collects 40% at check-in offline. Phase 3 brings it online:
- Guest receives a payment link 48 hours before check-in
- One-tap Razorpay payment for the balance
- Reduces cash handling at the estate entirely

**Quality Gate:**
- Dynamic pricing displays correctly across all date combinations
- Revenue dashboard tested with 3+ months of seeded booking data

---

## Phase 4 — Search, Filters & Discovery
### Timeline: 8–10 weeks | Required before adding more properties

Once there are 5+ properties, guests need to find what fits them — a flat list no longer works.

### 4.1 Search Bar

Homepage search: **Where** (location) + **When** (dates) + **Guests** → results page

- Location autocomplete: state, city, or region
- Dates → only shows properties available for that range
- Guest count → filters by capacity

### 4.2 Listings Page with Filters

`/estates/` becomes a real search results page:

**Filters:**
- Price range (per night)
- Number of bedrooms
- Location / region
- Amenities (pool, pet-friendly, Wi-Fi, bonfire, sea view, mountain view)
- Instant book only
- Minimum rating

**Sort:**
- Recommended (algorithm: rating × availability × price)
- Price: low to high / high to low
- Newest listings

### 4.3 Map View

Toggle between list view and map view — property pins on an India map, clickable to open the estate card. Essential for destination discovery ("show me all estates near Shimla").

### 4.4 Programmatic SEO

Auto-generated pages for every location + property type combination:
- `/estates/himachal-pradesh/` — all Himachal properties
- `/estates/goa/` — all Goa properties
- `/estates/villa/chail/` — villas in Chail
- `/estates/pet-friendly/` — all pet-friendly properties

These pages rank on Google for long-tail searches without any manual effort. At 50+ properties this becomes a significant organic traffic source.

**Quality Gate:**
- Search returns correct results for all filter combinations
- Map renders correctly on mobile
- Programmatic pages indexed in Google Search Console within 4 weeks of launch

---

## Phase 5 — Host Onboarding (Third-Party Properties)
### Timeline: 10–12 weeks | Unlocks platform scale

Until this phase, AnVira only lists its own properties. Phase 5 opens the platform to external hosts — this is the step that makes it a marketplace.

### 5.1 Host Application Flow

Public page at `/list-your-estate/`:
- Host submits: property name, location, type, bedrooms, contact
- AnVira team reviews and approves (manual curation preserved — no Airbnb-style self-listing)
- Approved hosts receive login credentials and onboarding call

### 5.2 Host Dashboard

At `/host/dashboard`:
- **Listing manager** — add/edit property details, photos, amenities, pricing rules
- **Calendar** — block dates, view bookings, iCal sync URL for Airbnb/Booking.com two-way sync
- **Booking inbox** — incoming booking requests, guest details, approve / decline (if request-to-book mode)
- **Revenue** — payout history, upcoming payouts, total earned
- **Reviews** — read and respond to guest reviews

### 5.3 Commission & Payout

- AnVira charges hosts X% platform commission (to be decided by owner)
- Razorpay escrow: guest payment held, commission deducted, net amount transferred to host within 24 hours of check-in
- Host must complete KYC (PAN + bank account) before first payout

### 5.4 Property Curation Standards

AnVira's differentiation is curation. Even as third-party hosts join:
- Every property reviewed in-person or via video walkthrough before listing
- Photography standards enforced (minimum 20 professional photos)
- Response time SLA: hosts must reply to enquiries within 4 hours
- Properties below 4.2 stars after 10 reviews are delisted

**Quality Gate:**
- End-to-end host onboarding tested with one real third-party property
- iCal two-way sync tested (book on AnVira → blocks on Airbnb, and vice versa)
- Commission calculation and payout verified with Razorpay

---

## Phase 6 — Trust, Safety & Compliance
### Timeline: 6–8 weeks | Required before significant scale

### 6.1 Guest ID Verification

- Upload Aadhaar / passport at booking time for stays above ₹25,000 advance
- Verified badge on guest profile
- ID stored encrypted, access restricted to property owner + AnVira admin

### 6.2 Damage Deposit

- Refundable deposit collected at booking alongside the advance
- Held in Razorpay escrow
- Released to guest within 72 hours of check-out if no damage reported
- Host can raise a damage claim within 48 hours of check-out; AnVira mediates

### 6.3 Fraud Detection

- Flag bookings with mismatched name/phone/device
- Block IPs with repeated failed payment attempts
- Rate limit review submissions and enquiry forms

### 6.4 GST Compliance

- Generate GST-compliant invoice for every booking (property SAC code 9963)
- Collect and remit TCS under Section 194-O if threshold crossed
- Annual report export for CA

### 6.5 Data & Privacy

- Guest data deletion on request (DPDP Act 2023 compliance)
- Data retention policy: booking records kept 7 years (GST requirement), personal data purged after 2 years post-stay
- Cookie consent banner (minimal — only essential cookies used)

---

## Phase 7 — Mobile App
### Timeline: 12–16 weeks | Builds long-term retention

### 7.1 Guest App (iOS + Android)

Built in React Native (shares logic with the Next.js web app):
- Browse, search, book, pay — full booking flow
- Push notifications for booking updates, check-in reminders, review requests
- Offline access to pre-arrival info (directions, caretaker contact) — critical in areas with poor signal
- Saved estates / wishlist
- Booking history + receipts

### 7.2 Host App

- New booking alerts (push notification)
- Calendar view — block/unblock dates on mobile
- Guest messaging
- Revenue snapshot

### 7.3 Return Guest Recognition

- Returning guest detected by phone number on login
- Personalised greeting: "Welcome back, [Name] — your last stay was Villa AnVira in March"
- Priority availability window: returning guests get 48-hour early access to new estate launches

---

## Phase 8 — Scale & Intelligence
### Timeline: Ongoing from Month 18

### 8.1 Demand-Based Dynamic Pricing

- Algorithm reads historical occupancy data and adjusts rates automatically
- Surge pricing for high-demand weekends
- Owner sets floor and ceiling; algorithm operates within that range

### 8.2 Personalisation

- Recommend estates based on past stays, search history, and guest profile
- "Guests like you also stayed at…" on estate pages
- Seasonal email campaigns to past guests: "Monsoon is the best time at Tarika's Seascapes — your dates from last year are open"

### 8.3 Channel Manager Integration

- One availability calendar synced across AnVira, Airbnb, Booking.com, VRBO
- Hosts manage all channels from the AnVira dashboard
- AnVira rates can be set lower than OTAs (direct booking advantage)

### 8.4 Analytics & Business Intelligence

- Property-level: occupancy %, revenue per available night (RevPAN), average lead time
- Platform-level: GMV, take rate, CAC, LTV, repeat booking rate
- Funnel analysis: where guests drop off (search → estate → booking → payment)

---

## Milestone Summary

| Phase | Key Unlock | Estimated Timeline |
|-------|-----------|-------------------|
| 0 — Pre-Build | Stack chosen, Razorpay KYC done, legal ready | Weeks 1–4 |
| 1 — Payments + Live Calendar | Guests can book and pay online | Weeks 5–14 |
| 2 — Guest Accounts | Booking management, verified reviews, automated messages | Weeks 15–22 |
| 3 — Dynamic Pricing | Revenue maximised per property | Weeks 23–28 |
| 4 — Search & Discovery | Platform ready for 5+ properties | Weeks 29–38 |
| 5 — Host Onboarding | Third-party properties can list | Weeks 39–50 |
| 6 — Trust & Compliance | Safe to operate at scale | Weeks 51–58 |
| 7 — Mobile App | Guest retention + offline access | Weeks 59–74 |
| 8 — Scale & Intelligence | Self-optimising platform | Month 18+ |

---

## Team Required

| Role | When Needed | Responsibility |
|------|------------|----------------|
| Full-stack developer (1) | Phase 1 | Next.js, Supabase, Razorpay integration |
| Full-stack developer (2) | Phase 4 | Search, maps, programmatic SEO |
| Designer (part-time) | Phase 1 onwards | Maintain design standard across new UI |
| DevOps / infra (part-time) | Phase 1 | Vercel, Supabase, backups, monitoring |
| Mobile developer | Phase 7 | React Native iOS + Android |
| Operations (part-time) | Phase 5 | Host onboarding, property curation, disputes |

---

## Budget Estimates (INR)

| Phase | Development | Tools / Services / Month | One-Time |
|-------|------------|--------------------------|---------|
| Phase 1 | ₹4–6L | ₹8–12K (Vercel + Supabase + MSG91) | ₹15K Razorpay setup |
| Phase 2 | ₹3–4L | ₹12–18K | — |
| Phase 3 | ₹2–3L | ₹18–25K | — |
| Phase 4 | ₹5–7L | ₹25–35K | — |
| Phase 5 | ₹8–12L | ₹35–50K | — |
| Phase 6 | ₹4–6L | ₹50–75K | ₹30K legal |
| Phase 7 | ₹12–18L | ₹75K+ | ₹50K App Store fees |
| **Total MVP (Ph 1–4)** | **₹14–20L** | — | — |
| **Full Platform (Ph 1–7)** | **₹38–56L** | — | — |

---

## What Stays the Same

Even as the platform grows, these elements of AnVira's current identity must be preserved:

- **Curation over volume** — 100 verified estates beats 10,000 unvetted ones
- **Design standard** — Bone, Brass, Cormorant — the luxury aesthetic is the brand
- **WhatsApp as the human layer** — always available alongside the automated flow
- **Direct booking advantage** — no OTA markup, ever
- **Response promise** — within 2 hours, 9am–9pm IST, even as volume grows

---

*AnVira — Est. 2018 — Built to last.*
