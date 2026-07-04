# 🚀 Quick Start Guide — CHPARTS

## ⚡ Быстрый запуск

```bash
# 1. Установить зависимости
npm install

# 2. Запустить dev сервер
npm run dev

# 3. Открыть в браузере
# http://localhost:3000
```

---

## 🔧 Конфигурация

### Environment Variables

Убедитесь что у вас есть `.env.local`:

```bash
# Backend API (development)
NEXT_PUBLIC_API_BASE_URL=http://194.32.142.253

# Сайт URL (для Open Graph, canonical)
NEXT_PUBLIC_SITE_URL=https://chparts.kz
```

---

## 🧪 Тестирование

### Быстрый тест корзины

1. Перейти на главную
2. Нажать на товар → открыть любой товар
3. Нажать "В корзину"
4. Открыть корзину (иконка в шапке)
5. Проверить:
   - ✓ Товар добавлен
   - ✓ Сумма считается
   - ✓ Можно увеличить/уменьшить количество
6. Заполнить форму:
   - Имя: `Иван Петров`
   - Телефон: `+7 700 123 45 67`
   - Выбрать способ доставки
7. Нажать "Оформить заказ"
8. Если всё ОК → должен появиться Success экран

### Тест ошибок

```javascript
// Открыть DevTools Console и выполнить:
throw new Error("Test error");
// Должна появиться error.tsx страница

// Или открыть несуществующую URL
# http://localhost:3000/this-page-does-not-exist
# Должна появиться not-found.tsx страница
```

### Мобильный тест

1. Открыть DevTools (F12)
2. Включить Device Emulation (Ctrl+Shift+M)
3. Выбрать iPhone 12 Pro
4. Проверить:
   - Форма читаемая
   - Кнопки нажимаемые (не слишком маленькие)
   - Нет горизонтального скролла

---

## 📦 Production Build

```bash
# Собрать для production
npm run build

# Запустить production сервер локально
npm run start

# Проверить размер бундла
npm run build
# Ищите строку "Λ analyzed X.XXmb"
```

---

## 🎨 Компоненты для использования

### Alert (уведомление об ошибке)

```tsx
import Alert from "@/components/ui/Alert";

<Alert
  type="error"
  title="Ошибка"
  message="Это сообщение об ошибке"
  onClose={() => setError(null)}
/>
```

### FormField (поле с валидацией)

```tsx
import FormField from "@/components/ui/FormField";

<FormField
  label="Имя"
  required
  error={fieldErrors.name}
  hint="Укажите полное имя"
>
  <input value={name} onChange={(e) => setName(e.target.value)} />
</FormField>
```

### Skeleton (для loading)

```tsx
import { CartItemSkeleton } from "@/components/ui/Skeleton";

{isLoading && <CartItemSkeleton />}
```

---

## 🐛 Debugging

### Включить детальное логирование

```typescript
// В lib/publicApi.ts добавьте:
if (process.env.NODE_ENV === "development") {
  console.log("API Request:", url, options);
}
```

### Проверить API запросы

1. Открыть DevTools → Network
2. Профильтровать по XHR
3. Добавить товар в корзину
4. Должны увидеть запрос к API

### Проверить LocalStorage

```javascript
// DevTools Console
localStorage.getItem('cnparts-cart');
// Должен вернуть JSON с товарами
```

---

## 📝 Файли для учёта

- **IMPROVEMENTS.md** — что добавлено
- **CHECKLIST.md** — тестирование перед релизом
- **BACKEND_FASTAPI_PUBLIC_API.md** — API спецификация
- **README.md** — основная информация

---

## 🚀 Деплой на Vercel

### Вариант 1: Git + Vercel (рекомендуется)

```bash
# 1. Залить на GitHub
git remote add origin https://github.com/yourusername/klient-app.git
git push -u origin main

# 2. Открить vercel.com
# → Нажать "New Project"
# → Выбрать GitHub repo
# → Vercel автоматически детектит Next.js
# → Нажать Deploy

# 3. Настроить Environment Variables в Vercel
# NEXT_PUBLIC_API_BASE_URL=https://api.sklad.kz
# NEXT_PUBLIC_SITE_URL=https://ваш-домен.kz
```

### Вариант 2: Docker (если у вас свой сервер)

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

```bash
docker build -t chparts .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.sklad.kz \
  -e NEXT_PUBLIC_SITE_URL=https://chparts.kz \
  chparts
```

---

## 📞 Support

- **API**: http://194.32.142.253 (development)
- **API**: https://api.sklad.kz (production)
- **WhatsApp**: Встроен в приложение
- **Issues**: Создавайте в GitHub Issues

---

## 💡 Tips & Tricks

### Hot Module Replacement
Любые изменения в коде автоматически обновляют браузер (если `npm run dev` запущен)

### Быстрые клавиши в DevTools
- `F12` — открить DevTools
- `Ctrl+Shift+M` — Device Emulation
- `Ctrl+Shift+Delete` — Очистить Cache

### Проверить что нет ошибок
```bash
npm run lint
# Должно быть без ошибок
```

---

## ✅ Готово!

Если все тесты из CHECKLIST.md пройдены → готово к выпуску 🎉
