#!/usr/bin/env bash
# KrunchMate — one-shot install + build + PM2 boot on a fresh Hostinger VPS
# Idempotent: safe to re-run after a `git pull`.
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/krunchmate}"
NODE_MAJOR="${NODE_MAJOR:-20}"

echo "==> KrunchMate deploy — target: $APP_DIR (Node ${NODE_MAJOR}.x)"

if ! command -v node >/dev/null 2>&1 || [[ "$(node -v)" != v${NODE_MAJOR}* ]]; then
  echo "==> Installing Node ${NODE_MAJOR}.x via NodeSource"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then npm i -g pm2 yarn; fi
if ! command -v python3 >/dev/null 2>&1; then apt-get install -y python3 python3-venv python3-pip; fi

echo "==> Backend deps"
cd "$APP_DIR/backend"
if [[ ! -d .venv ]]; then python3 -m venv .venv; fi
./.venv/bin/pip install --upgrade pip
./.venv/bin/pip install -r requirements.txt

echo "==> Frontend build"
cd "$APP_DIR/frontend"
if [[ ! -f "$APP_DIR/.env" ]]; then
  echo "!! Missing $APP_DIR/.env — copy deploy/.env.example first."
  exit 1
fi
export REACT_APP_BACKEND_URL="$(grep REACT_APP_BACKEND_URL "$APP_DIR/.env" | cut -d= -f2)"
yarn install --frozen-lockfile
yarn add serve --frozen-lockfile
yarn build

mkdir -p /var/log/krunchmate

echo "==> Starting with PM2"
pm2 startOrReload "$APP_DIR/deploy/ecosystem.config.js"
pm2 save

echo "==> Done. Confirm with: pm2 status  ·  curl -sf http://127.0.0.1:8001/api/health"
