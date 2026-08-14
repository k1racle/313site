FROM node:24-bookworm-slim AS base

RUN apt-get update \
    && apt-get install -y --no-install-recommends gzip openssl tar \
    && rm -rf /var/lib/apt/lists/*

FROM base AS build

WORKDIR /app

ENV DATABASE_URL=file:/app/data/site.sqlite

COPY package.json package-lock.json prisma.config.ts ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npm ci

COPY . .
RUN npm run db:generate && npm run build

FROM base AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/app/data \
    NUXT_DATA_DIR=/app/data \
    DATABASE_URL=file:/app/data/site.sqlite

COPY --from=build --chown=node:node /app/.output ./.output
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json /app/package-lock.json /app/prisma.config.ts ./
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/server/generated ./server/generated
COPY --chown=node:node scripts/docker-entrypoint.sh ./scripts/docker-entrypoint.sh

RUN mkdir -p /app/data/uploads \
    && chown -R node:node /app/data \
    && chmod +x /app/scripts/docker-entrypoint.sh

USER node

EXPOSE 3000

ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
