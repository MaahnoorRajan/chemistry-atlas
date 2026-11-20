# Chemistry Atlas accounts

The production application uses Google sign-in through Supabase Auth and PostgreSQL for classroom records. `AUTH_MODE=google` disables email/password signup and recovery in the current application. No custom SMTP provider is required. The server uses PKCE, exchanges the callback code, and manages secure, HttpOnly session cookies. Google credentials belong in Supabase's provider settings.

The production runtime needs `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, and a server-side `DEMO_SESSION_KEY`. Configure the canonical `SITE_AUTH_ORIGIN` when applicable and allowlist its exact `/account/callback` URL in Supabase. The local server uses `.local/atlas.sqlite`, while the earlier Sites runtime uses D1. See [LAUNCH.md](LAUNCH.md) for deployment details.

## Approving a teacher

Selecting Teacher requests access; it never grants teacher privileges automatically. Once the verified site owner has been bootstrapped as an administrator using [LAUNCH.md](LAUNCH.md), they can review requests under Account → Teacher approvals. The protected `teacher-approval` Edge Function validates the administrator and applicant before updating trusted account metadata. User-editable metadata never grants privileges.

Review each request and verify the teacher independently. If an administrator must perform a manual fallback, a trusted Supabase project administrator can run the following with the verified teacher's UUID from **Authentication → Users**:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"chemistry_atlas_role":"teacher"}'::jsonb
where id = '00000000-0000-0000-0000-000000000000'
  and email_confirmed_at is not null
returning id;
```

The teacher signs in via the Teacher option. To revoke teacher privileges, remove the `chemistry_atlas_role` key for that specific user. The Worker checks the current account metadata before granting teacher access.

The ownership migration retains earlier demo classroom rows. Those rows have no verified owner and are excluded from account-based access.

## Visitor demos

Teacher Demo and Student Demo require no credentials. Signed, HttpOnly cookies identify each visitor's isolated workspace. Demo records use separate tables, and sessions expire after three hours. Switching demo roles preserves the sample workspace. Exiting the demo restores an underlying real account when one exists.
