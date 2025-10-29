# 🚀 Pump.Ton - Полное руководство по развёртыванию

## 📋 Содержание
1. [Требования](#требования)
2. [Быстрый старт](#быстрый-старт)
3. [Настройка Backend](#настройка-backend)
4. [Настройка Frontend](#настройка-frontend)
5. [Развёртывание в Production](#развёртывание-в-production)
6. [Решение проблем](#решение-проблем)

---

## 🔧 Требования

### Минимальные требования:
- **Node.js**: версия 16.0.0 или выше
- **npm**: версия 7.0.0 или выше
- **TON кошелёк**: для получения комиссий
- **TON API ключ**: с [toncenter.com](https://toncenter.com/)

### Опционально:
- **Google OAuth**: для авторизации пользователей
- **MongoDB/PostgreSQL**: для хранения данных в production

---

## ⚡ Быстрый старт

### 1. Клонирование и установка

```bash
# Перейдите в директорию проекта
cd pump.ton/hosting-deploy-upload

# Установите зависимости backend
cd api
npm install
```

### 2. Конфигурация

```bash
# Создайте .env файл
cp .env.example .env

# Отредактируйте .env файл
# Минимально необходимые настройки:
# - TON_API_KEY (получите на toncenter.com)
# - PLATFORM_WALLET_ADDRESS (ваш TON кошелёк)
```

### 3. Запуск

```bash
# Запустите backend
node server.js

# Откройте frontend
# Откройте hosting-deploy-upload/index.html в браузере
# или запустите локальный сервер:
npx http-server ../ -p 3000
```

---

## 🔧 Настройка Backend

### 1. Получение TON API ключа

1. Перейдите на [toncenter.com](https://toncenter.com/)
2. Нажмите "Get API Key"
3. Зарегистрируйтесь или войдите
4. Скопируйте API ключ
5. Вставьте в `.env` файл:

```env
TON_API_KEY=ваш_ключ_здесь
```

### 2. Настройка кошелька для комиссий

Ваш платформенный кошелёк уже настроен:
```env
PLATFORM_WALLET_ADDRESS=UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
```

**Важно**: Этот кошелёк будет получать ~$2 комиссии с каждого созданного токена!

### 3. Настройка комиссий

По умолчанию комиссия ~$2 за токен. Изменить можно в `.env`:

```env
TARGET_FEE_USD=2.0          # Целевая комиссия в долларах
MIN_FEE_TON=0.5             # Минимум (защита от падения курса)
MAX_FEE_TON=10              # Максимум (защита от роста курса)
```

### 4. Проверка работы

```bash
# Запустите backend
cd api
node server.js

# Вы должны увидеть:
# 🚀 Backend API running on http://localhost:3001
# 📊 WebSocket server ready for real-time updates
# ✅ Jetton contracts loaded successfully
# ✅ Курс TON: $X.XX
```

### 5. Тестирование API

```bash
# Проверьте health check
curl http://localhost:3001/health

# Проверьте стоимость создания токена
curl http://localhost:3001/api/tokens/creation-fee
```

---

## 🎨 Настройка Frontend

### 1. Конфигурация

Отредактируйте `index.html`, найдите `window.APP_CONFIG`:

```javascript
window.APP_CONFIG = {
    tonManifestUrl: './tonconnect-manifest.json',
    googleClientId: 'ваш_google_client_id',
    tonCenterApiKey: '', // Опционально
    tonCenterUrl: 'https://toncenter.com/api/v2',
    backendUrl: 'http://localhost:3001',  // Для локальной разработки
    wsUrl: 'ws://localhost:3001'
};
```

### 2. TON Connect Manifest

Файл `tonconnect-manifest.json` уже настроен. Для production измените `url`:

```json
{
  "url": "https://your-domain.com",
  "name": "Pump Ton",
  "iconUrl": "data:image/png;base64,..."
}
```

### 3. Запуск локального сервера

```bash
# Вариант 1: http-server
npx http-server ./ -p 3000

# Вариант 2: Python
python -m http.server 3000

# Вариант 3: PHP
php -S localhost:3000
```

Откройте: `http://localhost:3000/index.html`

---

## 🌐 Развёртывание в Production

### Backend (Node.js API)

#### Вариант 1: VPS/Dedicated Server

```bash
# 1. Установите PM2 для управления процессом
npm install -g pm2

# 2. Запустите backend
cd api
pm2 start server.js --name pump-ton-api

# 3. Настройте автозапуск
pm2 startup
pm2 save

# 4. Мониторинг
pm2 monit
pm2 logs pump-ton-api
```

#### Вариант 2: Docker

Создайте `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY api/package*.json ./
RUN npm install --production

COPY api/ ./

EXPOSE 3001

CMD ["node", "server.js"]
```

```bash
# Соберите и запустите
docker build -t pump-ton-api .
docker run -d -p 3001:3001 --env-file .env pump-ton-api
```

#### Вариант 3: Cloud Platforms

- **Heroku**: `git push heroku main`
- **Railway**: Подключите GitHub репозиторий
- **Render**: Подключите GitHub репозиторий
- **DigitalOcean App Platform**: Подключите GitHub репозиторий

**Не забудьте** добавить переменные окружения на платформе!

### Frontend (Static Files)

#### Вариант 1: GitHub Pages

```bash
# 1. Создайте репозиторий на GitHub
# 2. Загрузите hosting-deploy-upload/*
# 3. Включите GitHub Pages в Settings
# 4. Обновите APP_CONFIG.backendUrl на адрес вашего backend
```

#### Вариант 2: Netlify/Vercel

```bash
# 1. Подключите GitHub репозиторий
# 2. Укажите директорию: hosting-deploy-upload
# 3. Deploy
```

#### Вариант 3: CDN (Cloudflare Pages)

```bash
# 1. Создайте проект на Cloudflare Pages
# 2. Подключите репозиторий
# 3. Build directory: hosting-deploy-upload
# 4. Deploy
```

### Важно для Production:

1. **CORS**: Настройте `CORS_ORIGIN` в backend `.env`:
   ```env
   CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
   ```

2. **HTTPS**: Обязательно используйте HTTPS для frontend и backend

3. **Домены**: Обновите URL в:
   - `index.html` → `APP_CONFIG.backendUrl` и `wsUrl`
   - `tonconnect-manifest.json` → `url`
   - Backend `.env` → `CORS_ORIGIN`

4. **WebSocket**: Если backend за прокси (nginx), настройте:
   ```nginx
   location /socket.io/ {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
   }
   ```

---

## 🐛 Решение проблем

### Backend не запускается

**Проблема**: "Cannot find module '@ton/ton'"
```bash
# Решение:
cd api
rm -rf node_modules package-lock.json
npm install
```

**Проблема**: "Port 3001 is already in use"
```bash
# Решение 1: Измените порт в .env
PORT=3002

# Решение 2: Остановите процесс
# Windows:
netstat -ano | findstr :3001
taskkill /PID <pid> /F

# Linux/Mac:
lsof -ti:3001 | xargs kill -9
```

### Frontend не подключается к backend

**Проблема**: CORS ошибки
```javascript
// Решение: Проверьте CORS_ORIGIN в backend .env
CORS_ORIGIN=http://localhost:3000

// И убедитесь что backendUrl правильный в index.html
backendUrl: 'http://localhost:3001'
```

**Проблема**: "Failed to fetch"
```bash
# Убедитесь что backend запущен:
curl http://localhost:3001/health

# Проверьте URL в браузере:
# Откройте DevTools → Network → проверьте запросы
```

### TON Connect не работает

**Проблема**: "Wallet not connected"
```javascript
// Решение: Проверьте tonconnect-manifest.json
// URL должен совпадать с URL вашего сайта

// Для локальной разработки:
{
  "url": "http://localhost:3000"
}

// Для production:
{
  "url": "https://your-domain.com"
}
```

### Транзакции не проходят

**Проблема**: "Payment not verified"
```bash
# Решение: Проверьте TON_API_KEY в .env
# Получите новый ключ на toncenter.com если нужно
```

**Проблема**: Недостаточно TON для комиссии
```javascript
// Пользователь должен иметь достаточно TON в кошельке
// Минимум: стоимость создания токена + комиссия платформы
// Обычно: ~0.3 - 0.5 TON
```

### Контракты не деплоятся

**Проблема**: "Failed to deploy contract"
```javascript
// Проверьте что jetton contracts загрузились:
// В логах backend должно быть:
// ✅ Jetton contracts loaded successfully

// Если нет - проверьте compiled-contracts.js
```

---

## 📊 Мониторинг

### Проверка платформы

```bash
# Health check
curl http://your-domain.com/api/health

# Статистика
curl http://your-domain.com/api/tokens

# Логи (если используете PM2)
pm2 logs pump-ton-api

# Метрики
pm2 monit
```

### Отслеживание комиссий

Проверьте свой кошелёк на [TONScan](https://tonscan.org/):
```
https://tonscan.org/address/UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
```

### Google Analytics (опционально)

Добавьте в `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🔐 Безопасность

### Важные меры безопасности:

1. **Никогда не коммитьте `.env`** в Git
   ```bash
   # Убедитесь что .env в .gitignore
   echo ".env" >> .gitignore
   ```

2. **Используйте переменные окружения** на production платформах

3. **Ограничьте CORS** только на ваши домены

4. **Включите rate limiting** в backend:
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 минут
     max: 100 // 100 запросов
   });
   app.use('/api/', limiter);
   ```

5. **Используйте HTTPS** везде

---

## 📚 Дополнительные ресурсы

- [TON Documentation](https://docs.ton.org/)
- [TON Connect](https://github.com/ton-connect)
- [TonCenter API](https://toncenter.com/api/v2/)
- [TONScan](https://tonscan.org/)

---

## 💬 Поддержка

Если у вас возникли проблемы:

1. Проверьте раздел [Решение проблем](#решение-проблем)
2. Убедитесь что все зависимости установлены
3. Проверьте логи backend: `pm2 logs` или `node server.js`
4. Проверьте консоль браузера (F12) для frontend ошибок

---

## ✅ Чек-лист развёртывания

- [ ] Node.js и npm установлены
- [ ] Зависимости установлены (`npm install`)
- [ ] `.env` файл создан и заполнен
- [ ] TON_API_KEY получен и добавлен
- [ ] PLATFORM_WALLET_ADDRESS проверен
- [ ] Backend запускается без ошибок
- [ ] Frontend открывается в браузере
- [ ] TON Connect подключается к кошельку
- [ ] Тестовое создание токена работает
- [ ] WebSocket real-time обновления работают
- [ ] Production backend развёрнут
- [ ] Production frontend развёрнут
- [ ] HTTPS настроен
- [ ] CORS настроен правильно
- [ ] Домены обновлены во всех конфигах

---

**Готово! 🎉 Ваша платформа для создания токенов на TON blockchain полностью готова к работе!**

