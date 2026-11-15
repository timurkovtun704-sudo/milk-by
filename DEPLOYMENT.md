# Production deployment

## 1. Prepare environment variables

Copy the root template and fill it with the values from the Supabase project:

```bash
cp .env.example .env
```

Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
`SUPABASE_SERVICE_ROLE_KEY` is a server-only secret: do not put it in the frontend,
commit it to Git, or include it in an archive shared publicly.

`CORS_ORIGIN` is a comma-separated allowlist for browser origins that call the API
directly. With the included Nginx configuration, the browser calls `/api` on the
same origin, so this can normally remain empty. If the API is called from a separate
frontend origin, set that exact origin, including the scheme.

## 2. Verify the Supabase database

The repository currently contains a migration for SEO tables only. The database
architecture document describes Products, Categories, ProductCharacteristic,
Packaging, News, User, and Translation as planned entities, not as an implemented
schema. Before deploying to a new Supabase project, apply the complete, agreed
application schema and required access policies. Do not assume the SEO migration
creates the catalog, news, category, subcategory, or feedback tables.

Apply the migration files in `backend-node/supabase/migrations/` using the Supabase
SQL editor or the Supabase CLI after reviewing them for the target project.

## 3. Build and start

Docker Engine and the Docker Compose plugin must be installed on the host.
From the repository root:

```bash
docker compose config
docker compose build --no-cache
docker compose up -d
```

Check status and logs:

```bash
docker compose ps
docker compose logs -f backend frontend
```

The frontend is exposed on port 80. Put a TLS reverse proxy or hosting-platform
HTTPS termination in front of it before making the site public. Restrict inbound
server access to the required ports only.

## 4. Health check

```bash
curl -f http://localhost/api/health
```

Expected response contains `"status":"ok"`.

## 5. Important notes

- `VITE_API_BASE_URL=/api` is intentional: Nginx proxies API requests to the backend.
- Frontend environment variables prefixed with `VITE_` are embedded in the public
  browser bundle. Never put secrets in them.
- The backend uses the Supabase Service Role key. Keep it only in the server runtime.
- The current CORS allowlist is configured with `CORS_ORIGIN`.
- Login and B2B contact endpoints have in-memory per-IP rate limits. This is suitable
  for one backend replica; use a shared store before running multiple replicas.
- The application still needs production smoke tests against the real Supabase
  schema, including login, catalog, news, product details, B2B contact submission,
  and admin operations.
