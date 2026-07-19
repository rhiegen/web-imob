#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(dirname "$0")"

run_with_local_container() {
  docker exec -i imob-postgres psql -U imob -d imob_admin -f - < "$SCRIPT_DIR/init-supabase.sql"
}

DB_URL="${SUPABASE_DB_URL:-${DATABASE_URL:-}}"

if command -v psql >/dev/null 2>&1 && [ -n "$DB_URL" ]; then
  psql "$DB_URL" -f "$SCRIPT_DIR/init-supabase.sql"
  echo "Schema aplicado com sucesso no banco configurado."
  exit 0
fi

if command -v docker >/dev/null 2>&1; then
  run_with_local_container
  echo "Schema aplicado com sucesso no PostgreSQL local em Docker."
  exit 0
fi

echo "Nenhuma forma de executar o schema foi encontrada. Configure psql com DATABASE_URL ou use o container local imob-postgres."
exit 1
