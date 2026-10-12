# صفاء محمد — موقع رسم الحنة

Landing page for Safaa Mohamed, a henna artist in Sadat City (Menoufia), with a dashboard where she
manages her own content. Built by [INBYTE](https://inbyte.dev).

- **Public page** (`/`): hero, about, services, gallery, packages and prices, reviews, areas,
  WhatsApp booking form, FAQ. Arabic, right to left, made for phones first. Sections with no
  content stay hidden.
- **Dashboard** (`/admin`): she signs in with email and password and edits the page texts and
  contacts, gallery photos, packages, reviews (screenshots or text), areas, services and FAQ.
  Photos are shrunk in the browser before upload. Every save refreshes the public page at once.

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, Supabase (Postgres, Auth, Storage).

The page is static and cached for an hour; `refreshSite()` in `app/admin/actions.ts` revalidates
it after each dashboard save. Without Supabase settings (local preview) it shows the sample
content in `lib/sample-content.ts`.

## Security

- Row level security: anyone may read visible rows; only users listed in `public.admins` may
  write (see `supabase/migrations`). The admin check lives in the `private` schema so it is not
  exposed through the API.
- Storage bucket `media` is public to read; uploads and deletes are admins only.

## Setup

1. Apply `supabase/migrations/*.sql` to the Supabase project (already done for the live project).
2. Copy `.env.example` to `.env.local` and fill in the values.
3. `npm install && npm run dev`

### Give Safaa access to the dashboard

1. Supabase → **Authentication → Users → Add user → Create new user**: her email and a password,
   with **Auto Confirm User** ticked.
2. Supabase → **SQL Editor**:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'her-email@example.com';
   ```
3. Supabase → **Authentication → Sign In / Providers → Email**: turn off **Allow new users to sign up**.
   (Even if someone signs up, they cannot change anything without a row in `admins`.)

## Scripts

`npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck`
