#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -f "$ROOT_DIR/.env" ]; then
  echo "Arquivo .env nao encontrado em $ROOT_DIR/.env"
  echo "Copie .env.vps.example para .env e ajuste as variaveis antes de continuar."
  exit 1
fi

cd "$ROOT_DIR"

bash ./deploy/generate-secrets.sh ./.env

set -a
. ./.env
set +a

bash ./deploy/init-supabase.sh

docker compose -f docker-compose.vps.full.yml up -d --build

echo "Deploy Docker + Nginx concluido."
echo "Valide com: docker compose -f docker-compose.vps.full.yml ps"
echo "Healthcheck: curl http://localhost/health"
