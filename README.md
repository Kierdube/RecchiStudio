# Recchi Studios

Next.js shop and marketing site with Prisma, Stripe checkout, admin tools, and optional Resend for contact notifications.

## Local development

1. Copy `.env.example` to `.env` and set variables. **PostgreSQL is required** (Neon, Supabase, Docker, etc.). If you previously used `file:./dev.db`, replace `DATABASE_URL` with a `postgresql://` URL before running Prisma.
2. Install and migrate:

   ```bash
   npm install
   npx prisma migrate deploy
   npm run db:seed
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. **Database** — Create a PostgreSQL database (e.g. [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), Neon, or Supabase). Copy the connection string; use `sslmode=require` if the provider expects it.

2. **Import the project** in the [Vercel dashboard](https://vercel.com/new) from your Git host.

3. **Environment variables** — In the project **Settings → Environment Variables**, add everything from `.env.example` for **Production** (and Preview if you use preview deployments):

   - `DATABASE_URL` — required for build and runtime (`npm run build` runs `prisma migrate deploy`).
   - `AUTH_SECRET` — at least 32 characters.
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — optional; if unset, only password is checked.
   - `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL` — set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://your-project.vercel.app`).
   - Resend keys if you use email notifications.

4. **Stripe webhook** — In the Stripe Dashboard, add an endpoint: `https://YOUR_DOMAIN/api/webhooks/stripe`, using the signing secret as `STRIPE_WEBHOOK_SECRET`.

5. **Seed data** — Migrations run on each deploy; seed does not. After the first successful deploy, run locally against production (or use a one-off script / Vercel CLI):

   ```bash
   DATABASE_URL="your-production-url" npm run db:seed
   ```

   Or run `npx prisma db seed` with the same `DATABASE_URL` in the environment.

The build command runs `prisma generate`, `prisma migrate deploy`, and `next build`. `postinstall` also runs `prisma generate` so the client is present after installs.
