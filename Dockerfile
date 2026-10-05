FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── Dependencies ──────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
# VITE_API_URL is inlined into the client bundle at build time. The app applies no
# default for it, so an unset value makes the bundle throw on first import. Fail the
# build here instead so a misconfigured deploy never ships a broken image.
FROM base AS build-env
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
RUN test -n "$VITE_API_URL" || (echo "ERROR: VITE_API_URL build arg is required" >&2; exit 1)
COPY --from=deps /app/node_modules /app/node_modules
COPY . /app/
RUN pnpm run build

# ── Production dependencies ───────────────────────────────────────────────────
FROM base AS prod-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY package.json /app/package.json
EXPOSE 3000
CMD ["pnpm", "run", "start"]