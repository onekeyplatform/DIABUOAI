#!/usr/bin/env bash
set -Eeuo pipefail

echo "=== DIABUOAI Bootstrap ==="

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Aggiorna Corepack e PNPM
corepack enable
corepack prepare pnpm@9.15.0 --activate

# Pulizia
rm -rf node_modules
find . -name node_modules -type d -prune -exec rm -rf {} +
find . -name dist -type d -prune -exec rm -rf {} +
find . -name .next -type d -prune -exec rm -rf {} +
find . -name .turbo -type d -prune -exec rm -rf {} +

# Installa dipendenze del workspace
pnpm install

# Build di tutti i package
pnpm turbo run build || true

# Copia .env se manca
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

# Avvia l'infrastruttura
docker compose up -d postgres redis prometheus grafana mailhog

# Avvia l'applicazione
docker compose up -d --build

echo
echo "=== Stato container ==="
docker ps

echo
echo "=== Fine bootstrap ==="
