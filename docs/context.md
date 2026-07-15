# Pastry Quin Cake Runway — Technical Build Specification

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + Supabase
**Purpose of this doc:** A single source of truth for a coding agent to build the marketing site, registration flow, vendor application flow, and admin dashboard end to end.

---

## 1. Project Summary

A premium single-event marketing site for **Pastry Quin Cake Runway**, presented by **Pastry Quin**, official partner **Bailey's Irish Cream**.

- Event date: **3rd August 2025**
- Venue: **White Cake Residence**
- Tagline: **"A Celebration of Cake Artistry"**

Two visitor-facing conversion flows:
1. **Guest registration** — attendees sign up to attend.
2. **Vendor application** — brands/vendors apply for a stand/partnership.

One internal tool:
3. **Admin dashboard** — the organizer logs in to view/manage/export registrations and vendor applications.

This is a brochure-style, editorial, high-craft site — not a generic SaaS landing page or a "wedding website." Design should read like Vogue Weddings / Dior Events / a fashion runway program, executed with restraint (see §5).

---

## 2. Tech Stack & Key Decisions

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ App Router | Server Components by default; Client Components only where interactivity/animation is needed |
| Language | TypeScript | strict mode on |
| Styling | Tailwind CSS | custom theme tokens (§5.1), no default indigo/blue |
| Animation | Framer Motion | used deliberately, not scattered (see §5.4) |
| Backend/DB | Supabase (Postgres) | also used for Auth + Storage |
| Auth | Supabase Auth (email/password or magic link) | **admin only** — public visitors never authenticate |
| Forms | React Hook Form + Zod | client + server-side validation |
| Email (optional but recommended) | Supabase Edge Function → Resend or similar | registration/vendor confirmation emails |
| Hosting | Vercel | pairs natively with Next.js |
| Icons | lucide-react | thin, elegant line icons match the aesthetic |

**Confirmed:** registration is free RSVP-style (no payment/ticketing), with **no hard capacity cap** — no waitlist logic needed. No confirmation emails for v1 (no Resend/email provider integration). Real event photography will be supplied later — build all image slots with placeholder images/CMS-friendly `next/image` components so real photos can be dropped in without touching layout code.

---

## 3. Environment & Project Setup

```
npx create-next-app@latest pastry-quin-cake-runway --typescript --tailwind --app
cd pastry-quin-cake-runway
npm install @supabase/supabase-js @supabase/ssr
npm install framer-motion react-hook-form zod @hookform/resolvers
npm install lucide-react
npm install date-fns
```

`.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only, never exposed to client
```

Use two Supabase clients:
- `lib/supabase/client.ts` — browser client (anon key)
- `lib/supabase/server.ts` — server client for Server Components/Route Handlers, using `@supabase/ssr`
- Admin-only writes (e.g., exporting data, deleting records) go through Route Handlers using the service role key — **never** expose the service role key to the browser.

---

## 4. Folder Structure

```
/app
  /(marketing)
    layout.tsx                 -- public layout: header, footer, envelope intro
    page.tsx                   -- Home
    /about/page.tsx
    /experiences/page.tsx       -- Featured Experiences
    /baileys/page.tsx           -- Bailey's Partnership + Pairing Experience
    /vendors/page.tsx           -- Vendor Opportunities + application form
    /gallery/page.tsx           -- Wedding Inspiration / Cake Installations gallery
    /register/page.tsx          -- Registration form
    /register/success/page.tsx
    /vendors/apply/success/page.tsx
  /admin
    layout.tsx                  -- protected layout (auth check)
    /login/page.tsx
    /dashboard/page.tsx         -- overview/stats
    /dashboard/registrations/page.tsx
    /dashboard/vendors/page.tsx
    /dashboard/settings/page.tsx -- event details, capacity, countdown target date
  /api
    /registrations/route.ts     -- POST create registration
    /vendors/route.ts           -- POST create vendor application
    /admin/export/route.ts      -- GET CSV export (service role)
/components
  /marketing
    Hero.tsx
    EnvelopeIntro.tsx
    CountdownTimer.tsx
    AboutSection.tsx
    WhyAttendCard.tsx
    FeaturedExperiences.tsx
    AudienceSection.tsx
    BaileysPartnership.tsx
    VendorOpportunities.tsx
    CTAButton.tsx
    SiteHeader.tsx
    SiteFooter.tsx
  /forms
    RegistrationForm.tsx
    VendorApplicationForm.tsx
  /admin
    DataTable.tsx
    StatCard.tsx
    AdminSidebar.tsx
  /ui                            -- shared primitives (Button, Card, Input, Badge...)
/lib
  /supabase/client.ts
  /supabase/server.ts
  /validation/registration.ts    -- zod schemas
  /validation/vendor.ts
  /utils
/types
  database.ts                    -- generated Supabase types
```

