# Launch setup

## Current implementation

Sites continues to use its D1 binding. Vercel uses the same Worker request handler through `api/index.js` and the PostgreSQL adapter. The private `chemistry_atlas` schema is provisioned in the existing Supabase project. Each runtime needs its own application data migration or export/import before switching existing users to Vercel.

## Google sign-in

The visitor sign-in screen now uses Google. Set `AUTH_MODE=google` on Sites and Vercel. The teacher and student demos remain available while the provider is configured.

1. In Google Cloud, create a project named Chemistry Atlas.
2. In Google Auth Platform, configure Branding with the app name, support email and developer email. Choose External audience. Add the owner's Google account as a test user while the app is in Testing.
3. Configure only OpenID, email and profile scopes.
4. Create a Web application OAuth client.
5. Add the current website origin as an authorized JavaScript origin:
   `https://khimiya-sabagy-kg.hushedsaffron2.chatgpt.site`
6. Add this Google authorized redirect URI:
   `https://gjdimdafxyobsnzuvthz.supabase.co/auth/v1/callback`
7. Copy the Client ID and Client Secret directly into Supabase Authentication → Sign In / Providers → Google, enable the provider and save.
8. Keep the website's own `/account/callback` URL in Supabase's redirect allowlist. Add the final Chemistry Atlas Vercel origin after deployment.

The Google redirect URI above belongs to Supabase. Supabase then redirects the user to the website callback. The application uses PKCE and server-side cookies. A teacher request requires administrator approval before teacher access is granted. Google sign-in is enabled in Supabase. The Google Cloud project is `chemistry-atlas` and the Web OAuth client is named Chemistry Atlas Web. Credentials are stored in Supabase provider settings. On November 20, 2026, the owner completed live Google sign-in, session persistence after refresh, profile save, logout, and returning-user login on the published site. The Google app is External / In production as of November 20, 2026, with public Google sign-in explicitly approved by the owner. Production and localhost callbacks are allowlisted in Supabase.

## Optional email delivery

Custom SMTP is only required if email-based signup or password recovery is re-enabled. The current Google-only release does not require SMTP. In Supabase Authentication → Email → SMTP, enter the provider's SMTP host, port, username, password, verified sender address and sender name. Keep email confirmation enabled. Disable link tracking in the provider.

In Authentication → URL Configuration, set the final site origin and add the exact `https://YOUR-HOST/account/callback` redirect. Confirm a registration and reset a password using an external mailbox, opening each link in the browser that requested it. Set `AUTH_EMAIL_READY=true` after successful delivery tests. Until then, registration and recovery explain that email setup is pending and visitors can use the demos.

## Vercel environment

The Vercel project is `maahnoorrajan12-9546/chemistry-atlas`, on the Hobby plan, connected to the private GitHub repository. Its database connection uses the transaction pooler and the dedicated `atlas_vercel` role. A live connection check verified application-table access; this role cannot read `auth.users` and has no superuser, role-creation, database-creation, or RLS-bypass privileges. Existing legacy sample records (one assignment and two submissions) were copied to PostgreSQL.

- `DATABASE_URL` — Supabase transaction pooler connection URI, stored as a Vercel secret.
- `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` — existing project values.
- `SITE_AUTH_ORIGIN` — final HTTPS Vercel or custom-domain origin.
- `DEMO_SESSION_KEY` — a random server-side secret for demo sessions and watch receipts.
- `AUTH_EMAIL_READY` — `false` until email setup is verified.
- `AUTH_MODE` — `google` for this release.

The lockfile pins the database dependency. Use Node.js 24 and the committed Vercel configuration. Run `npm ci` and `npm run build`. The PostgreSQL schema is tracked in `postgres/schema.sql` for a new database. The current Supabase project's schema is already provisioned, so do not rerun that bootstrap against it.

## First administrator

After the site owner's email account has been verified, a Supabase project owner grants that specific account administration once:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"chemistry_atlas_admin":true}'::jsonb
where id = 'THE_VERIFIED_OWNER_ACCOUNT_UUID'
  and email_confirmed_at is not null;
```

The owner can then open Account → Teacher approvals. Teacher applicants can request access from their account. Approval calls the deployed `teacher-approval` Supabase Edge Function. It verifies the administrator token, preserves existing account metadata, and grants teacher access only to a confirmed applicant. Teacher requests and decisions remain in the application database.

## Lesson sheets

Each of the 18 lesson pages offers an HTML lesson sheet in Kyrgyz, Russian and English. The sheet includes materials, safety, procedure, a blank observation table, five questions and credits. It can be opened offline or printed to PDF.

## Verification limits

Watching is enforced using a trusted duration, elapsed server time and the player's progress checks. A browser cannot establish human attention. Existing external video availability and subtitle coverage depend on their publishers.

## Verified Vercel release — November 20, 2026

Production URL: https://chemistry-atlas-delta.vercel.app

Supabase Site URL points to this origin. Its exact /account/callback redirect and http://localhost:3000/account/callback are allowlisted, alongside the earlier Sites callback. The Google app homepage, privacy link and terms link point to the Vercel origin. Google Audience shows In production.

Live checks passed for Google returning-user sign-in, teacher and student demos, PostgreSQL notebook saves, three-language page responses, public privacy and terms pages, persistent demo assignment creation, separate visitor-workspace isolation, unauthenticated API rejection and CSRF rejection. The local fixture suite also verifies all 18 quiz flows. A second real Google identity and a complete 696-second video run were not repeated during this deployment check.