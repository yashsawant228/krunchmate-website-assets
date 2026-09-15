# KrunchMate — Hostinger VPS deployment package

This folder is intentionally generic. It targets **any** Hostinger VPS
plan running Ubuntu 22.04 / 24.04 LTS (the default images at time of
writing). Confirm the two items in **Verify on your own plan** below
against your actual purchased tier before going live.

## What's in this folder

| File | Purpose |
|---|---|
| `ecosystem.config.js` | PM2 process manager config for the FastAPI backend + Node/`serve` frontend |
| `nginx-krunchmate.conf` | Nginx reverse-proxy template — SPA + `/api` + GLB cache headers |
| `.env.example`         | Environment variable template for both the backend and the CRA build |
| `deploy.sh`            | One-shot install + build + PM2 boot script (idempotent) |

## Verify on your own plan

The package makes **no assumption** about your specific VPS tier's CPU / RAM,
but two runtime numbers need to be checked once you know your plan:

1. **Node version** — Hostinger's Ubuntu 22.04 image ships with Node 12/18 in
   the default apt repos. This project needs **Node ≥ 18.18** (React 18 +
   react-scripts 5). The `deploy.sh` script installs Node 20 LTS via
   NodeSource for you; if you're on a shared-VPS tier that blocks NodeSource,
   drop to nvm and pin `20.11.0`.
2. **RAM headroom** — a CRA production build peaks at ~1.4 GB during webpack.
   On the 1 GB tier you may need `NODE_OPTIONS=--max-old-space-size=768` and
   to add a 2 GB swapfile (`fallocate -l 2G /swapfile && mkswap /swapfile && swapon /swapfile`)
   before running `yarn build`. On the 2 GB tier and above no changes needed.

## Deploy in ten minutes

```bash
# 1. On your VPS, as root or a sudoer:
apt update && apt install -y git nginx python3-venv python3-pip
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm i -g pm2 yarn

# 2. Clone your app (assumes you've pushed this repo to your GitHub):
git clone https://github.com/<you>/krunchmate.git /var/www/krunchmate
cd /var/www/krunchmate
cp deploy/.env.example .env      # ← edit with your real values

# 3. Build backend deps:
cd backend && python3 -m venv .venv
./.venv/bin/pip install -r requirements.txt

# 4. Build the frontend:
cd ../frontend
export REACT_APP_BACKEND_URL="$(grep REACT_APP_BACKEND_URL ../.env | cut -d= -f2)"
yarn install --frozen-lockfile
yarn build

# 5. Start with PM2:
cd /var/www/krunchmate
mkdir -p /var/log/krunchmate
cd frontend && yarn add serve                 # small runtime dep for `serve -s build`
cd ..
pm2 start deploy/ecosystem.config.js
pm2 save && pm2 startup

# 6. Wire up Nginx + TLS:
cp deploy/nginx-krunchmate.conf /etc/nginx/sites-available/krunchmate.conf
sed -i "s/<YOUR_DOMAIN>/krunchmate.com/g" /etc/nginx/sites-available/krunchmate.conf
ln -sf /etc/nginx/sites-available/krunchmate.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
apt install -y certbot python3-certbot-nginx
certbot --nginx -d krunchmate.com -d www.krunchmate.com
```

## Rollout / rollback

```bash
# Zero-downtime redeploy after a code change:
cd /var/www/krunchmate && git pull
cd frontend && yarn install --frozen-lockfile && yarn build
pm2 reload krunchmate-frontend krunchmate-backend

# Rollback:
git checkout <previous-tag> && (rebuild + pm2 reload)
```

## Tuning knobs

- **GLB caching** — the Nginx block sets `Cache-Control: public, max-age=31536000, immutable` for `*.glb`. Bust with a content hash in the filename if you ever swap models.
- **Model compression** — the two shipped GLBs are ~5.2 MB each uncompressed. Draco / meshopt compression will typically cut this to 1.0–1.5 MB. See the changelog for the decision on whether this was applied at ship time.
- **Backend workers** — `uvicorn --workers N` in `ecosystem.config.js` defaults to `1`. Raise to `2` on the 2 GB+ tier once you see traffic.
