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

# Service readiness polling defaults (30 retries * 2s = 60s max wait per service).
SERVICE_READY_MAX_RETRIES="${BOOTSTRAP_SERVICE_READY_MAX_RETRIES:-30}"
SERVICE_READY_RETRY_DELAY_SEC="${BOOTSTRAP_SERVICE_READY_RETRY_DELAY_SEC:-2}"

wait_for_service() {
  local error_message="$1"
  shift
  local is_ready=1
  local i

  for ((i = 1; i <= SERVICE_READY_MAX_RETRIES; i++)); do
    if "$@" >/dev/null 2>&1; then
      is_ready=0
      break
    fi
    sleep "$SERVICE_READY_RETRY_DELAY_SEC"
  done

  if [ "$is_ready" -ne 0 ]; then
    echo "ERROR: ${error_message}"
    exit 1
  fi

  return 0
}

wait_for_service_running() {
  local service="$1"
  local i

  for ((i = 1; i <= SERVICE_READY_MAX_RETRIES; i++)); do
    if docker compose ps --status running --services | grep -Fxq "$service"; then
      return 0
    fi
    sleep "$SERVICE_READY_RETRY_DELAY_SEC"
  done

  echo "ERROR: ${service} container is not running after waiting."
  docker compose ps "$service"
  exit 1
}

# Copy .env if missing
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi
if [ -f .env ]; then
  set -a
  source .env
  set +a
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
  echo "WARNING: Workspace build failed (exit code: ${build_status}). Continuing with infrastructure-only startup."
fi

# Start services
docker compose up -d "${INFRA_SERVICES[@]}"

wait_for_service_running postgres
wait_for_service_running redis

wait_for_service \
  "Postgres is not ready after waiting." \
  docker compose exec -T postgres pg_isready -U "${POSTGRES_USER:-postgres}"
wait_for_service \
  "Redis is not ready after waiting." \
  docker compose exec -T redis redis-cli ping

if [ "$build_status" -eq 0 ]; then
  docker compose up -d --build "${APP_SERVICES[@]}"
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
