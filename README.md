# CHparts — витрина автозапчастей (Next.js)

Единственный production-проект CHparts: Telegram UI, языки RU / KZ / UZ (узбекский кириллицей).

Склад (**SkladPro**) — API бэкенда. Витрина ходит через прокси `/api/proxy` (см. `next.config.ts`).

**Деплой и SEO:** [docs/DEPLOY_AND_SEO.md](docs/DEPLOY_AND_SEO.md)

Скопируйте `.env.example` в `.env.local` и задайте `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_API_BASE_URL`.

- Пример переменных: `.env.example`
- Правки бэкенда: `BACKEND_FASTAPI_PUBLIC_API.md`
- Бот + API: `docs/INTEGRATION_BOT.md`

## Быстрый запуск (Windows)

Дважды кликните **`Start-CHparts.bat`** или **`dev.cmd`** — откроется http://localhost:3000

> **PowerShell:** команда `npm run dev` может не работать из‑за политики скриптов. Используйте `npm.cmd run dev` или `dev.cmd`.

## Запуск вручную

**PowerShell** (если `npm run dev` пишет про *Execution_Policies* — используйте `npm.cmd`):

```powershell
npm.cmd install
copy .env.example .env.local   # отредактируйте URL
npm.cmd run dev
```

**CMD** или Git Bash:

```bash
npm install
cp .env.example .env.local
npm run dev
```

На этой машине dev и build используют **webpack** (`next dev --webpack`, `next build --webpack`), т.к. native SWC может быть недоступен.

## Если не грузятся товары или фото

1. Убедитесь, что сервер запущен и в терминале есть строка `Ready` / `Local: http://localhost:3000`.
2. Открывайте именно **http://localhost:3000** (не chparts.kz — прод может быть недоступен).
3. В `.env.local` должен быть `NEXT_PUBLIC_API_BASE_URL=http://194.32.142.253` (или ваш API).
4. Проверка API в браузере: http://localhost:3000/api/proxy/v1/public/products?limit=3 — должен вернуть JSON.
5. У части товаров на складе нет фото — показывается заглушка «Нет фото»; это нормально.

## Сборка (прод)

```bash
# env должны быть заданы ДО build
export NEXT_PUBLIC_SITE_URL=https://chparts.kz
export NEXT_PUBLIC_API_BASE_URL=https://ВАШ-API
npm run build
npm start
```
