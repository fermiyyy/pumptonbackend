# 📦 GitHub → Railway - Пошаговая инструкция

## 🎯 Что загружать на GitHub

### ✅ Загружаем ВСЁ из папки `hosting-deploy-upload/`

```
hosting-deploy-upload/          ← Эту папку загружаем на GitHub
├── index.html                  ✅ Загружаем
├── tonconnect-manifest.json    ✅ Загружаем
├── railway.json                ✅ Загружаем (для Railway)
├── .gitignore                  ✅ Загружаем (защита от .env)
│
├── api/                        ✅ Загружаем ВСЮ папку
│   ├── server.js
│   ├── fee-calculator.js
│   ├── jetton-deployer.js
│   ├── compiled-contracts.js
│   ├── package.json
│   ├── .env.example            ✅ Пример (не .env!)
│   ├── railway.toml
│   └── Procfile
│
└── Документация/               ✅ Можно загрузить (опционально)
    ├── README.md
    ├── _START_HERE_DEPLOY.md
    ├── QUICK_DEPLOY_GUIDE.md
    └── ...
```

### ❌ НЕ загружаем

```
api/.env                        ❌ НИКОГДА! (секретные ключи)
node_modules/                   ❌ Установится автоматически
package-lock.json               ❌ Создастся автоматически
.DS_Store                       ❌ Системные файлы
```

---

## 🚀 Пошаговая инструкция

### Шаг 1: Подготовка Git репозитория

```bash
# 1. Перейдите в папку проекта
cd pump.ton/hosting-deploy-upload

# 2. Инициализируйте Git (если ещё не сделали)
git init

# 3. Добавьте все файлы
git add .

# 4. Сделайте первый коммит
git commit -m "Initial commit: Pump.Ton ready for deployment"
```

### Шаг 2: Создание репозитория на GitHub

