# Standalone Next.js container for soc.th.gl (Songs of Conquest database).
# Deployed to a Bunny Magic Container. Build from repo root:
#   docker build -t soc-th-gl .

# ------------------------------------------------------------------
# Stage 1: build
# ------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# .dockerignore excludes extractor/ and overwolf/ (separate tools, not
# part of the Next app) plus node_modules/.next.
COPY . .
RUN npm run build

# ------------------------------------------------------------------
# Stage 2: runtime (slim, only the standalone server)
# ------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Next's `output: standalone` bundles the server + required deps.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
