// PM2 ecosystem config for KrunchMate on a Hostinger VPS.
// Manages the FastAPI backend + a Node process that serves the built React SPA.
// Usage on the VPS:
//   pm2 start ecosystem.config.js
//   pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: "krunchmate-backend",
      cwd: "/var/www/krunchmate/backend",
      // Uses the venv python; the FastAPI app is at server:app (server.py -> app).
      script: "/var/www/krunchmate/backend/.venv/bin/uvicorn",
      args: "server:app --host 127.0.0.1 --port 8001",
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
      out_file: "/var/log/krunchmate/backend.out.log",
      error_file: "/var/log/krunchmate/backend.err.log",
      time: true,
    },
    {
      name: "krunchmate-frontend",
      cwd: "/var/www/krunchmate/frontend",
      // Serves the CRA build/ directory over HTTP on 127.0.0.1:3000.
      // `serve` is installed as a dependency (see deploy/README.md).
      script: "npx",
      args: "serve -s build -l 3000",
      instances: 1,
      autorestart: true,
      max_memory_restart: "250M",
      env: {
        NODE_ENV: "production",
      },
      out_file: "/var/log/krunchmate/frontend.out.log",
      error_file: "/var/log/krunchmate/frontend.err.log",
      time: true,
    },
  ],
};
