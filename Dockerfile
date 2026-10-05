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
# VITE_API_URL is inlined into the client bundle at build time, so it MUST be
# supplied as a build arg. Without it the bundle falls back to
# http://localhost:4000 and every API call in the browser fails.
FROM base AS build-env
ARG VITE_API_URL
ARG VITE_APP_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_URL=$VITE_APP_URL
WORKDIR /app
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
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY package.json /app/package.json
EXPOSE 3000
CMD ["pnpm", "run", "start"]