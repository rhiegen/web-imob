#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(dirname "$0")"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ ! -f "$ROOT_DIR/.env" ]; then
  echo "Arquivo .env nao encontrado em $ROOT_DIR/.env"
  exit 1
fi

bash "$SCRIPT_DIR/generate-secrets.sh" "$ROOT_DIR/.env"

set -a
. "$ROOT_DIR/.env"
set +a

bash "$SCRIPT_DIR/init-supabase.sh"
bash "$SCRIPT_DIR/install-vps.sh"

echo "Setup de VPS concluido. Inicie o servico com: sudo systemctl start imob-admin.service"
