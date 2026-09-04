#!/usr/bin/env bash
set -Eeuo pipefail

echo "=== DIABUOAI Bootstrap ==="

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Update Corepack and PNPM
corepack enable
corepack prepare pnpm@9.15.0 --activate

# Cleanup
rm -rf node_modules
find apps packages -name node_modules -type d -prune -exec rm -rf {} +
find apps packages -name dist -type d -prune -exec rm -rf {} +
find apps packages -name .next -type d -prune -exec rm -rf {} +
find . -maxdepth 2 -name .turbo -type d -prune -exec rm -rf {} +

# Install workspace dependencies
pnpm install

# Build all packages (best-effort, warn on failure)
set +e
pnpm turbo run build
build_status=$?
set -e
if [ "$build_status" -ne 0 ]; then
  echo "WARNING: Workspace build failed (exit code: ${build_status}). Continuing bootstrap."
fi

# Copy .env if missing
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

# Start infrastructure
docker compose up -d postgres redis prometheus grafana mailhog

# Start application
docker compose up -d --build

echo
echo "=== Container Status ==="
docker ps

if [ "$build_status" -ne 0 ]; then
  echo
  echo "Bootstrap completed with build warnings. Please review the build output above."
fi

echo
echo "=== Bootstrap Complete ==="
