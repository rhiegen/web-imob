#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(dirname "$0")"

run_with_local_container() {
  docker exec -i imob-postgres psql -U imob -d imob_admin -f - < "$SCRIPT_DIR/seed.sql"
}

DB_URL="${SUPABASE_DB_URL:-${DATABASE_URL:-}}"

if command -v psql >/dev/null 2>&1 && [ -n "$DB_URL" ]; then
  psql "$DB_URL" -f "$SCRIPT_DIR/seed.sql"
  echo "Dados iniciais aplicados com sucesso no banco configurado."
  exit 0
fi

if command -v docker >/dev/null 2>&1; then
  run_with_local_container
  echo "Dados iniciais aplicados com sucesso no PostgreSQL local em Docker."
  exit 0
fi

echo "Nenhuma forma de aplicar o seed foi encontrada."
exit 1
