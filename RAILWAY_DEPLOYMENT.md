# 🚂 Railway Deployment Guide

## Быстрый деплой на Railway

Railway - это современная платформа для деплоя, которая автоматически определяет настройки из вашего кода.

---

## 📋 Что нужно перед началом

1. **Аккаунт на Railway**
   - Зарегистрируйтесь на [railway.app](https://railway.app/)
   - Подключите свой GitHub аккаунт

2. **TON API Key**
   - Получите на [toncenter.com](https://toncenter.com/)

3. **Ваш проект на GitHub** (опционально, но рекомендуется)
   - Загрузите код в GitHub репозиторий

---

## 🚀 Деплой за 5 минут

### Вариант 1: Через GitHub (Рекомендуется)

#### Шаг 1: Подготовка репозитория

```bash
# Если ещё не создали Git репозиторий:
cd pump.ton/hosting-deploy-upload
git init
git add .
git commit -m "Initial commit"

# Создайте репозиторий на GitHub и подключите:
git remote add origin https://github.com/ваш-username/pump-ton.git
git push -u origin main
```

#### Шаг 2: Создание проекта на Railway

1. Откройте [railway.app](https://railway.app/)
2. Нажмите **"New Project"**
3. Выберите **"Deploy from GitHub repo"**
4. Выберите ваш репозиторий `pump-ton`
5. Railway автоматически обнаружит Node.js проект

#### Шаг 3: Настройка переменных окружения

В Railway dashboard перейдите в **Variables** и добавьте:

```env
TON_API_KEY=ваш_ключ_с_toncenter.com
PLATFORM_WALLET_ADDRESS=UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
PORT=3001
NODE_ENV=production
TARGET_FEE_USD=2.0
MIN_FEE_TON=0.5
MAX_FEE_TON=10
CORS_ORIGIN=*
```

**Важно**: `PORT` будет автоматически установлен Railway, но лучше явно указать 3001.

#### Шаг 4: Настройка Root Directory

Так как backend находится в папке `api`, нужно указать это:

1. В Railway перейдите в **Settings**
2. Найдите **Root Directory**
3. Установите: `hosting-deploy-upload/api`
4. Нажмите **Save**

#### Шаг 5: Деплой

Railway автоматически запустит деплой. Вы увидите логи в реальном времени.

После успешного деплоя вы получите URL вида:
```
https://your-app-name.up.railway.app
```

---

### Вариант 2: Через Railway CLI

#### Установка CLI

```bash
# Windows (через npm)
npm install -g @railway/cli

# macOS/Linux
brew install railwayapp/tap/railway
```

#### Логин

```bash
railway login
```

#### Деплой

```bash
cd hosting-deploy-upload/api

# Инициализация проекта
railway init

# Добавьте переменные окружения
railway variables set TON_API_KEY=ваш_ключ
railway variables set PLATFORM_WALLET_ADDRESS=UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
railway variables set PORT=3001
railway variables set NODE_ENV=production

# Деплой
railway up
```

---

## 🌐 Настройка Frontend

После деплоя backend на Railway, обновите frontend:

### Шаг 1: Получите URL вашего Railway бэкенда

Например: `https://pump-ton-api.up.railway.app`

### Шаг 2: Обновите `index.html`

Найдите секцию `window.APP_CONFIG` и замените:

```javascript
backendUrl: 'https://pump-ton-api.up.railway.app',  // Ваш Railway URL
wsUrl: 'wss://pump-ton-api.up.railway.app'
```

Или используйте автоопределение (уже добавлено):

```javascript
backendUrl: window.location.hostname.includes('railway')
    ? 'https://pump-ton-api.up.railway.app' // Ваш Railway URL
    : 'https://your-backend-url.com',
```

### Шаг 3: Обновите `tonconnect-manifest.json`

```json
{
  "url": "https://your-domain.com",  // Ваш frontend домен
  "name": "Pump Ton",
  "iconUrl": "https://your-domain.com/icon.png"
}
```

---

## 🎨 Деплой Frontend

### Рекомендуемые платформы:

#### 1. **Netlify** (Рекомендуется)

```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Логин
netlify login

# Деплой
cd hosting-deploy-upload
netlify deploy --prod

# Укажите директорию: . (текущая)
```

**Или через UI:**
1. Перейдите на [netlify.com](https://netlify.com/)
2. Drag & Drop папку `hosting-deploy-upload`
3. Готово!

#### 2. **Vercel**

```bash
# Установите Vercel CLI
npm install -g vercel

# Логин и деплой
cd hosting-deploy-upload
vercel --prod
```

#### 3. **GitHub Pages**

```bash
# В корне репозитория создайте gh-pages ветку
git checkout -b gh-pages
cp -r hosting-deploy-upload/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Включите GitHub Pages в Settings → Pages
```

#### 4. **Cloudflare Pages**

1. Перейдите на [pages.cloudflare.com](https://pages.cloudflare.com/)
2. Подключите GitHub репозиторий
3. Build directory: `hosting-deploy-upload`
4. Deploy

---

## 🔧 Настройка Custom Domain

### Railway (Backend)

1. В Railway dashboard откройте ваш проект
2. Перейдите в **Settings**
3. Найдите **Domains**
4. Нажмите **Generate Domain** или **Custom Domain**
5. Если custom domain:
   - Введите ваш домен (например: `api.pumpton.com`)
   - Добавьте CNAME запись в вашем DNS:
     ```
     api.pumpton.com  CNAME  your-app.up.railway.app
     ```

### Netlify (Frontend)

1. В Netlify dashboard откройте сайт
2. Перейдите в **Domain settings**
3. Нажмите **Add custom domain**
4. Введите ваш домен (например: `pumpton.com`)
5. Следуйте инструкциям для настройки DNS

---

## ✅ Проверка деплоя

### Backend (Railway)

```bash
# Health check
curl https://your-app.up.railway.app/health

# Fee calculator
curl https://your-app.up.railway.app/api/tokens/creation-fee
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "timestamp": "2025-01-29T...",
  "tokens": 0,
  "trades": 0
}
```

### Frontend

1. Откройте ваш frontend URL
2. Проверьте что TON Connect кнопка отображается
3. Попробуйте подключить кошелёк
4. Откройте DevTools (F12) → Console
5. Не должно быть CORS ошибок

---

## 🐛 Решение проблем

### Backend не запускается

**Проблема**: "Application failed to respond"

**Решение**:
1. Проверьте логи в Railway dashboard
2. Убедитесь что все переменные окружения установлены
3. Проверьте что `PORT` переменная правильная
4. Убедитесь что Root Directory установлен на `hosting-deploy-upload/api`

### CORS ошибки

**Проблема**: "Access-Control-Allow-Origin" error

**Решение**:
```env
# В Railway variables добавьте:
CORS_ORIGIN=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

Или разрешите все (не рекомендуется для production):
```env
CORS_ORIGIN=*
```

### WebSocket не подключается

**Проблема**: "WebSocket connection failed"

**Решение**:
1. Убедитесь что используете `wss://` (не `ws://`)
2. Railway автоматически поддерживает WebSocket
3. Проверьте что backend URL правильный в `APP_CONFIG`

### Tokens не создаются

**Проблема**: "Payment verification failed"

**Решение**:
1. Проверьте `TON_API_KEY` в Railway variables
2. Убедитесь что `PLATFORM_WALLET_ADDRESS` правильный
3. Проверьте логи backend для деталей

---

## 📊 Мониторинг

### Railway Dashboard

Railway предоставляет встроенный мониторинг:

1. **Metrics**
   - CPU usage
   - Memory usage
   - Network traffic

2. **Logs**
   - Real-time logs
   - Search и filter
   - Download logs

3. **Deployments**
   - История деплоев
   - Rollback на предыдущие версии

### Настройка Alerts

В Railway можно настроить уведомления:

1. Settings → Notifications
2. Добавьте webhook для Slack/Discord
3. Выберите события (deploy failed, high memory, etc.)

---

## 💰 Стоимость

### Railway Pricing

- **Free Tier**: $5 credits/month (достаточно для начала)
- **Pro Plan**: $20/month + usage

### Рекомендации:

Для старта используйте Free tier. Когда трафик вырастет, переключитесь на Pro.

**Оценка расходов** (Pro plan):
- Backend: ~$5-10/month (зависит от трафика)
- Всего: $25-30/month

---

## 🔄 Continuous Deployment

Railway автоматически делает редеплой при push в GitHub:

1. Измените код локально
2. Commit и push в GitHub
3. Railway автоматически обнаружит изменения
4. Начнётся новый деплой

**Настройка:**

В Railway Settings → **Deployments**:
- Auto Deploy: ON
- Branch: main (или ваша ветка)

---

## 📚 Полезные команды

### Railway CLI

```bash
# Посмотреть логи
railway logs

# Открыть dashboard
railway open

# Подключиться к БД (если используете)
railway connect

# Список переменных
railway variables

# Статус проекта
railway status

# Удалить проект
railway delete
```

---

## 🎯 Чек-лист деплоя

- [ ] Backend на Railway задеплоен
- [ ] Все environment variables установлены
- [ ] Health check работает (`/health`)
- [ ] CORS настроен правильно
- [ ] WebSocket работает
- [ ] Frontend задеплоен (Netlify/Vercel)
- [ ] APP_CONFIG обновлён с Railway URL
- [ ] tonconnect-manifest.json обновлён
- [ ] Custom domain настроен (опционально)
- [ ] TON Connect работает
- [ ] Создание токенов работает
- [ ] Real-time обновления работают

---

## 🚀 После деплоя

1. **Протестируйте всё**
   - Подключение кошелька
   - Создание токена
   - Торговлю
   - Real-time обновления

2. **Мониторинг**
   - Следите за логами первые дни
   - Проверяйте метрики в Railway

3. **Backup**
   - Railway автоматически делает snapshots
   - Но держите копию кода в GitHub

4. **Масштабирование**
   - При росте трафика переключитесь на Pro план
   - Добавьте БД (PostgreSQL/MongoDB) при необходимости

---

## 💡 Советы

1. **Environment Variables**
   - Никогда не коммитьте `.env` в Git
   - Используйте Railway variables

2. **Logs**
   - Регулярно проверяйте логи
   - Настройте alerts для критических ошибок

3. **Updates**
   - Держите зависимости обновлёнными
   - `npm audit` для проверки уязвимостей

4. **Backup**
   - Регулярный backup БД (если используете)
   - Git для кода

---

## 📞 Поддержка

- **Railway Docs**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **TON Developers**: https://t.me/tondev

---

**✅ Готово! Ваша платформа задеплоена и готова к использованию!**

*Желаем успешного запуска! 🚀*

