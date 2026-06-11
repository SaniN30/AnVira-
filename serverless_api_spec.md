# AnVira — Serverless API Specification

Complete implementation guide for the 3 Next.js API routes that power AnVira's backend.

```
app/api/
├── log-enquiry/
│   └── route.ts        POST — logs WhatsApp enquiries to Google Sheets
├── reviews/
│   └── route.ts        POST — saves guest review submissions
└── waitlist/
    └── route.ts        POST — captures "Notify Me" signups
```

---

## One-Time Setup (Before Any API Works)

### 1. Create a Google Cloud Project

```
1. Go to https://console.cloud.google.com
2. Click "New Project" → name it "anvira-platform"
3. Select the project
4. Go to APIs & Services → Library
5. Search "Google Sheets API" → click Enable
```

### 2. Create a Service Account

```
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "Service Account"
3. Name: "anvira-sheets"
4. Role: None needed (we share the sheet directly)
5. Click "Done"
6. Click on the created service account
7. Go to "Keys" tab → "Add Key" → "Create New Key" → JSON
8. Download the JSON key file — you need two values from it:
   - client_email  (e.g., anvira-sheets@anvira-platform.iam.gserviceaccount.com)
   - private_key   (the long RSA key string)
```

### 3. Create the Google Sheet

Create a single Google Sheet with **3 tabs** (sheets):

**Tab 1 — "Enquiries"**
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H |
|---|---|---|---|---|---|---|---|
| Timestamp | Property | Check-in | Check-out | Guests | Name | Note | Status |

**Tab 2 — "Reviews"**
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H |
|---|---|---|---|---|---|---|---|
| Timestamp | Property | Name | Phone | Occasion | Rating | Review | Status |

**Tab 3 — "Waitlist"**
| Column A | Column B | Column C | Column D | Column E |
|---|---|---|---|---|
| Timestamp | Estate | Name | WhatsApp | Consent |

Then **share the sheet** with the service account email (`anvira-sheets@anvira-platform.iam.gserviceaccount.com`) — give it **Editor** access.

Copy the **Sheet ID** from the URL:
```
https://docs.google.com/spreadsheets/d/[THIS_IS_THE_SHEET_ID]/edit
```

### 4. Set Environment Variables

Add to `.env.local` (for local development) and to Vercel dashboard (for production):

```env
GOOGLE_SHEETS_CLIENT_EMAIL=anvira-sheets@anvira-platform.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBAD...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
```

> [!WARNING]
> The `GOOGLE_SHEETS_PRIVATE_KEY` value must have literal `\n` characters (not actual newlines) when stored in Vercel. The code handles the conversion with `.replace(/\\n/g, '\n')`.

### 5. Install the Google APIs Package

```bash
npm install googleapis
```

---

## Shared Utility: Google Sheets Client

Create this shared module that all 3 API routes will use.

### `lib/google-sheets.ts`

```typescript
import { google } from 'googleapis';

// Lazy-initialized client — created once, reused across invocations
let sheetsClient: ReturnType<typeof google.sheets> | null = null;

/**
 * Returns an authenticated Google Sheets client.
 * Uses the service account credentials from environment variables.
 * The client is cached in module scope for reuse across warm invocations.
 */
export function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

/**
 * Appends a single row to a specific tab in the AnVira Google Sheet.
 *
 * @param tab    - The sheet tab name (e.g., "Enquiries", "Reviews", "Waitlist")
 * @param values - Array of cell values for the row
 */
export async function appendRow(tab: string, values: (string | number | boolean)[]) {
  const sheets = getSheetsClient();
  const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;

  if (!sheetId) {
    throw new Error('GOOGLE_SHEETS_SHEET_ID is not configured');
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tab}!A:Z`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [values],
    },
  });
}

/**
 * Formats the current timestamp as a human-readable string for the sheet.
 * Example: "11 Jun 2026, 4:50 PM IST"
 */
