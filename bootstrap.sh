#!/usr/bin/env bash
set -Eeuo pipefail

echo "=== DIABUOAI Bootstrap ==="

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PNPM_VERSION="$(node -p "require('./package.json').packageManager.split('@')[1]")"
INFRA_SERVICES=(postgres redis prometheus grafana mailhog)
APP_SERVICES=(web api workers agent)
DO_CLEANUP="${BOOTSTRAP_CLEAN:-0}"
if [ "${1:-}" = "--clean" ]; then
  DO_CLEANUP=1
fi

# Update Corepack and PNPM
corepack enable
corepack prepare "pnpm@${PNPM_VERSION}" --activate

# Optional cleanup
if [ "$DO_CLEANUP" = "1" ]; then
  rm -rf node_modules
  find apps packages -name node_modules -type d -prune -exec rm -rf {} +
  find apps packages -name dist -type d -prune -exec rm -rf {} +
  find apps packages -name .next -type d -prune -exec rm -rf {} +
  find . -maxdepth 2 -name .turbo -type d -prune -exec rm -rf {} +
else
  echo "Skipping cleanup (set BOOTSTRAP_CLEAN=1 or use --clean to enable)."
fi

# Install workspace dependencies
pnpm install

# Build all packages (best-effort, warn on failure)
build_status=0
if pnpm exec turbo run build; then
  build_status=0
else
  build_status=$?
  echo "WARNING: Workspace build failed (exit code: ${build_status}). Continuing bootstrap."
fi

# Copy .env if missing
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

# Start infrastructure
docker compose up -d "${INFRA_SERVICES[@]}"

# Start application
docker compose up -d --build "${APP_SERVICES[@]}"

echo
echo "=== Container Status ==="
docker ps

if [ "$build_status" -ne 0 ]; then
  echo
  echo "Bootstrap completed with build warnings. Please review the build output above."
fi

echo
echo "=== Bootstrap Complete ==="