---

## 5. Design System

### 5.1 Tokens (Tailwind theme extension)

```
colors:
  champagne:   #F3E5CB
  ivory:       #FBF8F3
  cream:       #F6EFE3
  soft-beige:  #E9DCC3
  bronze:      #A9793B
  rose-gold:   #B76E79
  charcoal:    #2A211A   (near-black, warm, for typography — avoid pure #000)
  gold:        #C9A15C   (accent, CTAs, dividers, shimmer)

fonts:
  display: 'Playfair Display', serif      -- H1/H2, hero title
  serif-alt: 'Cormorant Garamond', serif  -- eyebrow/quote/accents
  body: 'Inter', sans-serif               -- default body
  body-alt: 'Manrope', sans-serif         -- UI labels, buttons, forms
```

Avoid bright/saturated colors entirely. All shadows warm-toned (no cool grey shadows). Border radius: generous but not bubbly (`rounded-2xl` on cards, `rounded-full` on pills/buttons only).

### 5.2 Signature element

The **wax-seal envelope intro** (already specified by the client) is the one bold, memorable moment: full-screen ivory/champagne backdrop, a pulsing gold wax seal with "PQ" monogram, tap/click to peel the flap, invitation card lifts out, fades into the site. This should be the *only* large choreographed entrance moment — don't compete with it elsewhere. Store a session flag (e.g., `sessionStorage` equivalent via React state, not literal localStorage per environment constraints if built as an artifact — in the actual Next.js app, `sessionStorage` is fine) so it only plays once per visit, not on every route change.

### 5.3 Layout language

Editorial magazine grid: generous whitespace, large full-bleed photography, pull-quote style section intros, thin gold hairline dividers between sections instead of hard borders. Numbered markers (01/02/03) only where the content is genuinely sequential (e.g., "How registration works," "The Bailey's tasting flight" steps) — not for Featured Experiences, which is a set, not a sequence.

### 5.4 Motion

Keep it restrained and purposeful, not scattered:
- Page load: envelope intro only (once).
- Scroll: fade + slight upward reveal on section entry (Framer Motion `whileInView`), staggered children for card grids.
- Hover: subtle lift + gold shimmer sweep on buttons/cards, no bouncy easing.
- Countdown timer: numbers roll/flip on change, not just re-render.
- Respect `prefers-reduced-motion`.

### 5.5 Copy tone

Written from the guest's side of the screen: describe what they'll experience ("Taste Bailey's signature pairings"), not internal event-ops language. Buttons say exactly what happens: "Register Now," "Apply as a Vendor," "View Event Details" — and the destination/confirmation echoes the same verb ("You're Registered" not "Submission received").

---

## 6. Pages & Content Mapping

### Home (`/`)
1. Envelope intro overlay (once per session)
2. **Hero** — full-bleed editorial photo, event title, tagline, date, venue, "Presented by Pastry Quin" / "Official Partner Bailey's Irish Cream", CTA row: Register Now / Become a Vendor / View Event Details
3. **Countdown timer** to 3 Aug 2025 (pulls target date from `event_settings` table, not hardcoded, so admin can change it)
4. **About the Event** — editorial layout, large imagery, event description
5. **Why Attend** — info cards (8 items from brochure)
6. **Featured Experiences** — 10 items, card grid
7. **Perfect For (Audience)** — icon + label grid (10 audience types)
8. **Bailey's Partnership** teaser → links to `/baileys`
9. **Vendor Opportunities** teaser → links to `/vendors`
10. Footer with social, contact, partner logos

