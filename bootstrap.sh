#!/usr/bin/env bash
set -Eeuo pipefail

echo "=== DIABUOAI Bootstrap ==="

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PACKAGE_MANAGER="$(node -p "require('./package.json').packageManager || ''")"
if [[ ! "$PACKAGE_MANAGER" =~ ^pnpm@.+$ ]]; then
  echo "ERROR: package.json must define packageManager as pnpm@<version>."
  exit 1
fi
PNPM_VERSION="${PACKAGE_MANAGER#pnpm@}"
INFRA_SERVICES=(postgres redis prometheus grafana mailhog)
APP_SERVICES=(web api workers agent)
DO_CLEANUP="${BOOTSTRAP_CLEAN:-0}"
if [ "${1:-}" = "--clean" ]; then
  DO_CLEANUP=1
fi

# Copy .env if missing
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

# Update Corepack and PNPM
corepack enable
corepack prepare "pnpm@${PNPM_VERSION}" --activate

# Optional cleanup
if [ "$DO_CLEANUP" = "1" ]; then
  CLEANUP_DIRS=()
  if [ -d apps ]; then
    CLEANUP_DIRS+=(apps)
  fi
  if [ -d packages ]; then
    CLEANUP_DIRS+=(packages)
  fi

  rm -rf -- node_modules
  if [ "${#CLEANUP_DIRS[@]}" -gt 0 ]; then
    find "${CLEANUP_DIRS[@]}" -name node_modules -type d -prune -exec rm -rf -- {} +
    find "${CLEANUP_DIRS[@]}" -name dist -type d -prune -exec rm -rf -- {} +
    find "${CLEANUP_DIRS[@]}" -name .next -type d -prune -exec rm -rf -- {} +
  fi
  find . -maxdepth 2 -name .turbo -type d -prune -exec rm -rf -- {} +
else
  echo "Skipping cleanup (set BOOTSTRAP_CLEAN=1 or use --clean to enable)."
fi

# Install workspace dependencies
pnpm install --frozen-lockfile

# Build all packages (best-effort, warn on failure)
build_status=0
pnpm build || build_status=$?
if [ "$build_status" -ne 0 ]; then
  echo "WARNING: Workspace build failed (exit code: ${build_status}). Continuing bootstrap."
fi

# Start services
if [ "$build_status" -eq 0 ]; then
  docker compose up -d "${INFRA_SERVICES[@]}"

  for _ in {1..30}; do
    if docker compose exec -T postgres pg_isready -U "${POSTGRES_USER:-postgres}" >/dev/null 2>&1; then
      break
    fi
    sleep 2
  done
  if ! docker compose exec -T postgres pg_isready -U "${POSTGRES_USER:-postgres}" >/dev/null 2>&1; then
    echo "ERROR: Postgres is not ready after waiting."
    exit 1
  fi

  for _ in {1..30}; do
    if docker compose exec -T redis redis-cli ping >/dev/null 2>&1; then
      break
    fi
    sleep 2
  done
  if ! docker compose exec -T redis redis-cli ping >/dev/null 2>&1; then
    echo "ERROR: Redis is not ready after waiting."
    exit 1
  fi

  docker compose up -d --build "${APP_SERVICES[@]}"
else
  docker compose up -d "${INFRA_SERVICES[@]}"
fi

echo
echo "=== Container Status ==="
docker ps

if [ "$build_status" -ne 0 ]; then
  echo
  echo "Bootstrap completed with build warnings."
  echo "Infrastructure services were started."
  echo "Application services were not started because the workspace build failed."
  echo "Please review the build output above and rerun bootstrap after fixing build errors."
fi

echo
echo "=== Bootstrap Complete ==="
