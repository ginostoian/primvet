# Production Deployment

## Required Vercel environment variables

Set these in Vercel for Production, and later for Preview if you want preview deployments:

```env
DATABASE_URL="postgresql://..."
```

Use the pooled Neon connection string when possible. In Neon, this is usually the URL that contains `-pooler`.

## First production database setup

Run Prisma migrations against the Neon database before using the admin app:

```bash
DATABASE_URL="postgresql://..." npm run db:migrate:deploy
```

This creates the production tables.

## Vercel build

The build script runs Prisma Client generation before Next.js build:

```bash
npm run build
```

Do not use SQLite in production. Local development should use a Neon development branch or a local PostgreSQL database.

## First admin account

After deployment and migrations:

1. Open `/admin/register`.
2. Create the first admin account.
3. Log in at `/admin/login`.
4. Test patients, owners, calendar, inventory, audit, and PDF export.

## Running DB integration tests

DB integration tests require a PostgreSQL test database:

```bash
TEST_DATABASE_URL="postgresql://..." npm run test
```

Without `TEST_DATABASE_URL`, DB integration tests are skipped and pure unit tests still run.
