# Pastry Quin Cake Runway

A premium single-event marketing site for **Pastry Quin Cake Runway** — *A Celebration of Cake Artistry* — presented by Pastry Quin, official beverage partner Baileys Irish Cream, at White Cake Residence.

**Live goals:** get guests to register (free RSVP) and get vendors to apply — with an admin dashboard for the organizer to manage both.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), TypeScript strict |
| Styling | Tailwind CSS v4 (custom champagne/gold/charcoal theme tokens) |
| Animation | Framer Motion (envelope intro, scroll reveals, rolling countdown — respects `prefers-reduced-motion`) |
| Database | Neon Serverless Postgres via Drizzle ORM (`@neondatabase/serverless` HTTP driver) |
| Forms & validation | React Hook Form + Zod (validated on client **and** server) |
| Auth (admin only) | bcrypt password check + HS256 JWT session in an `httpOnly` cookie (jose) |
| Fonts | Playfair Display · Cormorant Garamond · Inter · Manrope via `next/font` |
| Icons | lucide-react |
| Hosting | Vercel (`vercel.json` included) |

## Routes

| Area | Route(s) |
|---|---|
| Marketing | `/` · `/about` · `/experiences` · `/baileys` · `/gallery` · `/vendors` |
| Guest registration | `/register` → `/register/success` |
| Vendor application | `/vendors#apply` → `/vendors/apply/success` |
| Admin | `/admin/login` · `/admin/dashboard` (overview) · `…/registrations` · `…/vendors` · `…/settings` |
| API | `POST /api/registrations` · `POST /api/vendors` · `GET /api/admin/export?table=registrations\|vendors` (auth required) |

Signature touches: wax-seal **envelope intro** (once per session), database-driven **countdown timer**, lightbox gallery, mobile sticky register bar, dark editorial footer, crown favicon.

## Admin dashboard

The admin section shows **everyone who has signed up** and every vendor application:

- **Overview** — total registrations, total guests, vendor applications by status, days until the event, latest activity.
- **Registrations** — search by name/email, filter by guest type and status, cancel/reconfirm, CSV export.
- **Vendors** — search, filter by category/status, approve/reject/mark pending, CSV export.
- **Settings** — event name, tagline, date & time (drives the public countdown), venue, and a toggle to open/close registration.

## Getting started (local)

```bash
npm install
cp .env.example .env.local    # fill in the values below
npm run db:push               # create tables in Neon
npm run db:seed               # seed event settings + admin user
npm run dev                   # http://localhost:3000
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon Postgres connection string (use the **pooled** endpoint) |
| `SESSION_SECRET` | ✅ | 64-char hex secret for signing admin JWTs — `openssl rand -hex 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | optional | Override the seeded admin account |

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run db:push` | Push `lib/db/schema.ts` to Neon (drizzle-kit) |
| `npm run db:seed` | Seed `event_settings` + admin user (idempotent) |

> **Troubleshooting:** if DB commands fail with `ETIMEDOUT` on slow networks, prefix them with
> `NODE_OPTIONS=--network-family-autoselection-attempt-timeout=5000`. This never affects Vercel.

## Security & secrets

- **`.env*` files are gitignored** (only `.env.example`, which contains no values, is committed). Never commit `DATABASE_URL`, `SESSION_SECRET`, or real admin credentials.
- If the database URL or admin password has ever been shared outside the team (e.g. in a chat), **rotate it**: reset the Neon role password in the Neon console and update `DATABASE_URL` everywhere.
- Passwords are stored bcrypt-hashed (cost 12); sessions are `httpOnly`, `sameSite=lax`, `secure` in production.
- Public API routes only allow *inserting* a registration/application — nothing on the public site can read the guest list.
- `vercel.json` adds `X-Frame-Options: DENY`, `nosniff` and a strict referrer policy.

## Deploying to Vercel

1. Push to GitHub (double-check `git status` shows no `.env*` files) and import the repo in Vercel — Next.js is auto-detected; `vercel.json` pins the `iad1` region next to the Neon database.
2. In **Project → Settings → Environment Variables**, add `DATABASE_URL` and `SESSION_SECRET` (use a **different** secret than local) for Production and Preview.
3. Deploy. The schema is already pushed and seeded — no build-time DB step needed.
4. After the first deploy, log in at `/admin/login` and change the admin credentials.

## Database schema

Defined in `lib/db/schema.ts` (Drizzle):

| Table | Purpose |
|---|---|
| `event_settings` | Single row: event name, tagline, date (drives countdown), venue, registration open/closed — editable in Admin → Settings |
| `registrations` | Guest RSVPs — `confirmed` / `cancelled`; free, no capacity cap |
| `vendor_applications` | Vendor applications — `pending` / `approved` / `rejected` |
| `admin_users` | Admin accounts (bcrypt password hashes) |

## Project structure

```
app/
  (marketing)/          public pages + layout (header, footer, envelope intro)
  admin/login/          admin sign-in (server action)
  admin/dashboard/      protected layout, overview, registrations, vendors, settings
  api/                  registrations, vendors, admin CSV export
components/
  marketing/  forms/  admin/  ui/
lib/
  db/                   Drizzle client, schema, queries
  auth/session.ts       JWT session helpers
  validation/           Zod schemas (shared client + server)
  content.ts            all copy + image URLs (single place to edit)
proxy.ts                route protection for /admin and /api/admin
scripts/seed.ts         idempotent seeder
```

## Replacing the placeholder images

All imagery is centralized in `lib/content.ts` (`IMAGES` and `GALLERY`). Swap the Cloudinary URLs for the real event photography — no layout changes needed. If the new images live on another host, add it to `images.remotePatterns` in `next.config.ts`. The favicon is `app/icon.png` (crown), source copy in `public/crown.png`.

## Confirmed v1 scope

- Free RSVP registration — no payments, no capacity cap, no waitlist
- No confirmation emails — the on-screen success page is the receipt
- Placeholder imagery until real photography is supplied
- Event date seeded as **3 August 2026** (the brochure's 2025 date has passed) — change it any time in Admin → Settings
