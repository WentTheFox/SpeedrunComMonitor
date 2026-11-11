# SpeedrunComMonitor: run-once job (Kubernetes CronJob). No port, no health endpoint; the exit code is the result.
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

# tsx (runs the TypeScript sources) and node-pg-migrate are devDependencies the job needs at runtime, so install everything.
COPY package.json package-lock.json ./
RUN npm ci --include=dev --ignore-scripts && npm cache clean --force

COPY tsconfig.json ./
COPY src ./src
COPY migrations ./migrations
COPY setup ./setup

USER node

# Default: one run, then exit 0 on success / 1 on failure. Logs go to stdout/stderr.
# Migrations (separate Job/hook): override the command, see docs/KUBERNETES.md.
ENTRYPOINT ["/app/node_modules/.bin/tsx"]
CMD ["src/index.ts"]
