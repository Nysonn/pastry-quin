# Pastry Quin Cake Runway — Technical Build Specification

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + Neon Postgres (Drizzle ORM)
**Purpose of this doc:** Single source of truth for the one-page marketing site, RSVP flow, and admin dashboard.

---

## 1. Project Summary

A premium **one-page** site for **Pastry Quin Cake Runway** — a **luxury showcase of cake artistry** presented by **Pastry Quin**, official partner **Baileys**.

- Venue: **White Cake Residence**
- Tagline: **"A Luxury Showcase of Cake Artistry"**
- Motto: **"Where cake becomes the moment."**

One visitor-facing conversion flow:
1. **RSVP** — attendees reserve a free place at the showcase (no payment, no capacity cap).

One internal tool:
2. **Admin dashboard** — the organizer logs in to view/manage/export RSVPs and edit event settings.

**Not in scope (removed deliberately):** vendor applications, wedding-themed content, and all secondary pages (About / Experiences / Baileys / Gallery / Vendors). Everything lives on the single home page.

The site reads like a fashion-house event program: editorial, restrained, high-craft. Copy is deliberately brief — the imagery and motion carry the luxury.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js App Router, Server Components by default |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `globals.css`) |
| Animation | Framer Motion (scroll reveals, 3D tilt, parallax, intro reveal) |
| DB | Neon Postgres via Drizzle ORM |
| Auth | Custom session auth, **admin only** — visitors never authenticate |
| Forms | React Hook Form + Zod (shared client/server validation) |
| Hosting | Vercel |
| Icons | lucide-react |

---

## 3. Design System

### Tokens (soft tropical palette)

```
colors:
  champagne #F3E5CB · ivory #FBF8F3 · cream #F6EFE3 · soft-beige #E9DCC3
  bronze #C1694F · rose-gold #C98A86 · charcoal #1B2B22 · gold #C9A15C
  emerald #0F4D3A · emerald-deep #0A3527 · sage #B7C9AD · coral #E2A893

fonts:
  display: Playfair Display · serif-alt: Cormorant Garamond · script: Great Vibes
  body: Inter · body-alt: Manrope
```

### Imagery

Two real event photos (Cloudinary), referenced in `lib/content.ts` → `IMAGES`:
- `heroCake` — hero + about + gallery
- `showpieceCake` — about + gallery + RSVP backdrop

### Signature element — the Cloche Reveal

First visit only (sessionStorage-gated): a full-screen charcoal scene with a
golden cloche dome over a tiered cake under a warm spotlight. Tapping lifts
the dome in 3D, sparkles rise, the title fades in, and the overlay dissolves
into the site. Respects `prefers-reduced-motion` (skips straight in).
Component: `components/marketing/ClocheIntro.tsx`.

### Motion

- Scroll: fade/upward reveals, staggered card grids (`components/ui/Reveal.tsx`).
- 3D: pointer-tracking tilt on cards/images (`components/ui/TiltCard.tsx`).
- Depth: scroll parallax on full-bleed images (`components/ui/ParallaxImage.tsx`).
- Countdown digits roll on change.
- Smooth anchor scrolling; all motion respects `prefers-reduced-motion`.

---

## 4. One-Page Structure (`app/(marketing)/page.tsx`)

1. **Cloche intro** (once per session, from the marketing layout)
2. **Hero** — parallax full-bleed photo, title, tagline, date/venue (from `event_settings`), partner line, `RSVP — It's Free` → `#rsvp`
3. **Countdown** to the event date
4. **The Showcase** (`#about`) — one short editorial paragraph + tilting photo
5. **The Evening** (`#highlights`) — six concise highlight cards (`HIGHLIGHTS` in `lib/content.ts`)
6. **Gallery** (`#gallery`) — the three photos, staggered editorial grid
7. **RSVP** (`#rsvp`) — four reasons + the RSVP form on a parallax backdrop; inline animated confirmation ("You're on the list")
8. **Footer** — anchors, contact, partner credit

Header nav uses anchor links (The Showcase / The Evening / Gallery) + gold **RSVP** button. Mobile: sticky bottom RSVP bar.

**Copy rule:** always "RSVP", never "Register". Keep copy short — one line per card, one paragraph per section.

---

## 5. Data

### Drizzle schema (`lib/db/schema.ts`)

- `event_settings` — single row: event name, tagline, date (drives countdown), venue, `registration_open` toggle.
- `registrations` — RSVPs: full name, email, phone, guest type, party size, hear-about-us, notes, status (`confirmed`/`cancelled`).
- `admin_users` — email + bcrypt hash.

Guest types (`lib/validation/registration.ts`): Cake Enthusiast, Cake Designer, Pastry Professional, Event Planner, Luxury Brand, Hospitality Professional, Food Lover, Lifestyle Influencer, Corporate Client, Media & Press.

> The old `vendor_applications` table is no longer referenced by the app; it can be dropped from the database whenever convenient.

### RSVP flow

1. Client validation (RHF + Zod) → POST `/api/registrations`.
2. Server re-validates, checks `registration_open`, inserts.
3. Success renders an inline animated confirmation in place of the form — no redirect, no email (the on-screen confirmation is the receipt).

---

## 6. Admin Dashboard (`/admin`)

- Login at `/admin/login` (session cookie; proxy guards `/admin` + `/api/admin`).
- **Overview** — RSVP count, total guests, days-to-event, latest RSVPs.
- **RSVPs** — searchable/filterable table, CSV export (`/api/admin/export?table=registrations`), confirm/cancel toggle.
- **Settings** — event name, tagline, date, venue, RSVP open/closed.

---

## 7. Confirmed Scope (current)

- One page only; no secondary routes besides `/admin`.
- No vendors, no wedding content, no payments, no capacity cap, no emails.
- Real event photography wired in via `lib/content.ts` — swap URLs there only.
