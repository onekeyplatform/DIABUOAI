# DIABUOAI

DIABUOAI is an enterprise-grade monorepo for multi-tenant AI automation, operational orchestration, and digital commerce. It combines a Next.js 15 frontend, NestJS API, worker services, AI agent runtimes, PostgreSQL with Prisma, Redis, event streaming, monitoring, and Cloud-ready deployment patterns.

## Core architecture

- Monorepo managed by Turborepo and pnpm
- Frontend: Next.js 15 + React 19
- Backend: NestJS + REST + GraphQL + WebSockets + OpenAPI
- Data layer: PostgreSQL + Prisma + Redis + pgvector-ready schema
- AI layer: LangGraph + OpenAI + MCP + RAG
- Multi-tenant identity and RBAC with JWT and OAuth (Google / Microsoft)
- Communications: Email, SMS, WhatsApp, Stripe billing
- Observability: OpenTelemetry-ready logging, Prometheus, Grafana, Sentry
- Deployment: Docker, Docker Compose, Kubernetes manifests, GitHub Actions, Coolify-ready build pipeline

## Repository layout

- apps/web — customer-facing Next.js application
- apps/api — NestJS backend
- apps/workers — async job workers and integrations
- apps/agent — AI orchestration with LangGraph and MCP
- apps/docs — project docs site
- packages/ui — reusable design system
- packages/db — Prisma schema and client
- packages/auth — JWT, OAuth, RBAC helpers
- packages/ai — AI abstractions and RAG utilities
- packages/notifications — email, SMS, WhatsApp wiring
- packages/observability — logging, metrics, tracing
- packages/validators — shared validation schemas
- infra/kubernetes — base and overlay manifests
- .github/workflows — CI/CD automation
- docs/architecture — architecture documentation

## Quick start

1. Install dependencies:
   pnpm install
2. Copy environment files:
   cp .env.example .env
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   cp apps/agent/.env.example apps/agent/.env
   cp apps/workers/.env.example apps/workers/.env
3. Start local services:
   docker compose up -d postgres redis
4. Run the workspace:
   pnpm dev
5. Build everything:
   pnpm build

## Production deployment

- Docker Compose for local orchestration
- Kubernetes manifests under infra/kubernetes
- Coolify-ready build and deployment conventions
- GitHub Actions for CI/CD and validation

## Documentation

- docs/architecture/enterprise-architecture.md
- docs/architecture/README.md

## License

MIT
