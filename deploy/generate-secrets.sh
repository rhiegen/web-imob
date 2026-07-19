#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Arquivo de ambiente nao encontrado: $ENV_FILE"
  exit 1
fi

generate_secret() {
  openssl rand -hex 32
}

ensure_secret() {
  local key="$1"
  if grep -q "^${key}=" "$ENV_FILE"; then
    return
  fi

  printf '\n%s=%s\n' "$key" "$(generate_secret)" >> "$ENV_FILE"
}

ensure_secret "APP_SECRET"
ensure_secret "SESSION_SECRET"

echo "Secrets garantidos em $ENV_FILE"
