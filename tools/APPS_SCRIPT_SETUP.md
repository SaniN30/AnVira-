# AnVira — Enquiry/Waitlist/Review Logging Setup (Owner — one time, ~10 minutes)

The website logs every WhatsApp enquiry, waitlist signup, and (later) guest review
into a single Google Sheet you own. No servers, no cost. Until this is set up the
site works perfectly — logging is simply off.

## 1. Create the Google Sheet

1. Go to https://sheets.new and name it **AnVira — Guest Log**.
2. Create **3 tabs** (right-click the tab bar → name them exactly):

**Enquiries** — header row:
`Timestamp | Property | Check-in | Check-out | Guests | Name | Note | Status`

**Waitlist** — header row:
`Timestamp | Estate | Name | WhatsApp | Consent`

**Reviews** — header row:
`Timestamp | Property | Name | Phone | Occasion | Rating | Review | Status`

3. Copy the **Sheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_LONG_ID`**`/edit`

## 2. Deploy the Apps Script

1. In the Sheet: **Extensions → Apps Script**.
2. Delete the placeholder code; paste the full contents of `tools/apps-script.gs`.
3. Replace `PASTE_SHEET_ID_HERE` with your Sheet ID.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize when prompted, then copy the **Web app URL**
   (looks like `https://script.google.com/macros/s/AKfyc.../exec`).

## 3. Wire it into the website

In `assets/js/data.js`, set:

```js
const API_ENDPOINT = 'https://script.google.com/macros/s/AKfyc.../exec';
```

Then rebuild + deploy the site (`node tools/build-estates.mjs`).

## 4. Verify

Send a test enquiry from any estate page → a row appears in **Enquiries**
with Status `New`. Join a waitlist on /estates/ → a row appears in **Waitlist**.

## Daily use

- New enquiry rows arrive with Status **New** — change to `Replied` / `Booked` / `Lost` as you work them.
- When a coming-soon estate launches, filter the **Waitlist** tab by estate,
  copy the numbers into a WhatsApp Business broadcast list, and announce.
- Reviews (Phase 3) arrive as **Pending** — approve by copying into the site data.

## Return-guest CRM (Phase 6 — lightweight, sheet-native)

Add two columns to the **Enquiries** tab after Status:
`Returning? | Last Stay`

- When a name/number you recognise enquires again, mark **Returning? = Yes**
  and note their previous estate + month in **Last Stay**.
- Returning guests get priority on dates and a personal touch on arrival
  (the caretaker is told their name and last visit).
- To find repeats fast: Data → Create a filter → sort the Name column.

No software needed until volume demands it — this sheet *is* the CRM.
