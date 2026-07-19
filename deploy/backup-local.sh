#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(dirname "$0")"
BACKUP_DIR="${1:-$SCRIPT_DIR/backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_FILE="$BACKUP_DIR/imob-admin-$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

docker exec imob-postgres pg_dump -U imob -d imob_admin > "$OUTPUT_FILE"

echo "Backup gerado em: $OUTPUT_FILE"