### `/about`
Extended About content if Home version is a teaser.

### `/experiences`
Full Featured Experiences gallery with larger imagery per item.

### `/baileys`
Bailey's Partnership deep dive + Cake Pairing Experience cards (5 items from brochure).

### `/gallery`
Photography from cake installations, styling displays, wedding inspiration — treat as a lightbox-style editorial gallery.

### `/vendors`
Vendor Opportunities content (11 target vendor types + benefits) + embedded `VendorApplicationForm`.

### `/register`
`RegistrationForm` → on submit, insert into `registrations`, redirect to `/register/success`.

---

## 7. Supabase Schema

```sql
-- Event configuration (single row, editable by admin — powers countdown, capacity, venue text)
create table event_settings (
  id uuid primary key default gen_random_uuid(),
  event_name text not null default 'Pastry Quin Cake Runway',
  tagline text not null default 'A Celebration of Cake Artistry',
  event_date timestamptz not null,
  venue text not null default 'White Cake Residence',
  registration_open boolean not null default true,   -- admin can close registration when ready
  updated_at timestamptz not null default now()
);

-- Guest registrations
create table registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  guest_type text,                 -- e.g. Bride, Groom, Planner, Influencer, Corporate... (from Audience section)
  number_of_guests int not null default 1,
  hear_about_us text,
  notes text,
  status text not null default 'confirmed',  -- confirmed | cancelled
  created_at timestamptz not null default now()
);

create index on registrations (email);
create index on registrations (created_at);

-- Vendor applications
create table vendor_applications (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  vendor_category text not null,   -- Cake Designer, Pastry Chef, Florist, Photographer, etc.
  website_or_instagram text,
  message text,
  status text not null default 'pending',   -- pending | approved | rejected
  created_at timestamptz not null default now()
);

create index on vendor_applications (status);
create index on vendor_applications (created_at);

-- Admin users are managed via Supabase Auth (auth.users). Optional profile table:
create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin'
);
```

### Row Level Security (critical)

```sql
alter table registrations enable row level security;
alter table vendor_applications enable row level security;
alter table event_settings enable row level security;

-- Public can INSERT only (no read/update/delete) — registration + vendor forms are anonymous
create policy "public can insert registrations"
  on registrations for insert
  to anon
  with check (true);

create policy "public can insert vendor applications"
  on vendor_applications for insert
  to anon
  with check (true);

-- Public can read event_settings (for countdown/capacity display) but not write
create policy "public can read event settings"
  on event_settings for select
  to anon
  using (true);

-- Authenticated admins can do everything
create policy "admins full access registrations"
  on registrations for all
  to authenticated
  using (true) with check (true);

create policy "admins full access vendor applications"
  on vendor_applications for all
  to authenticated
  using (true) with check (true);

create policy "admins full access event settings"
  on event_settings for all
  to authenticated
  using (true) with check (true);
```

This ensures anonymous visitors can only *create* registrations/applications, never read the list — that data is only visible via the authenticated admin dashboard.

---

## 8. Registration & Vendor Forms

### Validation (Zod, shared client+server)

```ts
// lib/validation/registration.ts
export const registrationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  guestType: z.enum([
    "Bride", "Groom", "Wedding Planner", "Cake Designer", "Event Planner",
    "Luxury Brand", "Hospitality Professional", "Food Lover",
    "Lifestyle Influencer", "Corporate Client"
  ]),
  numberOfGuests: z.number().int().min(1).max(10),
  hearAboutUs: z.string().optional(),
  notes: z.string().max(500).optional(),
});
```

```ts
// lib/validation/vendor.ts
export const vendorSchema = z.object({
  businessName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  vendorCategory: z.enum([
    "Cake Designer", "Pastry Chef", "Wedding Decor Company", "Florist",
    "Photographer", "Bridal Designer", "Jewelry Brand", "Luxury Hotel",
    "Event Planner", "Beverage Company", "Lifestyle Brand"
  ]),
  websiteOrInstagram: z.string().optional(),
  message: z.string().max(1000).optional(),
});
```

