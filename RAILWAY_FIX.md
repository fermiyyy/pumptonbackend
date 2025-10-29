# 🔧 Исправление ошибки Railway

## ❌ Проблема

```
Failed to build an image
/bin/bash: line 1: npm: command not found
"cd api && npm install" did not complete successfully: exit code: 127
```

## ✅ Решение

Railway должен работать **из папки `api`**, а не из корня репозитория.

### Шаг 1: Убедитесь что Root Directory установлен

1. Откройте ваш проект на Railway
2. Settings → **Root Directory**
3. Установите: `api` (без слэша)
4. Save

### Шаг 2: Обновите конфиг файлы

Файлы `railway.json` и `api/railway.toml` уже обновлены:

**railway.json** (упрощён):
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js"
  }
}
```

**api/railway.toml** (упрощён):
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "node server.js"
```

### Шаг 3: Закоммитьте и запушьте

```bash
git add .
git commit -m "Fix: Railway configuration for api directory"
git push origin main
```

### Шаг 4: Railway автоматически редеплоит

Railway обнаружит изменения и сделает новый деплой.

Теперь всё должно работать! ✅

---

## 🎯 Правильная структура

```
Репозиторий на GitHub:
pump-ton/
├── railway.json          ← Railway читает этот файл
├── api/                  ← Root Directory указывает сюда
│   ├── package.json      ← Railway найдёт зависимости
│   ├── server.js         ← Railway запустит это
│   └── railway.toml      ← Дополнительный конфиг
└── ...

Railway настройки:
- Root Directory: api
- Build Command: (автоматически из package.json)
- Start Command: node server.js
```

---

## 📝 Что изменилось

### Было (неправильно):
```json
"buildCommand": "cd api && npm install"  ❌
"startCommand": "cd api && node server.js"  ❌
```

### Стало (правильно):
```json
// Без buildCommand - Railway сам найдёт package.json
"startCommand": "node server.js"  ✅
```

Railway автоматически:
1. Смотрит в Root Directory (`api`)
2. Находит `package.json`
3. Выполняет `npm install`
4. Запускает `node server.js`

---

## ✅ Проверка после исправления

После редеплоя вы должны увидеть:

```
✅ Build successful
✅ npm install completed
✅ Starting server: node server.js
✅ Deployment successful
```

Тест:
```bash
curl https://your-app.up.railway.app/health
```

Должен вернуть:
```json
{"status":"ok","timestamp":"..."}
```

---

## 🆘 Если всё ещё не работает

### Проверьте:

1. **Root Directory точно установлен на `api`**
   - Settings → Root Directory → `api` (БЕЗ слэша!)

2. **package.json существует в api/**
   ```bash
   ls api/package.json  # Должен существовать
   ```

3. **Все файлы закоммичены**
   ```bash
   git status  # Должно быть "nothing to commit"
   ```

4. **Посмотрите логи Railway**
   - Railway Dashboard → Deployments → View logs
   - Должно быть: "Found package.json"

---

## 💡 Альтернативное решение

Если Root Directory не помогает, можно переместить всё из `api/` в корень:

```bash
# НЕ рекомендуется, но работает:
mv api/* .
rm -rf api/
git add .
git commit -m "Move backend to root"
git push
```

Тогда Railway будет работать из корня репозитория.

Но **лучше использовать Root Directory** - так структура чище.

---

**🚀 После исправления всё заработает!**

