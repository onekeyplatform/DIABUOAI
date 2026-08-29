FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
COPY apps/workers/package.json ./apps/workers/package.json
COPY packages ./packages
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm turbo run build --filter=@diabuoai/workers
CMD ["pnpm", "--dir", "apps/workers", "start"]
