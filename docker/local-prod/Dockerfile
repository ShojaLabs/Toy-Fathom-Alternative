FROM node:22-alpine AS base

# mostly inspired from -
# https://github.com/deadcoder0904/easypanel-nextjs-sqlite/blob/main/docker/production/Dockerfile

RUN corepack enable  && corepack prepare pnpm@9.7.0 --activate

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY ./migration-store ./migration-store
# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
COPY scripts ./scripts
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile --recursive; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN ls -a
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
RUN apk add --no-cache postgresql
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
# RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/cache ./.next/cache

COPY --from=deps /app/scripts ./scripts

# Move the drizzle directory to the runtime image
COPY --from=deps /app/migration-store ./migration-store

# USER nextjs
EXPOSE 3000

ENV PORT=3000

RUN corepack enable  && corepack prepare pnpm@9.7.0 --activate

CMD sh ./scripts/init_app.sh
