# 🚀 Pump.Ton - TON Blockchain Token Platform

> Современная платформа для создания и торговли токенами на TON blockchain с автоматической монетизацией

[![Railway Deploy](https://railway.app/button.svg)](https://railway.app/new)
[![Netlify Deploy](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

---

## ✨ Возможности

- 🎨 **Современный дизайн** - Анимированные градиенты, glass effects, smooth transitions
- 💎 **TON Connect** - Безопасное подключение кошельков
- 🚀 **Создание токенов** - Jetton tokens на TON blockchain
- 💱 **Торговля** - Buy/Sell функционал
- 📊 **Real-time** - WebSocket обновления цен
- 💰 **Автоматическая монетизация** - ~$2 с каждого токена
- 🔐 **Smart Fee System** - Динамический расчёт комиссий
- ⚡ **Gas Optimization** - Экономия 60% на комиссиях

---

## 🎯 Быстрый старт

### Вариант 1: GitHub → Railway (Рекомендуется)

**1. Загрузите на GitHub:**
```bash
cd pump.ton/hosting-deploy-upload
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/pump-ton.git
git push -u origin main
```

**2. Деплой на Railway:**
- Откройте [railway.app](https://railway.app/)
- New Project → Deploy from GitHub repo
- Settings → Root Directory: `api`
- Variables → Добавьте `TON_API_KEY` и другие
- ✅ Готово!

**3. Деплой Frontend:**
```bash
# Обновите backendUrl в index.html на ваш Railway URL
netlify deploy --prod
```

📖 **Детальная инструкция**: [`GITHUB_TO_RAILWAY.md`](GITHUB_TO_RAILWAY.md)

### Вариант 2: Локальный запуск

```bash
# Backend
cd api
npm install
cp .env.example .env
# Отредактируйте .env (добавьте TON_API_KEY)
node server.js

# Frontend
# Откройте index.html в браузере
# Или: npx http-server ./ -p 3000
```

---

## 📁 Структура проекта

```
pump.ton/hosting-deploy-upload/
├── 🎨 index.html              # Frontend (готов к деплою)
├── 🔧 tonconnect-manifest.json
├── 🚂 railway.json            # Railway конфигурация
├── 📝 .gitignore
│
├── api/                       # Backend (для Railway)
│   ├── server.js             # Express API + WebSocket
│   ├── fee-calculator.js     # Smart fee system (~$2/token)
│   ├── jetton-deployer.js    # Blockchain integration
│   ├── compiled-contracts.js # Real Jetton contracts
│   ├── package.json
│   ├── .env.example          # Environment variables template
│   ├── railway.toml          # Railway backend config
│   └── Procfile              # Start command
│
└── 📚 Документация/
    ├── 📖 GITHUB_TO_RAILWAY.md      ← Начните здесь!
    ├── ⚡ QUICK_DEPLOY_GUIDE.md
    ├── 🚂 RAILWAY_DEPLOYMENT.md
    └── ...
```

---

## 🔧 Конфигурация

### Environment Variables (Railway)

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

---

## 💰 Монетизация

### Автоматический доход

Каждый созданный токен → **~$2 USD** на ваш кошелёк

```
TON Wallet: UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
TONScan: https://tonscan.org/address/UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
```

### Потенциальный доход

| Токенов/день | Доход/день | Доход/месяц |
|--------------|------------|-------------|
| 10           | $20        | $600        |
| 100          | $200       | $6,000      |
| 1,000        | $2,000     | $60,000     |

---

## 🎨 Технологии

### Frontend
- HTML5 + CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- TON Connect UI
- Socket.IO Client
- Google Identity Services

### Backend
- Node.js 16+
- Express.js
- Socket.IO (WebSocket)
- @ton/ton, @ton/core, @ton/crypto
- Axios (для API запросов)

### Blockchain
- TON Blockchain
- Jetton Standard (Fungible Tokens)
- TON Connect Protocol
- Real compiled smart contracts

---

## 📊 API Endpoints

### Health & Info
- `GET /health` - Health check

### Token Creation
- `GET /api/tokens/creation-fee` - Получить стоимость
- `POST /api/tokens/prepare-creation` - Подготовить создание
- `POST /api/tokens/create` - Создать токен

### Token Management
- `GET /api/tokens` - Список токенов
- `GET /api/tokens/:id` - Информация о токене

### Trading
- `POST /api/tokens/:id/buy` - Купить токен
- `POST /api/tokens/:id/sell` - Продать токен
- `GET /api/trades` - История сделок

---

## 🚀 Деплой

### Railway (Backend) - Рекомендуется

1. **Загрузите на GitHub** (см. [`GITHUB_TO_RAILWAY.md`](GITHUB_TO_RAILWAY.md))
2. **Railway:** Deploy from GitHub repo
3. **Root Directory:** `api`
4. **Variables:** Добавьте environment variables
5. **Deploy:** Автоматически

### Netlify/Vercel (Frontend)

```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod

# Или drag & drop на netlify.com
```

**Детальные инструкции:**
- 📖 [`GITHUB_TO_RAILWAY.md`](GITHUB_TO_RAILWAY.md) - GitHub → Railway
- ⚡ [`QUICK_DEPLOY_GUIDE.md`](QUICK_DEPLOY_GUIDE.md) - Быстрый деплой
- 🚂 [`RAILWAY_DEPLOYMENT.md`](RAILWAY_DEPLOYMENT.md) - Полный Railway гайд

---

## 🔐 Безопасность

- ✅ Environment variables (не в Git)
- ✅ CORS protection
- ✅ Input validation
- ✅ Transaction verification
- ✅ HTTPS ready
- ✅ Rate limiting ready

**⚠️ ВАЖНО:** Никогда не коммитьте `.env` файл!

---

## 📚 Документация

### Для деплоя:
1. **[GITHUB_TO_RAILWAY.md](GITHUB_TO_RAILWAY.md)** - GitHub → Railway ⭐ Начните здесь
2. **[QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md)** - Быстрый деплой (10 мин)
3. **[RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)** - Детальный Railway гайд

### Для разработки:
4. **[START_HERE.md](START_HERE.md)** - Локальный запуск
5. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Полное руководство
6. **[PRODUCTION_READY_CHECKLIST.md](PRODUCTION_READY_CHECKLIST.md)** - Чек-лист

---

## 🆘 Troubleshooting

### Backend не запускается на Railway

```
Решение:
1. Проверьте Root Directory: api
2. Проверьте Environment Variables
3. Смотрите логи в Railway dashboard
```

### CORS ошибка

```env
# В Railway Variables:
CORS_ORIGIN=https://ваш-frontend.netlify.app
```

### TON Connect не работает

```json
// В tonconnect-manifest.json:
{
  "url": "https://ваш-frontend.netlify.app"
}
```

---

## 🎯 Roadmap

- [ ] Advanced token analytics
- [ ] Liquidity pools
- [ ] Staking functionality
- [ ] NFT support
- [ ] Multi-language support
- [ ] Mobile app

---

## 📄 License

MIT License - см. [LICENSE](LICENSE)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 💬 Support

- **Railway Docs**: https://docs.railway.app/
- **TON Docs**: https://docs.ton.org/
- **TON Developers**: https://t.me/tondev

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**🚀 Ready to deploy? Start with [`GITHUB_TO_RAILWAY.md`](GITHUB_TO_RAILWAY.md)**

---

*Made with ❤️ for TON ecosystem*  
*Version: 1.0.0*  
*Date: 2025-01-29*
