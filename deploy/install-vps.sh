#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${APP_DIR:-/opt/imob-admin}"
SERVICE_FILE="/etc/systemd/system/imob-admin.service"
SCRIPT_DIR="$(dirname "$0")"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js nao encontrado. Instale Node 20+ antes de executar este script."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm nao encontrado."
  exit 1
fi

sudo mkdir -p "$APP_DIR"
sudo rsync -a --delete --exclude node_modules --exclude dist --exclude .git "$ROOT_DIR/" "$APP_DIR/"

sudo npm install --prefix "$APP_DIR"
sudo npm run build --prefix "$APP_DIR"

if [ ! -f "$APP_DIR/.env" ]; then
  echo "Crie o arquivo $APP_DIR/.env antes de iniciar o servico."
fi

sudo bash "$APP_DIR/deploy/generate-secrets.sh" "$APP_DIR/.env"

sudo tee "$SERVICE_FILE" >/dev/null <<EOF
[Unit]
Description=Imob Admin
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=/usr/bin/npm run start:prod --prefix $APP_DIR
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable imob-admin.service

echo "Instalacao concluida."
echo "1. Configure $APP_DIR/.env"
echo "2. Rode: sudo systemctl start imob-admin.service"
echo "3. Rode: sudo systemctl status imob-admin.service"
