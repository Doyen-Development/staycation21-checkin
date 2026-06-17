# Staycation21 — Guest Check-in Portal

Full-stack Next.js 14 application. Built by Stacklab Technologies.

## Free open-source stack

| Layer       | Service         | Free limit                        |
|-------------|-----------------|-----------------------------------|
| Frontend    | Next.js 14      | Open source                       |
| Hosting     | Vercel          | Unlimited, 100 GB bandwidth/month |
| Database    | Neon Postgres   | 0.5 GB, 100 compute-hours/month   |
| File upload | Uploadthing     | 2 GB storage, free tier           |
| Email       | Resend          | 3,000 emails/month                |
| Repo        | GitHub          | Unlimited private repos           |

## Setup

### 1. Neon (database)
1. Go to https://console.neon.tech → create account → New Project
2. Region: AWS Singapore (closest to India)
3. Copy the **Connection string** from the dashboard
4. Go to **SQL Editor** → paste and run `neon-schema.sql`

### 2. Uploadthing (file storage)
1. Go to https://uploadthing.com → create account → New App
2. Name it `staycation21`
3. Copy **Secret Key** and **App ID** from the dashboard

### 3. Resend (email)
1. Go to https://resend.com → create account
2. Add your domain OR use the sandbox for testing
3. Create an API key → copy it

### 4. GitHub + Vercel
1. Push this folder to a GitHub private repo
2. Go to https://vercel.com → New Project → import from GitHub
3. Add all env variables from `.env.local.example`
4. Deploy

## Env variables (add all to Vercel)

See `.env.local.example` for the full list.

## Admin panel

URL: `https://your-vercel-url.vercel.app/admin`
Password: whatever you set as `ADMIN_SECRET_TOKEN`

Features:
- Search by name, email, booking ID
- Filter by date range and status  
- Update guest status inline
- View uploaded ID documents
- Export CSV (daily / weekly / monthly / all time)

## File structure

```
src/
  app/
    page.tsx                     ← Check-in landing page
    admin/
      page.tsx                   ← Admin login
      dashboard/page.tsx         ← Admin dashboard
    api/
      checkin/route.ts           ← Save to Neon
      uploadthing/route.ts       ← File upload handler
      admin/route.ts             ← Admin data API
  components/
    ui/
      StepBar.tsx
      FileUpload.tsx
    forms/
      CheckinFlow.tsx            ← Orchestrator
      Step1Personal.tsx
      Step2Stay.tsx
      Step3Guests.tsx            ← Smart per-guest ID upload
      Step4Confirm.tsx
      SuccessScreen.tsx
  lib/
    db.ts                        ← Neon + Drizzle client
    schema.ts                    ← Database schema
    email.ts                     ← Resend templates
    csv.ts                       ← Export utility
    auth.ts                      ← Admin token helper
    uploadthing.ts               ← File router
  types/index.ts
neon-schema.sql                  ← Run once in Neon SQL editor
```

Built by Stacklab Technologies · Pune
