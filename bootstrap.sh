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

# Service readiness polling defaults (30 retries * 2s = 60s max wait per check).
SERVICE_READY_MAX_RETRIES="${BOOTSTRAP_SERVICE_READY_MAX_RETRIES:-30}"
SERVICE_READY_RETRY_DELAY_SEC="${BOOTSTRAP_SERVICE_READY_RETRY_DELAY_SEC:-2}"

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

wait_for_tcp_port() {
  local host="$1"
  local port="$2"
  local error_message="$3"
  local i

  for ((i = 1; i <= SERVICE_READY_MAX_RETRIES; i++)); do
    if bash -c ">/dev/tcp/${host}/${port}" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$SERVICE_READY_RETRY_DELAY_SEC"
  done

  echo "ERROR: ${error_message}"
  exit 1
}

get_published_port() {
  local service="$1"
  local container_port="$2"
  local mapping

  mapping="$(docker compose port "$service" "$container_port" 2>/dev/null | head -n1 || true)"
  if [ -z "$mapping" ]; then
    echo "ERROR: Could not resolve published port for ${service}:${container_port}."
    exit 1
  fi

  echo "${mapping##*:}"
}

# Copy .env if missing
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

AVAILABLE_COMPOSE_SERVICES="$(docker compose config --services 2>/dev/null || true)"
if [ -z "$AVAILABLE_COMPOSE_SERVICES" ]; then
  echo "ERROR: Unable to resolve services from docker compose configuration."
  exit 1
fi

INFRA_SERVICES_TO_START=()
for service in "${INFRA_SERVICES[@]}"; do
  if printf '%s\n' "$AVAILABLE_COMPOSE_SERVICES" | grep -Fxq "$service"; then
    INFRA_SERVICES_TO_START+=("$service")
  fi
done

APP_SERVICES_TO_START=()
for service in "${APP_SERVICES[@]}"; do
  if printf '%s\n' "$AVAILABLE_COMPOSE_SERVICES" | grep -Fxq "$service"; then
    APP_SERVICES_TO_START+=("$service")
  fi
done

if ! printf '%s\n' "$AVAILABLE_COMPOSE_SERVICES" | grep -Fxq "postgres"; then
  echo "ERROR: Required service 'postgres' is missing from docker compose configuration."
  exit 1
fi
if ! printf '%s\n' "$AVAILABLE_COMPOSE_SERVICES" | grep -Fxq "redis"; then
  echo "ERROR: Required service 'redis' is missing from docker compose configuration."
  exit 1
fi

# Update Corepack and PNPM
if command -v corepack >/dev/null 2>&1; then
  corepack enable
  corepack prepare "pnpm@${PNPM_VERSION}" --activate
elif ! command -v pnpm >/dev/null 2>&1; then
  echo "ERROR: corepack is not available and pnpm is not installed."
  exit 1
else
  INSTALLED_PNPM_VERSION="$(pnpm --version)"
  if [ "$INSTALLED_PNPM_VERSION" != "$PNPM_VERSION" ]; then
    echo "ERROR: pnpm version mismatch. Required: ${PNPM_VERSION}, installed: ${INSTALLED_PNPM_VERSION}."
    exit 1
  fi
fi

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
if ! node -e "const pkg=require('./package.json'); const build=pkg?.scripts?.build; process.exit(typeof build === 'string' && build.trim().length > 0 ? 0 : 1)"; then
  echo "ERROR: package.json scripts.build must be defined for bootstrap."
  exit 1
fi
build_status=0
pnpm build || build_status=$?
if [ "$build_status" -ne 0 ]; then
  echo "WARNING: Workspace build failed (exit code: ${build_status}). Continuing with infrastructure-only startup."
fi

# Start services
docker compose up -d "${INFRA_SERVICES_TO_START[@]}"

for service in "${INFRA_SERVICES_TO_START[@]}"; do
  wait_for_service_running "$service"
done

POSTGRES_HOST_PORT="$(get_published_port postgres 5432)"
REDIS_HOST_PORT="$(get_published_port redis 6379)"

wait_for_tcp_port "127.0.0.1" "$POSTGRES_HOST_PORT" "Postgres TCP port is not reachable after waiting."
wait_for_tcp_port "127.0.0.1" "$REDIS_HOST_PORT" "Redis TCP port is not reachable after waiting."

if [ "$build_status" -eq 0 ]; then
  if [ "${#APP_SERVICES_TO_START[@]}" -gt 0 ]; then
    docker compose up -d --build "${APP_SERVICES_TO_START[@]}"
  fi
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
