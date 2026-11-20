# Launch setup

## Current implementation

Sites continues to use its D1 binding. Vercel uses the same Worker request handler through `api/index.js` and the PostgreSQL adapter. The private `chemistry_atlas` schema is provisioned in the existing Supabase project. Each runtime needs its own application data migration or export/import before switching existing users to Vercel.

## Email delivery

Custom SMTP is still required. In Supabase Authentication → Email → SMTP, enter the provider's SMTP host, port, username, password, verified sender address and sender name. Keep email confirmation enabled. Disable link tracking in the provider.

In Authentication → URL Configuration, set the final site origin and add the exact `https://YOUR-HOST/account/callback` redirect. Confirm a registration and reset a password using an external mailbox, opening each link in the browser that requested it. Set `AUTH_EMAIL_READY=true` after successful delivery tests. Until then, registration and recovery explain that email setup is pending and visitors can use the demos.

## Vercel environment

- `DATABASE_URL` — Supabase transaction pooler connection URI, stored as a Vercel secret.
- `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` — existing project values.
- `SITE_AUTH_ORIGIN` — final HTTPS Vercel or custom-domain origin.
- `DEMO_SESSION_KEY` — a random server-side secret for demo sessions and watch receipts.
- `AUTH_EMAIL_READY` — `false` until email setup is verified.

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
