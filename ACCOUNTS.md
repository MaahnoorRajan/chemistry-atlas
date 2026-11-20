# Chemistry Atlas accounts

The Worker uses Supabase Auth for email and password, and D1 for classroom records. Configure the existing Supabase project with Email sign-in, email confirmation, and a working custom SMTP sender before inviting external users. In Supabase Auth URL Configuration, set the Site URL to the site origin and add its exact `/account/callback` URL. Keep link tracking disabled for auth emails. Open each confirmation or recovery link in the same browser that requested it.

Workers need `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SITE_AUTH_ORIGIN`. The existing `DEMO_SESSION_KEY` Worker secret signs account-bound video receipts. Keep it server-side. The accounts deployment requires D1 migration `0003_account_ownership`.

## Approving a teacher

Review the request and verify the teacher independently. The teacher must first register and verify their email. A trusted Supabase project administrator can then run this in SQL Editor, replacing the placeholder with the account UUID from **Authentication → Users**:

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