export function timestamp(): string {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
```

---

## API Route 1: Log Enquiry

### Purpose
Silently logs every WhatsApp booking enquiry to the "Enquiries" tab of the Google Sheet. Fires in the background when the guest clicks "Send on WhatsApp" — the guest never waits for this to complete.

### File: `app/api/log-enquiry/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { appendRow, timestamp } from '@/lib/google-sheets';

// ─── Request Schema ─────────────────────────────────────────────

interface LogEnquiryBody {
  property: string;     // "Villa AnVira, Chail"
  checkIn: string;      // "2026-12-15"
  checkOut: string;     // "2026-12-18"
  guests: number;       // 6
  name: string;         // "Rohan"
  note?: string;        // "Anniversary celebration"
}

// ─── Validation ─────────────────────────────────────────────────

function validate(body: unknown): { valid: true; data: LogEnquiryBody } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body is required' };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.property !== 'string' || b.property.trim().length === 0) {
    return { valid: false, error: 'property is required' };
  }

  if (typeof b.checkIn !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.checkIn)) {
    return { valid: false, error: 'checkIn must be a valid date (YYYY-MM-DD)' };
  }

  if (typeof b.checkOut !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.checkOut)) {
    return { valid: false, error: 'checkOut must be a valid date (YYYY-MM-DD)' };
  }

  if (new Date(b.checkOut) <= new Date(b.checkIn)) {
    return { valid: false, error: 'checkOut must be after checkIn' };
  }

  if (typeof b.guests !== 'number' || b.guests < 1 || b.guests > 30) {
    return { valid: false, error: 'guests must be a number between 1 and 30' };
  }

  if (typeof b.name !== 'string' || b.name.trim().length < 2) {
    return { valid: false, error: 'name is required (min 2 characters)' };
  }

  return {
    valid: true,
    data: {
      property: b.property.trim(),
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      guests: b.guests,
      name: b.name.trim(),
      note: typeof b.note === 'string' ? b.note.trim() : undefined,
    },
  };
}

// ─── Format dates for the sheet ─────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Handler ────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(body);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const { data } = result;

    await appendRow('Enquiries', [
      timestamp(),                          // A: Timestamp
      data.property,                        // B: Property
      formatDate(data.checkIn),             // C: Check-in
      formatDate(data.checkOut),            // D: Check-out
      data.guests,                          // E: Guests
      data.name,                            // F: Name
      data.note || '',                      // G: Note
      'New',                                // H: Status
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[log-enquiry] Failed:', error);

    // Return 200 even on failure — the guest should never be impacted
    // The WhatsApp message is the primary channel; this log is supplementary
    return NextResponse.json(
      { success: false, error: 'Failed to log enquiry' },
      { status: 200 }
    );
  }
}
```

### How the Frontend Calls It

In `components/MessagePreviewCard.tsx`:
```typescript
function handleSendOnWhatsApp() {
  // 1. Fire the log API in the background — don't await it
  fetch('/api/log-enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      property: propertyName,
      checkIn,
      checkOut,
      guests,
      name,
      note: note || undefined,
    }),
  }).catch(() => {
    // Silently ignore — WhatsApp is the primary channel
  });

  // 2. Open WhatsApp immediately — don't wait for the API
  const message = buildWhatsAppMessage(propertyName, checkIn, checkOut, nights, guests, name, note);
  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    '_blank',
    'noopener,noreferrer'
  );
}
```

### Google Sheet Result

| Timestamp | Property | Check-in | Check-out | Guests | Name | Note | Status |
|---|---|---|---|---|---|---|---|
| 11 Jun 2026, 4:50 PM | Villa AnVira, Chail | 15 Dec 2026 | 18 Dec 2026 | 6 | Rohan | Anniversary celebration | New |
| 11 Jun 2026, 7:22 PM | Estate 10, New Delhi | 1 Jan 2027 | 3 Jan 2027 | 12 | The Kapoor Family | | New |

### Failure Behavior

| Scenario | What Happens |
|---|---|
| Google Sheets API is down | API returns `200` with `success: false`. Guest is unaffected — WhatsApp still opens. |
| Invalid request body | API returns `400` with validation error. Guest is unaffected — frontend fires this as fire-and-forget. |
| Missing env variables | API throws server error, logged to Vercel. Guest is unaffected. |
| Network timeout | Frontend `fetch` rejects silently via `.catch(() => {})`. Guest is unaffected. |

---

## API Route 2: Review Submission

### Purpose
Saves a post-stay guest review to the "Reviews" tab for owner approval. Called when the guest submits the review form at `/reviews/submit`.

### File: `app/api/reviews/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { appendRow, timestamp } from '@/lib/google-sheets';

