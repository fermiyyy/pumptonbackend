# ⚡ Быстрый гайд по деплою

## 🎯 Цель: Frontend на хостинге, Backend на Railway

---

## 📦 Что у нас есть

```
hosting-deploy-upload/
├── index.html          ← Frontend (готов к деплою)
├── tonconnect-manifest.json
├── api/               ← Backend (готов для Railway)
│   ├── server.js
│   ├── fee-calculator.js
│   ├── jetton-deployer.js
│   ├── compiled-contracts.js
│   ├── package.json
│   ├── .env.example
│   ├── railway.toml   ← Конфиг для Railway
│   └── Procfile       ← Для Railway
└── railway.json       ← Основной конфиг Railway
```

---

## 🚀 Шаг 1: Деплой Backend на Railway (5 минут)

### 1.1 Зарегистрируйтесь на Railway

1. Откройте [railway.app](https://railway.app/)
2. Нажмите **"Start a New Project"**
3. Подключите GitHub (или деплойте напрямую)

### 1.2 Создайте проект

**Вариант A: Через GitHub (Рекомендуется)**

```bash
# 1. Создайте Git репозиторий (если ещё нет)
cd pump.ton
git init
git add .
git commit -m "Initial commit"

# 2. Загрузите на GitHub
# Создайте новый repo на github.com
git remote add origin https://github.com/ваш-username/pump-ton.git
git push -u origin main

# 3. В Railway:
# - New Project → Deploy from GitHub repo
# - Выберите pump-ton repo
```

**Вариант B: Прямой деплой (Быстрее)**

1. В Railway нажмите **"Deploy from GitHub repo"**
2. Или используйте **"Empty Project"** и загрузите код

### 1.3 Настройте Root Directory

⚠️ **ВАЖНО**: Backend находится в папке `api`

1. Railway Settings → **Root Directory**
2. Установите: `hosting-deploy-upload/api`
3. Save

### 1.4 Добавьте Environment Variables

В Railway Variables добавьте:

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
1. Перейдите на [toncenter.com](https://toncenter.com/)
2. Нажмите "Get API Key"
3. Скопируйте ключ

### 1.5 Деплой

Railway автоматически начнёт деплой. Через 2-3 минуты вы получите URL:

```
https://your-app-name.up.railway.app
```

**Сохраните этот URL!** Он понадобится для frontend.

### 1.6 Проверка

```bash
# Тест health check
curl https://your-app-name.up.railway.app/health

# Должен вернуть:
{"status":"ok","timestamp":"...","tokens":0,"trades":0}
```

✅ **Backend готов!**

---

## 🎨 Шаг 2: Деплой Frontend на хостинг (3 минуты)

### 2.1 Обновите конфиг

Откройте `hosting-deploy-upload/index.html` и найдите `window.APP_CONFIG`.

Замените URLs на ваши Railway URLs:

```javascript
backendUrl: 'https://your-app-name.up.railway.app',  // ← Ваш Railway URL
wsUrl: 'wss://your-app-name.up.railway.app'           // ← С wss://
```

### 2.2 Обновите TON Connect Manifest

Откройте `hosting-deploy-upload/tonconnect-manifest.json`:

```json
{
  "url": "https://ваш-домен.com",  // ← URL где будет frontend
  "name": "Pump Ton",
  "iconUrl": "https://ваш-домен.com/icon.png"
}
```

### 2.3 Выберите хостинг

#### Option A: Netlify (Самый простой)

```bash
# 1. Установите Netlify CLI
npm install -g netlify-cli

# 2. Логин
netlify login

# 3. Деплой
cd hosting-deploy-upload
netlify deploy --prod

# Следуйте инструкциям:
# - Deploy path: . (текущая директория)
```

**Или через UI:**
1. [app.netlify.com](https://app.netlify.com/)
2. Drag & Drop папку `hosting-deploy-upload`
3. Готово!

#### Option B: Vercel

```bash
# 1. Установите Vercel CLI
npm install -g vercel

# 2. Деплой
cd hosting-deploy-upload
vercel --prod
```

#### Option C: GitHub Pages

```bash
# 1. Создайте gh-pages ветку
git checkout -b gh-pages
cp -r hosting-deploy-upload/* .
git add .
git commit -m "Deploy"
git push origin gh-pages

# 2. Включите GitHub Pages в repo Settings
```

#### Option D: Cloudflare Pages

1. [pages.cloudflare.com](https://pages.cloudflare.com/)
2. Подключите GitHub repo
3. Build directory: `hosting-deploy-upload`
4. Deploy

### 2.4 Получите Frontend URL

После деплоя вы получите URL, например:
- Netlify: `https://pump-ton.netlify.app`
- Vercel: `https://pump-ton.vercel.app`
- GitHub Pages: `https://username.github.io/pump-ton`

✅ **Frontend готов!**

---

## 🔧 Шаг 3: Финальная настройка (2 минуты)

### 3.1 Обновите CORS на Railway

Теперь когда вы знаете frontend URL, обновите CORS:

```env
CORS_ORIGIN=https://pump-ton.netlify.app,https://www.pump-ton.netlify.app
```

### 3.2 Обновите tonconnect-manifest.json

Замените URL на реальный frontend URL:

```json
{
  "url": "https://pump-ton.netlify.app",
  "name": "Pump Ton"
}
```

### 3.3 Редеплой frontend

Если изменили конфиг, загрузите обновлённую версию на хостинг.

---

## ✅ Шаг 4: Проверка (2 минуты)

### 4.1 Откройте ваш сайт

```
https://pump-ton.netlify.app
```

### 4.2 Проверьте функционал

- [ ] Сайт загружается
- [ ] Нет ошибок в консоли (F12)
- [ ] Кнопка "Подключить кошелёк" работает
- [ ] TON Connect открывается
- [ ] После подключения кошелька показывается адрес
- [ ] Форма "Создать токен" работает

### 4.3 Создайте тестовый токен

1. Подключите TON кошелёк
2. Перейдите в "Создать"
3. Заполните форму:
   - Название: Test Token
   - Тикер: TEST
4. Нажмите "Создать токен"
5. Подтвердите оплату в кошельке
6. Токен должен появиться в списке

✅ **Всё работает!**

---

## 🎉 Готово!

Ваша платформа полностью задеплоена:

- ✅ **Backend**: Railway (автоматический restart, scaling, monitoring)
- ✅ **Frontend**: Netlify/Vercel (CDN, HTTPS, Custom domain)
- ✅ **Blockchain**: TON Connect интеграция
- ✅ **Payments**: Автоматические комиссии ~$2 на ваш кошелёк

---

## 🌐 (Опционально) Custom Domain

### Backend (Railway)

1. Railway Settings → Domains → Add Custom Domain
2. Введите: `api.your-domain.com`
3. Добавьте CNAME в DNS:
   ```
   api.your-domain.com  CNAME  your-app.up.railway.app
   ```

### Frontend (Netlify)

1. Netlify Domain settings → Add custom domain
2. Введите: `your-domain.com`
3. Следуйте инструкциям для DNS

После настройки обновите URLs в конфиге.

---

## 💰 Мониторинг дохода

Проверяйте комиссии на TONScan:

```
https://tonscan.org/address/UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
```

Каждый созданный токен = ~$2 USD на вашем кошельке! 💎

---

## 🆘 Проблемы?

### Backend не отвечает

```bash
# Проверьте логи в Railway dashboard
# Settings → Variables → проверьте все переменные
# Deployments → посмотрите логи последнего деплоя
```

### CORS ошибки

```env
# В Railway добавьте:
CORS_ORIGIN=https://ваш-frontend-url.com
```

### TON Connect не работает

1. Проверьте `tonconnect-manifest.json`
2. URL должен совпадать с frontend URL
3. Перезагрузите страницу

---

## 📚 Полные гайды

- **Railway Deployment**: `RAILWAY_DEPLOYMENT.md`
- **Full Deployment**: `DEPLOYMENT_GUIDE.md`
- **Quick Start**: `START_HERE.md`

---

**🚀 Время деплоя: 10-15 минут**  
**💰 Стоимость: $0-5/month (Railway Free Tier)**  
**📈 Потенциал: ~$2 за каждый созданный токен**

Успехов! 🎉

