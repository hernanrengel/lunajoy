# -------------------------------
# Stage 1 — Build
# -------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

# 1) Instalar deps (incluye devDeps para build)
COPY package*.json ./
RUN npm install

# 2) Copiar fuentes y configs (tsconfig/nest-cli son claves)
COPY . .

# 3) (Opcional) Generar Prisma si tu build depende de tipos
# Si te da error por DATABASE_URL, comenta esta línea y solo genera en runtime
# RUN npx prisma generate

# 4) Compilar Nest
RUN npm run build

# 5) Verificar que dist exista
RUN ls -la dist || (echo "No dist folder" && exit 1)

# -------------------------------
# Stage 2 — Production Runner
# -------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

# Solo prod deps
COPY package*.json ./
RUN npm install --omit=dev

# Copiar assets de Prisma y el build
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

ENV PORT=3000
EXPOSE 3000

# Generar prisma y aplicar migraciones con las env reales,
# luego detectar el main compilado y arrancar.
CMD sh -c '\
    npx prisma generate && \
    npx prisma migrate deploy && \
    ENTRY="$([ -f dist/main.js ] && echo dist/main.js || ( [ -f dist/src/main.js ] && echo dist/src/main.js || ( [ -f dist/apps/backend/main.js ] && echo dist/apps/backend/main.js || echo "")))"; \
    if [ -z "$ENTRY" ]; then echo "No compiled main.js found in dist"; ls -R dist || true; exit 1; fi; \
    node "$ENTRY"'
