FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
COPY apps/agent/package.json ./apps/agent/package.json
COPY packages ./packages
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm turbo run build --filter=@diabuoai/agent
CMD ["pnpm", "--dir", "apps/agent", "start"]
