#!/usr/bin/env bash
# Jalankan release desk lalu buka browser. Ctrl+C untuk mematikan.
cd "$(dirname "$0")" || exit 1
PORT="${PORT:-4173}"

# Kalau port masih dipakai instance lama, matikan dulu biar URL-nya tetap sama.
if command -v lsof >/dev/null 2>&1; then
  lsof -ti:"$PORT" | xargs -r kill 2>/dev/null || true
  sleep 0.4
fi

echo "Membuka release desk di http://127.0.0.1:$PORT/"
exec node publish/dashboard.mjs --port "$PORT"
