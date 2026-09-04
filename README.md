# DIABUOAI - Enterprise AI Platform

DIABUOAI is a production-ready, enterprise-grade monorepo for multi-tenant AI automation, workflow orchestration, knowledge management, document processing, and digital commerce. It combines a Next.js 15 frontend, NestJS 12 API, worker services, AI agent runtimes, PostgreSQL with vector support, and comprehensive monitoring.

## Platform Capabilities

### 10 Production Modules (Delivered)
1. **Authentication** - JWT, refresh tokens, OAuth integration hooks
2. **RBAC** - Role-based access control with granular permissions
3. **Organization** - Multi-tenant isolation and tenant management
4. **Users** - User lifecycle management and profile handling
5. **AI Gateway** - Provider abstraction (OpenAI, Anthropic, Gemini)
6. **AI Agents** - Agent orchestration with state management
7. **Chat** - Real-time messaging with conversation history
8. **Knowledge Base (RAG)** - Vector search, full-text search, hybrid search with pgvector
9. **Documents** - Versioning, permissions, sharing, templates, lifecycle management
10. **Workflow Engine** - Low-code workflow automation with visual builder, execution monitoring

### 17 Remaining Modules (Architecture Ready)
CRM, ERP, Inventory, Purchasing, Sales, Accounting, Logistics, Hotel PMS, Revenue Management, Booking Engine, Marketplace, Analytics, Notifications, Billing, API Gateway, Monitoring, Deployment

## Core Architecture

- **Monorepo**: Turborepo + pnpm with 13 workspaces
- **Frontend**: Next.js 15 + React 19 with app directory
- **Backend**: NestJS 12 with REST/GraphQL/WebSockets
- **Database**: PostgreSQL + Prisma ORM + pgvector for embeddings
- **Cache/Queue**: Redis
- **Search**: Full-text and vector search capabilities
- **AI**: OpenAI SDK, LangGraph compatible, MCP support
- **Identity**: JWT, OAuth 2.0, RBAC, multi-tenant isolation
- **Observability**: Prometheus, Grafana, OpenTelemetry-ready
- **Deployment**: Docker, Docker Compose, Kubernetes manifests

## Repository Structure

```
apps/
  web/          — Next.js 15 frontend with dashboard
  api/          — NestJS backend with 10+ modules
  agent/        — AI orchestration runtime
  workers/      — Async job processing
  docs/         — Documentation site
packages/
  ui/           — React component library
  db/           — Prisma schema and migrations
  auth/         — JWT and RBAC utilities
  ai/           — AI abstractions and embeddings
  types/        — Shared TypeScript types
  validators/   — Validation schemas
  notifications/ — Email/SMS/Slack integration
  observability/ — Logging and metrics
infra/
  kubernetes/   — K8s manifests for dev/prod
  monitoring/   — Prometheus config
.github/
  workflows/    — CI/CD automation
docs/
  architecture/ — Architecture decision records
```

## Quick Start

### Prerequisites
- Node.js 20+ 
- pnpm 9.15.0+
- Docker & Docker Compose
- PostgreSQL 16+ (with pgvector extension)
- Redis 7+

### Setup

Ensure Node.js, Corepack/PNPM, and Docker Compose are installed before running bootstrap.

```bash
# One-command bootstrap
bash ./bootstrap.sh
# Optional full cleanup before install/build
bash ./bootstrap.sh --clean
```

Or run the manual steps:

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# 3. Start infrastructure
docker compose up -d postgres redis

# 4. Run migrations
pnpm db:migrate

# 5. Development mode
pnpm dev

# 6. Production build
pnpm build
```

### Validation Commands

```bash
# Lint all packages
pnpm lint

# Type check
pnpm typecheck

# Run all tests
pnpm -w run test

# Build all packages
pnpm build

# Format code
pnpm format
```

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