// ─── Valid estate slugs (prevents arbitrary property submissions) ──

const VALID_SLUGS = [
  'villa-anvira-chail',
  'estate-10-delhi',
  'tarikas-seascapes-goa',
];

// ─── Valid occasion values ──────────────────────────────────────

const VALID_OCCASIONS = [
  'Anniversary',
  'Birthday',
  'Family Reunion',
  'Corporate Retreat',
  'Holiday',
  'Honeymoon',
  'Other',
];

// ─── Request Schema ─────────────────────────────────────────────

interface ReviewBody {
  property: string;     // "villa-anvira-chail" (slug)
  name: string;         // "Meera S."
  phone: string;        // "9876543210"
  occasion: string;     // "Anniversary"
  rating: number;       // 5
  review: string;       // "The silence at Villa AnVira..."
}

// ─── Validation ─────────────────────────────────────────────────

function validate(body: unknown): { valid: true; data: ReviewBody } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body is required' };
  }

  const b = body as Record<string, unknown>;

  // Property slug
  if (typeof b.property !== 'string' || !VALID_SLUGS.includes(b.property)) {
    return { valid: false, error: `property must be one of: ${VALID_SLUGS.join(', ')}` };
  }

  // Name
  if (typeof b.name !== 'string' || b.name.trim().length < 2 || b.name.trim().length > 100) {
    return { valid: false, error: 'name is required (2-100 characters)' };
  }

  // Phone — Indian mobile number
  if (typeof b.phone !== 'string' || !/^[6-9]\d{9}$/.test(b.phone.trim())) {
    return { valid: false, error: 'phone must be a valid 10-digit Indian mobile number' };
  }

  // Occasion
  if (typeof b.occasion !== 'string' || !VALID_OCCASIONS.includes(b.occasion)) {
    return { valid: false, error: `occasion must be one of: ${VALID_OCCASIONS.join(', ')}` };
  }

  // Rating
  if (typeof b.rating !== 'number' || !Number.isInteger(b.rating) || b.rating < 1 || b.rating > 5) {
    return { valid: false, error: 'rating must be an integer between 1 and 5' };
  }

  // Review text — word count check
  const reviewText = typeof b.review === 'string' ? b.review.trim() : '';
  const wordCount = reviewText.split(/\s+/).filter(Boolean).length;

  if (wordCount < 5) {
    return { valid: false, error: 'review must be at least 5 words' };
  }

  if (wordCount > 200) {
    return { valid: false, error: 'review must be 200 words or fewer' };
  }

  return {
    valid: true,
    data: {
      property: b.property,
      name: (b.name as string).trim(),
      phone: (b.phone as string).trim(),
      occasion: b.occasion,
      rating: b.rating,
      review: reviewText,
    },
  };
}

// ─── Slug → Display Name ────────────────────────────────────────

const SLUG_NAMES: Record<string, string> = {
  'villa-anvira-chail': 'Villa AnVira, Chail',
  'estate-10-delhi': 'Estate 10, New Delhi',
  'tarikas-seascapes-goa': "Tarika's Seascapes, Goa",
};

// ─── Handler ────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(body);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const { data } = result;

    await appendRow('Reviews', [
      timestamp(),                                // A: Timestamp
      SLUG_NAMES[data.property] || data.property, // B: Property (display name)
      data.name,                                  // C: Name
      data.phone,                                 // D: Phone
      data.occasion,                              // E: Occasion
      data.rating,                                // F: Rating
      data.review,                                // G: Review
      'Pending',                                  // H: Status
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[reviews] Failed:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}
```

### How the Frontend Calls It

In `app/reviews/submit/page.tsx`:
```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property, name, phone, occasion, rating, review }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setError(data.error || 'Something went wrong. Please try again.');
      return;
    }

    // Show success state
    setSubmitted(true);

  } catch {
    setError('Network error. Please check your connection and try again.');
  } finally {
    setSubmitting(false);
  }
}
```

> [!NOTE]
> Unlike the enquiry logger, this API call is **awaited** — the guest sees a loading state, then either a success confirmation or an error message. The review form is a deliberate action, not a background fire-and-forget.

### Google Sheet Result

| Timestamp | Property | Name | Phone | Occasion | Rating | Review | Status |
|---|---|---|---|---|---|---|---|
| 11 Jun 2026, 5:15 PM | Villa AnVira, Chail | Meera S. | 9876543210 | Anniversary | 5 | The silence at Villa AnVira was unlike anything... | Pending |

### Owner Approval Workflow

```
1. Owner opens the Google Sheet → "Reviews" tab
2. Reads the review in column G
3. If approved:
   a. Change column H from "Pending" to "Approved"
   b. Copy the review data into data/estates/villa-anvira-chail.json → reviews[]
   c. Push to Git → Vercel rebuilds → review appears on the live site
