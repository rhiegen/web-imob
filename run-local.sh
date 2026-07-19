#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(dirname "$0")"

if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a
  . "$SCRIPT_DIR/.env"
  set +a
fi

if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  echo "Instalando dependencias..."
  npm install --prefix "$SCRIPT_DIR"
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL nao definido. Configure $SCRIPT_DIR/.env antes de executar."
  exit 1
fi

echo "Iniciando projeto localmente..."
echo "Frontend: http://localhost:5173"
echo "API fake: http://localhost:3001"

npm run dev --prefix "$SCRIPT_DIR"
