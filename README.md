# Da Hausa Initiative – MVP Website

## Tech Stack
- **Frontend**: Next.js 14 (App Router, TypeScript)
- **Hosting**: Netlify
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend (branded HTML templates)
- **Styling**: Tailwind CSS
- **Auth**: Cookie-based admin session

---

## Setup Instructions

### 1. Install

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (secret)
- `RESEND_API_KEY` — from resend.com
- `RESEND_FROM_EMAIL` — your verified sending email
- `ADMIN_SECRET` — long random string (this IS your admin password)
- `NEXT_PUBLIC_SITE_URL` — your live domain (https://dahausa.org)

### 3. Set Up Supabase

1. Create project at supabase.com
2. SQL Editor → run `supabase/schema.sql`
3. Storage → Create bucket named `media`, set to **Public**

### 4. Set Up Resend

1. Account at resend.com → add & verify your domain
2. Create API key → add to `.env.local`

### 5. Run

```bash
npm run dev
# Admin: http://localhost:3000/admin
```

---

## Admin Panel Guide

URL: `/admin` | Password: your `ADMIN_SECRET` value

| Feature | Location |
|---|---|
| Dashboard overview | `/admin/dashboard` |
| Edit Home page | `/admin/content/home` |
| Edit About page | `/admin/content/about` |
| Edit Programmes | `/admin/content/programmes` |
| Edit More page | `/admin/content/more` |
| Toggle/configure forms | `/admin/forms` |
| View subscribers | `/admin/subscribers` |
| Send newsletter | `/admin/email` |
| Site settings | `/admin/settings` |

---

## Deploy to Netlify

1. Push to GitHub
2. Connect repo in Netlify dashboard
3. Set all environment variables in Netlify → Site settings → Environment variables
4. Deploy — Netlify auto-detects Next.js via `@netlify/plugin-nextjs`

---

## Pages

| URL | Description |
|---|---|
| `/` | Home |
| `/about` | About DHI |
| `/programmes` | All programmes |
| `/apply` | Application forms |
| `/more` | Resources, newsletter, contact |
| `/admin` | Admin login |

---

## CMS System

Every piece of text, image, and list item on the site is editable from `/admin/content/[page]`. Content is stored as JSONB in Supabase and served server-side with 60s cache revalidation. Changes take effect within 60 seconds.

## Email System (Resend)

- **Welcome email** → sent automatically when someone subscribes
- **Contact notification** → sent to admin email when form submitted
- **Newsletter** → send to all active subscribers from `/admin/email`

All emails use DHI brand colours and layout.