4. If rejected:
   a. Change column H to "Rejected"
   b. No further action needed
```

### Failure Behavior

| Scenario | What Happens |
|---|---|
| Invalid form data | Returns `400` with specific error message → shown to guest below the form |
| Google Sheets API down | Returns `500` with "Please try again" → guest can retry |
| Duplicate submission | Allowed — owner can de-duplicate in the sheet. No unique constraint needed at this volume. |

---

## API Route 3: Waitlist Capture

### Purpose
Saves a guest's name and WhatsApp number when they click "Notify Me" on a "Coming Soon" estate card. Used to send a WhatsApp broadcast when the estate goes live.

### File: `app/api/waitlist/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { appendRow, timestamp } from '@/lib/google-sheets';

// ─── Request Schema ─────────────────────────────────────────────

interface WaitlistBody {
  estate: string;       // "coming-soon-rajasthan"
  name: string;         // "Priya"
  whatsapp: string;     // "9876543210"
  consent: boolean;     // true
}

// ─── Validation ─────────────────────────────────────────────────

function validate(body: unknown): { valid: true; data: WaitlistBody } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body is required' };
  }

  const b = body as Record<string, unknown>;

  // Estate identifier
  if (typeof b.estate !== 'string' || b.estate.trim().length === 0) {
    return { valid: false, error: 'estate is required' };
  }

  // Name
  if (typeof b.name !== 'string' || b.name.trim().length < 2 || b.name.trim().length > 100) {
    return { valid: false, error: 'name is required (2-100 characters)' };
  }

  // WhatsApp number — Indian mobile
  if (typeof b.whatsapp !== 'string' || !/^[6-9]\d{9}$/.test(b.whatsapp.trim())) {
    return { valid: false, error: 'whatsapp must be a valid 10-digit Indian mobile number' };
  }

  // Consent — must explicitly be true
  if (b.consent !== true) {
    return { valid: false, error: 'consent must be true to join the waitlist' };
  }

  return {
    valid: true,
    data: {
      estate: (b.estate as string).trim(),
      name: (b.name as string).trim(),
      whatsapp: (b.whatsapp as string).trim(),
      consent: true,
    },
  };
}

// ─── Handler ────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(body);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const { data } = result;

    await appendRow('Waitlist', [
      timestamp(),                  // A: Timestamp
      data.estate,                  // B: Estate
      data.name,                    // C: Name
      `+91${data.whatsapp}`,        // D: WhatsApp (with country code)
      'Yes',                        // E: Consent
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[waitlist] Failed:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    );
  }
}
```

### How the Frontend Calls It

In `components/WaitlistModal.tsx`:
```typescript
async function handleJoinWaitlist(e: React.FormEvent) {
  e.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estate: estateSlug, name, whatsapp, consent }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setError(data.error || 'Something went wrong.');
      return;
    }

    // Show success state
    setJoined(true);

  } catch {
    setError('Network error. Please try again.');
  } finally {
    setSubmitting(false);
  }
}
```

### Google Sheet Result

| Timestamp | Estate | Name | WhatsApp | Consent |
|---|---|---|---|---|
| 11 Jun 2026, 6:30 PM | coming-soon-rajasthan | Priya | +919876543210 | Yes |
| 12 Jun 2026, 10:15 AM | coming-soon-rajasthan | Vikram | +919123456789 | Yes |

### Owner Broadcast Workflow

When the estate goes live:
```
1. Owner opens "Waitlist" tab
2. Filters column B for the estate that's launching
3. Copies all WhatsApp numbers from column D
4. Opens WhatsApp Business → Broadcast List → New List
5. Adds all numbers
6. Sends: "The wait is over. [Estate Name] is now open for enquiries.
   View the estate: https://anvira.in/estates/[slug]"
