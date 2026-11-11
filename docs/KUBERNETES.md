# Running in Kubernetes

Image: `ghcr.io/wentthefox/speedruncommonitor` (multi-arch amd64+arm64, tags `sha-<7 hex>` only; built by `.github/workflows/images.yml` on every push to `main`).

- **Kind:** CronJob, hourly (`0 * * * *`), `concurrencyPolicy: Forbid`, `restartPolicy: Never`/`OnFailure`. The job runs once and exits `0` on success, `1` on any error. No port, no health endpoint, no volumes. Runs as the non-root `node` user; logs go to stdout/stderr.
- **Run command:** the image default (`/app/node_modules/.bin/tsx src/index.ts`).
- **Migrations** (separate Job / PreSync hook, same image, needs `DATABASE_URL` only):
  `command: ["/app/node_modules/.bin/tsx"]`, `args: ["node_modules/node-pg-migrate/bin/node-pg-migrate.js","-j","ts","--template-file-name","setup/migration-template.ts","up"]`
- **Env var names** (values in a Secret, never in git): `DATABASE_URL` (Postgres `speedruncommonitor`), `DISCORD_WEBHOOK_URL`, `USER_AGENT` (optional), `POST_VERIFIED_AFTER` (optional ISO timestamp).
- **Subscriptions** are rows in the database (`setup/seed.sql`), not config.
- **External services:** Postgres, the speedrun.com API (`https://www.speedrun.com/api/v1`) and the Discord webhook. No DeviantArt, Valkey, OpenSearch or mail.
- **Never run twice at once:** two overlapping runs could post the same run twice (message rows are written after sending), hence `Forbid`.
