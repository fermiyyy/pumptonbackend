# 🚀 Pump.Ton - Быстрый старт

## ✅ Что уже готово?

Ваша платформа **ПОЛНОСТЬЮ готова к работе!** Все необходимые компоненты реализованы:

✅ **Frontend** - современный UI с TON Connect  
✅ **Backend API** - Node.js сервер с real-time обновлениями  
✅ **Jetton Contracts** - реальные скомпилированные контракты  
✅ **Smart Fee System** - умная система комиссий (~$2 за токен)  
✅ **Payment Verification** - проверка транзакций через TON API  
✅ **WebSocket** - real-time обновления цен  
✅ **Google OAuth** - готова интеграция  

---

## 🏁 Запуск за 3 минуты

### Шаг 1: Установка зависимостей (1 мин)

```bash
cd hosting-deploy-upload/api
npm install
```

### Шаг 2: Настройка (1 мин)

```bash
# Создайте .env файл
copy .env.example .env

# Отредактируйте .env:
# 1. Получите TON API key на https://toncenter.com/
# 2. Вставьте ваш ключ в TON_API_KEY=...
# 3. Проверьте что PLATFORM_WALLET_ADDRESS правильный
```

**Минимальная конфигурация .env:**
```env
TON_API_KEY=ваш_ключ_с_toncenter.com
PLATFORM_WALLET_ADDRESS=UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
PORT=3001
```

### Шаг 3: Запуск (1 мин)

```bash
# Запустите backend
node server.js

# В другом терминале/окне откройте frontend
cd ..
npx http-server ./ -p 3000
```

**Готово!** Откройте: http://localhost:3000/index.html

---

## 📊 Что вы увидите при запуске?

### Backend (в консоли):
```
🚀 Backend API running on http://localhost:3001
📊 WebSocket server ready for real-time updates
✅ Jetton contracts loaded successfully
   Minter code hash: b5ee9c724102...
   Wallet code hash: b5ee9c724102...
✅ Jetton Deployer готов к работе
📊 Обновление курса TON/USD...
✅ Курс TON: $5.43
```

### Frontend (в браузере):
- 🎨 Современный UI с градиентами и анимациями
- 💼 Кнопка "Connect Wallet" для TON Connect
- 📈 Список токенов с real-time ценами
- ➕ Форма создания нового токена

---

## 🧪 Тестирование

### 1. Проверьте Health Check
```bash
curl http://localhost:3001/health
```

**Ожидаемый ответ:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-29T...",
  "tokens": 0,
  "trades": 0
}
```

### 2. Проверьте стоимость создания токена
```bash
curl http://localhost:3001/api/tokens/creation-fee
```

**Ожидаемый ответ:**
```json
{
  "success": true,
  "fee": {
    "costs": {...},
    "platformFee": 0.3682,
    "platformFeeUSD": 2.00,
    "totalFee": 0.5882,
    "totalFeeUSD": 3.19,
    ...
  },
  "message": "Стоимость создания токена: 0.5882 TON (~$3.19)"
}
```

### 3. Подключите TON кошелёк
1. Откройте http://localhost:3000/index.html
2. Нажмите "Подключить кошелек"
3. Отсканируйте QR код в Tonkeeper/Tonhub

### 4. Создайте тестовый токен
1. Нажмите "Создать токен"
2. Заполните форму:
   - Название: Test Token
   - Тикер: TEST
   - Описание: My first token
3. Нажмите "Создать токен"
4. Подтвердите оплату в кошельке

---

## 💰 Как работает система комиссий?

Ваша платформа получает **~$2 USD** с каждого созданного токена:

1. **Динамический расчёт**: Система автоматически конвертирует $2 в TON по текущему курсу
2. **Защита от волатильности**: 
   - Минимум: 0.5 TON (если TON очень дорогой)
   - Максимум: 10 TON (если TON очень дешёвый)
3. **Прямая отправка**: Комиссия сразу идёт на ваш кошелёк
4. **Прозрачность**: Пользователь видит точную сумму перед оплатой

**Пример расчёта** (если TON = $5.50):
```
Затраты на деплой:  0.22 TON  ($1.21)
Комиссия платформы: 0.36 TON  ($2.00)  ← Ваш доход
─────────────────────────────────────
ИТОГО пользователь: 0.58 TON  ($3.21)
```

---

## 🔍 Архитектура проекта

```
hosting-deploy-upload/
├── index.html              ← Frontend (все в одном файле)
├── tonconnect-manifest.json ← TON Connect настройки
├── api/
│   ├── server.js           ← Backend API + WebSocket
│   ├── fee-calculator.js   ← Умная система комиссий
│   ├── jetton-deployer.js  ← Деплой Jetton контрактов
│   ├── compiled-contracts.js ← Скомпилированные контракты
│   ├── package.json        ← Зависимости
│   └── .env.example        ← Пример конфигурации
├── README.md               ← Документация проекта
├── DEPLOYMENT_GUIDE.md     ← Полное руководство по деплою
└── START_HERE.md           ← Этот файл
```

---

## 🌟 Основные возможности

### Для пользователей:
- ✨ Создание токенов за секунды
- 💱 Торговля токенами (buy/sell)
- 📊 Real-time обновления цен
- 🔒 Безопасность через TON Connect
- 📱 Адаптивный дизайн (работает на телефонах)

### Для вас (владельца):
- 💰 Автоматический сбор комиссий ($2 за токен)
- 📈 Статистика в real-time
- 🛡️ Защита от волатильности курса
- 🔧 Легкая настройка комиссий
- 📊 Мониторинг через TONScan

---

## 📱 Production деплой

Готовы к production? Читайте **DEPLOYMENT_GUIDE.md**

Краткий чек-лист:
- [ ] Backend на VPS/Cloud (Heroku, Railway, DigitalOcean)
- [ ] Frontend на CDN (Netlify, Vercel, GitHub Pages)
- [ ] HTTPS настроен
- [ ] Домены обновлены
- [ ] CORS настроен
- [ ] PM2 для автозапуска backend
- [ ] Мониторинг настроен

---

## 🐛 Что-то не работает?

### Backend не запускается?
```bash
# Переустановите зависимости
cd api
rm -rf node_modules package-lock.json
npm install
node server.js
```

### Frontend не подключается?
1. Проверьте что backend запущен: `curl http://localhost:3001/health`
2. Откройте DevTools (F12) → Console
3. Проверьте `APP_CONFIG.backendUrl` в index.html

### TON Connect не работает?
1. Проверьте `tonconnect-manifest.json`
2. URL должен совпадать с адресом вашего сайта
3. Для localhost используйте: `"url": "http://localhost:3000"`

### Нужна помощь?
📚 Читайте **DEPLOYMENT_GUIDE.md** → раздел "Решение проблем"

---

## 🎯 Что дальше?

1. **Протестируйте**: Создайте несколько тестовых токенов
2. **Кастомизируйте**: Измените дизайн под ваш бренд
3. **Разверните**: Используйте DEPLOYMENT_GUIDE.md
4. **Монетизируйте**: Начните принимать пользователей!

---

## 💡 Полезные ссылки

- 🔗 [TON Documentation](https://docs.ton.org/)
- 🔗 [TON Connect](https://github.com/ton-connect)
- 🔗 [TonCenter API](https://toncenter.com/api/v2/)
- 🔗 [TONScan](https://tonscan.org/)
- 🔗 [Ваш кошелёк](https://tonscan.org/address/UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn)

---

**🚀 Готово! Ваша платформа полностью функциональна и готова зарабатывать!**

*Желаем успехов! 💎*

