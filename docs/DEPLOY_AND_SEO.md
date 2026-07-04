# Деплой CHParts и настройка SEO

## 1. Подготовка сервера

Нужны:
- **Node.js 20+**
- **Домен** с HTTPS (например `https://chparts.kz`)
- **Бэкенд SkladPro** с публичным API (`/api/v1/public/products`, категории, заказы)

## 2. Переменные окружения

Создайте `.env.local` (или задайте в панели хостинга **до сборки**):

```env
NEXT_PUBLIC_API_BASE_URL=https://ВАШ-IP-ИЛИ-API-ДОМЕН
NEXT_PUBLIC_SITE_URL=https://chparts.kz
```

| Переменная | Зачем |
|------------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | Адрес склада; прокси `/api/proxy/*` → бэкенд |
| `NEXT_PUBLIC_SITE_URL` | Canonical, Open Graph, `sitemap.xml`, `robots.txt` |

> **Важно:** после смены API или домена нужна **пересборка** (`npm run build`).

## 3. Сборка и запуск

```bash
cd klient-app
npm ci
npm run build
npm start
```

Порт по умолчанию: **3000**. На сервере используйте PM2, systemd или nginx reverse proxy.

### Пример nginx

```nginx
server {
  listen 443 ssl http2;
  server_name chparts.kz www.chparts.kz;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Редирект `www` → без `www` (или наоборот) — один канонический домен для SEO.

## 4. Что уже настроено для SEO

| Файл | Назначение |
|------|------------|
| `app/layout.tsx` | title, description, Open Graph, Twitter, keywords |
| `app/sitemap.ts` | `/sitemap.xml` — главная, каталог, товары (до 5000) |
| `app/robots.ts` | `/robots.txt` — закрыты `/cart`, `/orders`, `/favorites` |
| `app/opengraph-image.tsx` | Картинка для соцсетей |
| `app/catalog/[id]/page.tsx` | `generateMetadata` + JSON-LD Product для каждого товара |
| `lib/siteConfig.ts` | Единый `SITE_URL` |

Проверка после деплоя:
- `https://chparts.kz/robots.txt`
- `https://chparts.kz/sitemap.xml`
- Карточка товара — «Просмотр кода» → `<title>`, `og:title`, `application/ld+json`

## 5. Google Search Console

1. Зайдите в [Google Search Console](https://search.google.com/search-console)
2. Добавьте ресурс **Домен** или **URL-префикс** `https://chparts.kz`
3. Подтвердите владение одним из способов:
   - **HTML-тег** — добавьте в `app/layout.tsx`:
     ```ts
     verification: { google: "ВАШ_КОД" },
     ```
   - или DNS TXT-запись у регистратора
4. Отправьте sitemap: **`https://chparts.kz/sitemap.xml`**
5. Запросите индексацию главной и каталога (необязательно для всех URL)

## 6. Yandex Webmaster

1. [webmaster.yandex.ru](https://webmaster.yandex.ru) → добавить сайт
2. Подтверждение — meta-тег или файл (аналогично Google)
3. Указать sitemap: `https://chparts.kz/sitemap.xml`

## 7. Рекомендации по контенту

- Заполните **категории и характеристики** товаров в SkladPro — они попадают в карточку и описание для SEO
- У товаров должны быть **фото** — используются в Open Graph
- В **Контактах** актуальные телефон и WhatsApp (`lib/siteContacts.ts`)

## 8. Порядок обновления после изменений

1. Обновить **бэкенд** SkladPro (миграции БД)
2. Задать env → `npm run build` → перезапустить Node
3. В Search Console — «Проверить URL» для изменённых страниц

## 9. Чеклист перед выкладкой

- [ ] `NEXT_PUBLIC_SITE_URL` = production HTTPS
- [ ] `NEXT_PUBLIC_API_BASE_URL` доступен с сервера витрины
- [ ] `npm run build` без ошибок
- [ ] `/catalog` открывается, товары грузятся
- [ ] `/sitemap.xml` и `/robots.txt` отдают 200
- [ ] SSL сертификат активен
- [ ] Search Console + sitemap отправлен
