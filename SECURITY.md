# Security reports

Please report suspected vulnerabilities privately to **maahnoor.rajan12@gmail.com**. Include the affected feature and reproduction steps using synthetic data. Do not post credentials, student records, or exploit details in public issues.

## Implemented boundaries

- Google OAuth with PKCE and secure, HttpOnly session cookies.
- Teacher/admin authorization based on trusted account metadata.
- Role and ownership/enrollment checks on classroom operations.
- A restricted PostgreSQL login for the private application schema, without access to `auth.users`.
- Separate demo records and isolated visitor workspaces.
- Origin checks on state-changing requests and signed video-completion receipts.

These describe implementation properties, not an independent security audit. Video-completion controls cannot prove human attention.

Keep `.env.local`, `.local/`, `.vercel/`, runtime credentials, and database files out of commits. Use `.env.example` for variable names only. Store production secrets in provider settings. Supabase publishable keys identify clients; secret/service-role keys must stay server-side.

See [LAUNCH.md](LAUNCH.md) for deployment and privileged account setup.
