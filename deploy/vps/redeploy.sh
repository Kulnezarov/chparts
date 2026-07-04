#!/usr/bin/env bash
# Сборка и запуск CHparts на VPS. Из корня репозитория:
#   cp deploy/vps/.env.example .env.vps   # один раз
#   bash deploy/vps/redeploy.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

ENV_FILE=".env.vps"
COMPOSE="docker compose --env-file ${ENV_FILE} -f docker-compose.vps.yml"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Нет ${ENV_FILE} — создайте: cp deploy/vps/.env.example .env.vps"
  exit 1
fi

echo "==> Build & up CHparts..."
${COMPOSE} build
${COMPOSE} up -d --force-recreate chparts

echo "==> Status"
${COMPOSE} ps

echo "==> Wait for health..."
sleep 5

echo "==> Health check"
curl -sf "http://127.0.0.1:3000/" >/dev/null && echo "OK: http://127.0.0.1:3000/" || {
  echo "FAIL — логи: ${COMPOSE} logs chparts --tail 40"
  exit 1
}

echo "Готово. Откройте http://194.32.142.253:3000"