1. Откройте [github.com](https://github.com/)
2. Нажмите **"New repository"** (зелёная кнопка)
3. Заполните:
   - **Repository name**: `pump-ton` (или любое имя)
   - **Description**: `TON Blockchain Token Platform`
   - **Public** или **Private** (ваш выбор)
   - ❌ **НЕ** добавляйте README, .gitignore, license (у нас уже есть)
4. Нажмите **"Create repository"**

### Шаг 3: Подключение и загрузка

```bash
# 1. Добавьте remote (замените YOUR-USERNAME на ваш username)
git remote add origin https://github.com/YOUR-USERNAME/pump-ton.git

# 2. Загрузите код
git branch -M main
git push -u origin main

# ✅ Готово! Код на GitHub
```

---

## 🚂 Railway: Деплой с GitHub

### Шаг 1: Подключение репозитория

1. Откройте [railway.app](https://railway.app/)
2. Нажмите **"New Project"**
3. Выберите **"Deploy from GitHub repo"**
4. Выберите репозиторий **`pump-ton`**
5. Railway начнёт автоматический деплой

### Шаг 2: Настройка Root Directory

⚠️ **ВАЖНО**: Backend находится в подпапке `api`

1. В Railway откройте ваш проект
2. Перейдите в **Settings**
3. Найдите **Root Directory**
4. Установите: `api`
5. Нажмите **Save**

### Шаг 3: Environment Variables

В Railway перейдите в **Variables** и добавьте:

```env
TON_API_KEY=ваш_ключ_с_toncenter.com
PLATFORM_WALLET_ADDRESS=UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
NODE_ENV=production
PORT=3001
TARGET_FEE_USD=2.0
MIN_FEE_TON=0.5
MAX_FEE_TON=10
CORS_ORIGIN=*
```

**Где получить TON_API_KEY:**
- Перейдите на [toncenter.com](https://toncenter.com/)
- Нажмите "Get API Key"
- Скопируйте ключ

### Шаг 4: Деплой

Railway автоматически:
1. ✅ Обнаружит Node.js проект
2. ✅ Установит зависимости (`npm install`)
3. ✅ Запустит сервер (`node server.js`)

Через 2-3 минуты получите URL:
```
https://your-app-name.up.railway.app
```

### Шаг 5: Проверка

```bash
# Тест health check
curl https://your-app-name.up.railway.app/health

# Ожидаемый ответ:
{
  "status": "ok",
  "timestamp": "2025-01-29T...",
  "tokens": 0,
  "trades": 0
}
```

✅ **Backend на Railway работает!**

---

## 📝 Структура которая попадёт на GitHub

```
pump-ton/                       ← Корень репозитория
├── .gitignore                  ← Защита от .env
├── index.html                  ← Frontend
├── tonconnect-manifest.json
├── railway.json                ← Railway config
│
├── api/                        ← Backend (Railway смотрит сюда)
│   ├── server.js              ← Главный файл
│   ├── fee-calculator.js
│   ├── jetton-deployer.js
│   ├── compiled-contracts.js
│   ├── package.json           ← Зависимости
│   ├── .env.example           ← Пример переменных
│   ├── railway.toml           ← Railway конфиг
│   └── Procfile               ← Start command
│
└── README.md                   ← Описание проекта
```

---

## 🔄 Автоматический деплой (CI/CD)

После первой настройки Railway будет автоматически деплоить при каждом push:

```bash
# 1. Внесите изменения в код
# 2. Коммит
git add .
git commit -m "Update: улучшение дизайна"

# 3. Push
git push origin main

# 4. Railway автоматически обнаружит изменения и сделает редеплой
# ✅ Новая версия через 2-3 минуты
```

---

## 🎯 Проверка перед загрузкой

### Чек-лист файлов:

- [ ] ✅ `api/package.json` есть
- [ ] ✅ `api/server.js` есть
- [ ] ✅ `api/.env.example` есть (НЕ .env!)
- [ ] ✅ `api/railway.toml` есть
- [ ] ✅ `api/Procfile` есть
- [ ] ✅ `.gitignore` есть
- [ ] ❌ `api/.env` НЕТ в Git
- [ ] ❌ `node_modules/` НЕТ в Git

### Проверка .gitignore:

```bash
# Убедитесь что .env игнорируется:
git status

# Не должно быть:
# api/.env
# node_modules/

# Должно быть:
# api/.env.example ✅
```

---

## 🔐 Безопасность

### ⚠️ НИКОГДА не коммитьте:

```
❌ api/.env                     # Содержит секретные ключи!
❌ .env.local
❌ .env.production
❌ TON_API_KEY в коде
❌ Private keys
❌ Пароли
```

### ✅ Вместо этого:

1. **Локально**: используйте `api/.env`
2. **GitHub**: загрузите `api/.env.example`
3. **Railway**: установите Variables в dashboard

---

## 📊 После деплоя на Railway

### 1. Получите Railway URL

Railway даст вам URL вида:
```
https://pump-ton-api-production.up.railway.app
```

### 2. Обновите Frontend

В `index.html` найдите `window.APP_CONFIG` и обновите:

```javascript
backendUrl: 'https://pump-ton-api-production.up.railway.app',
wsUrl: 'wss://pump-ton-api-production.up.railway.app'
```

### 3. Задеплойте Frontend

На Netlify/Vercel/GitHub Pages:

```bash
# Netlify
cd pump.ton/hosting-deploy-upload
netlify deploy --prod

# Или drag & drop на netlify.com
```

---

## 🆘 Troubleshooting

### Проблема: Railway не находит package.json

**Решение:**
```
Settings → Root Directory → Установите: api
```

### Проблема: "Build failed"

**Проверьте:**
1. `api/package.json` существует
2. Все зависимости указаны
3. `node` версия совместима (>=16)

### Проблема: "Application failed to respond"

**Проверьте:**
1. Environment Variables установлены
2. `PORT` установлен на 3001
3. Логи в Railway dashboard

### Проблема: .env попал в Git

**Исправление:**
```bash
# 1. Удалите из Git
git rm --cached api/.env

# 2. Добавьте в .gitignore
echo "api/.env" >> .gitignore

# 3. Коммит
git add .gitignore
git commit -m "Fix: remove .env from Git"
git push
```

---

## 💡 Полезные команды

### Git

```bash
# Посмотреть статус
git status

# Посмотреть что будет закоммичено
git diff

# Посмотреть историю
git log --oneline

# Отменить последний коммит (локально)
git reset --soft HEAD~1
```

### Railway CLI (опционально)

```bash
# Установка
npm install -g @railway/cli

# Логин
railway login

# Посмотреть логи
railway logs

# Открыть dashboard
railway open
```

---

## ✅ Финальный чек-лист

Перед деплоем убедитесь:

- [ ] Код загружен на GitHub
- [ ] `.env` НЕ в Git
- [ ] `.gitignore` работает
- [ ] Railway подключён к GitHub repo
- [ ] Root Directory установлен на `api`
- [ ] Environment Variables добавлены
- [ ] Backend задеплоен и работает
- [ ] Frontend обновлён с Railway URL
- [ ] Всё протестировано

---

## 🎉 Готово!

Ваш деплой схема:

```
Локальный код
    ↓ git push
GitHub repo
    ↓ Railway auto-deploy
Railway backend (production)
    ↓ API calls
Frontend (Netlify)
    ↓
Пользователи 🚀
```

---

## 📚 Дополнительные ресурсы

- **Railway Docs**: https://docs.railway.app/
- **Git Basics**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/

---

**🚀 Успешного деплоя!**

*Следующий шаг: `QUICK_DEPLOY_GUIDE.md`*

