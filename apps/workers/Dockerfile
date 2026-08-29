FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/workers/package.json ./apps/workers/package.json
COPY packages ./packages
COPY turbo.json .
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm turbo run build --filter=@diabuoai/workers
CMD ["pnpm", "--dir", "apps/workers", "start"]