### Flow
1. Client-side validation via `react-hook-form` + `zodResolver`.
2. POST to `/api/registrations` or `/api/vendors` (Route Handler) — re-validate server-side, then `supabase.from(...).insert(...)` using the anon client (RLS insert policy allows this). Check `event_settings.registration_open` server-side first; if closed, return a clear message rather than inserting.
3. On success: redirect to a confirmation page that echoes their action ("You're Registered for Pastry Quin Cake Runway"). No email is sent for v1 — the confirmation page is the only receipt, so make sure it clearly states what happens next (e.g. "We'll be in touch with event details closer to the date").
4. Errors: specific and actionable ("That email looks incomplete" not "Invalid input").

---

## 9. Admin Dashboard

### Auth
- `/admin/login` — Supabase Auth email/password sign-in.
- `/admin` layout checks session server-side (via `@supabase/ssr` server client); redirect to `/admin/login` if no session.
- No public sign-up route for admin — admin accounts are created directly in the Supabase dashboard or via an invite-only server action.

### Pages
- **Dashboard overview**: stat cards — total registrations, total guests (sum of `number_of_guests`), vendor applications by status, days until event.
- **Registrations table**: sortable/filterable (by guest type, status, date), search by name/email, CSV export button (calls `/api/admin/export`), inline status change (confirmed/cancelled).
- **Vendor applications table**: same pattern, with approve/reject actions.
- **Settings**: edit `event_settings` row — event date (drives countdown), venue text, toggle registration open/closed.

### CSV Export
Route Handler using the **service role key** (server-only), streams a CSV of the requested table. Gate behind the authenticated admin check.

---

## 10. Content Inventory (from brochure — use as real copy source)

**Why Attend (8):** Discover luxury cakes · Meet top cake artists · Experience runway cake presentations · Network with wedding vendors · Taste premium desserts · Discover wedding inspiration · Experience Bailey's tasting lounge · Capture beautiful photo moments

**Featured Experiences (10):** Luxury Cake Runway · Cake Installations · Wedding Inspiration Gallery · Dessert Showcase · Bailey's Experience Lounge · Live Demonstrations · Networking Lounge · Photo Booth · Luxury Styling Displays · Vendor Marketplace

**Audience (10):** Brides · Grooms · Wedding Planners · Cake Designers · Event Planners · Luxury Brands · Hospitality Professionals · Food Lovers · Lifestyle Influencers · Corporate Clients

**Bailey's Cake Pairing Experience (5):** Luxury cake pairings · Dessert tasting · Signature cocktails · Premium dessert stations · Interactive tasting sessions

**Vendor Targets (11):** Cake Designers · Pastry Chefs · Wedding Decor Companies · Florists · Photographers · Bridal Designers · Jewelry Brands · Luxury Hotels · Event Planners · Beverage Companies · Lifestyle Brands

---

## 11. Build Order (recommended for the coding agent)

1. Scaffold Next.js + Tailwind + design tokens (§5.1) — get typography/colors right first, in a style guide page if useful.
2. Supabase project: run schema + RLS (§7), generate types (`supabase gen types typescript`).
3. Static marketing pages using `next/image` with clearly-labeled placeholder assets in every photo slot (hero, gallery, experience cards, Bailey's section) — structure components so a real image only needs to replace a file/URL, no layout changes needed once real photography arrives.
4. Registration + Vendor forms wired to Supabase (§8) — this is the core conversion path, prioritize before animation polish.
5. Admin auth + dashboard (§9) — organizer needs to see submissions immediately.
6. Framer Motion pass (§5.4) + the envelope intro (§5.2) last, since it's pure polish on top of a working, data-complete site.

---

## 12. Confirmed Scope Decisions (v1)

- **No payments** — registration is free, RSVP-style.
- **No capacity cap / waitlist** — every valid registration is accepted (`status: confirmed`); admin can still close registration entirely via the `registration_open` toggle.
- **No confirmation emails** — the on-screen confirmation page is the only receipt for both guests and vendors.
- **Placeholder imagery for now** — real photography to be supplied later and dropped into existing `next/image` slots.

Still open, worth confirming before deployment: hosting target (Vercel assumed) and domain name.