```

---

## Security & Rate Limiting

### Shared Middleware: `lib/rate-limit.ts`

A simple in-memory rate limiter to prevent abuse. Resets on cold starts (which is fine for this traffic volume).

```typescript
const ipCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple rate limiter — allows `maxRequests` per `windowMs` per IP.
 * Returns true if the request should be allowed, false if rate-limited.
 */
export function rateLimit(
  ip: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const record = ipCounts.get(ip);

  if (!record || now > record.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}
```

### Applying Rate Limiting to Each Route

Add this at the top of each handler:

```typescript
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Rate limit: 10 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (!rateLimit(ip, 10, 60_000)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  // ... rest of the handler
}
```

### CORS (Not Needed)

Since all API calls come from the same Next.js domain (same-origin), no CORS headers are needed. Next.js API routes automatically handle same-origin requests.

If you ever need to call these APIs from a different domain (e.g., a separate admin tool), add CORS headers:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://admin.anvira.in',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

### Input Sanitization

All three routes already sanitize inputs via:
- `.trim()` on all string values
- Regex validation on phone numbers and dates
- Whitelist validation on property slugs and occasion values
- Length limits on names and review text
- Type checking on all fields

No raw user input is ever executed, interpolated into queries, or rendered server-side — the only destination is a Google Sheets cell value.

---

## Testing

### Local Testing with cURL

**Test log-enquiry:**
```bash
curl -X POST http://localhost:3000/api/log-enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "property": "Villa AnVira, Chail",
    "checkIn": "2026-12-15",
    "checkOut": "2026-12-18",
    "guests": 6,
    "name": "Test User",
    "note": "Testing the API"
  }'
```

**Test reviews:**
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "property": "villa-anvira-chail",
    "name": "Test Reviewer",
    "phone": "9876543210",
    "occasion": "Holiday",
    "rating": 5,
    "review": "This is a test review to verify the API is working correctly and the data flows to Google Sheets."
  }'
```

**Test waitlist:**
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "estate": "coming-soon-rajasthan",
    "name": "Test Waitlister",
    "whatsapp": "9876543210",
    "consent": true
  }'
```

**Test validation errors:**
```bash
# Missing required fields
curl -X POST http://localhost:3000/api/log-enquiry \
  -H "Content-Type: application/json" \
  -d '{"property": "Villa AnVira"}'
# Expected: 400 { "success": false, "error": "checkIn must be a valid date (YYYY-MM-DD)" }

# Invalid phone number
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"property":"villa-anvira-chail","name":"Test","phone":"1234","occasion":"Holiday","rating":5,"review":"Testing the validation rules on the review submission API endpoint."}'
# Expected: 400 { "success": false, "error": "phone must be a valid 10-digit Indian mobile number" }

# Rate limit
for i in $(seq 1 12); do curl -s -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"estate":"test","name":"Spam","whatsapp":"9876543210","consent":true}'; done
# Expected: First 10 return success, last 2 return 429
```

### Verification Checklist

After running the tests, open the Google Sheet and verify:

- [ ] "Enquiries" tab has a new row with all 8 columns populated
- [ ] "Reviews" tab has a new row with Status = "Pending"
- [ ] "Waitlist" tab has a new row with WhatsApp formatted as "+91XXXXXXXXXX"
- [ ] Timestamps are in IST (Indian Standard Time)
- [ ] No extra/missing columns in any row

---

## File Summary

```
lib/
├── google-sheets.ts       # Shared: Sheets auth client + appendRow + timestamp
├── rate-limit.ts          # Shared: In-memory IP rate limiter
└── types.ts               # Shared: TypeScript interfaces (already exists)

app/api/
├── log-enquiry/
│   └── route.ts           # POST — fire-and-forget enquiry log (28 lines of logic)
├── reviews/
│   └── route.ts           # POST — review submission with validation (45 lines of logic)
└── waitlist/
    └── route.ts           # POST — waitlist signup (25 lines of logic)
```

**Total server-side code: ~200 lines across 5 files.**
**External dependency: 1 package (`googleapis`).**
**Infrastructure required: 0 servers.**

---

*AnVira Private Estates — Serverless API Specification, June 2026*
