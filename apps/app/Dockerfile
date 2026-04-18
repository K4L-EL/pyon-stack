FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json ./
RUN pnpm install --no-frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
RUN printf 'server { listen __PYON_PORT_APP__; root /usr/share/nginx/html; index index.html; location / { try_files $uri /index.html; } }\n' \
  > /etc/nginx/conf.d/default.conf
EXPOSE __PYON_PORT_APP__
