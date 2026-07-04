#!/usr/bin/env bash
# 🚀 CHPARTS — Deploy Ready! 
# Финальный чек-лист перед выпуском

echo "=================================="
echo "🎨 CHPARTS — Pre-Release Checker"
echo "=================================="
echo ""

# Проверка файлов
echo "📁 Проверка файлов..."
files=(
  "app/error.tsx"
  "app/not-found.tsx"
  "components/ui/Alert.tsx"
  "components/ui/FormField.tsx"
  "components/ui/Skeleton.tsx"
  "lib/checkoutValidation.ts"
  "lib/apiErrorHandler.ts"
  "IMPROVEMENTS.md"
  "CHECKLIST.md"
  "QUICKSTART.md"
  "SUMMARY.md"
)

missing=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ MISSING: $file"
    missing=$((missing + 1))
  fi
done

echo ""
if [ $missing -eq 0 ]; then
  echo "✨ Все файлы на месте!"
else
  echo "⚠️  Недостаёт $missing файлов"
  exit 1
fi

echo ""
echo "📦 Проверка зависимостей..."
if [ -d "node_modules" ]; then
  echo "✅ node_modules найдены"
else
  echo "⚠️  node_modules НЕ найдены"
  echo "   Запустите: npm install"
  exit 1
fi

