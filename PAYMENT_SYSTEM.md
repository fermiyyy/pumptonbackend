# 💰 Умная система оплаты создания токенов

## 🎯 Цель

Получать стабильно **~$2 с каждого токена** без ухода в минус, независимо от курса TON.

## 🏦 Ваш кошелёк для получения комиссий

```
UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
```

Все комиссии от создания токенов будут автоматически направляться на этот адрес.

---

## 📊 Как это работает

### 1. **Динамический расчёт комиссии**

Система автоматически:
1. Получает текущий курс TON/USD из API (CoinGecko, CoinMarketCap, TON API)
2. Рассчитывает затраты на деплой в TON
3. Добавляет комиссию платформы = **$2 / курс TON**
4. Применяет ограничения (минимум/максимум)

### 2. **Защита от убытков**

```javascript
Минимальная комиссия: 0.5 TON  // Если TON > $4
Максимальная комиссия: 10 TON  // Если TON < $0.2
```

### 3. **Детализация затрат**

| Статья | Сумма (TON) | Описание |
|--------|-------------|----------|
| Deploy Minter | 0.04 | Деплой Minter контракта |
| Mint Initial | 0.13 | Первоначальный минт |
| Gas Buffer | 0.03 | Буфер на непредвиденные |
| Network Fees | 0.02 | Сетевые комиссии |
| **Затраты** | **0.22** | **Итого затраты** |
| Platform Fee | 0.36* | Комиссия платформы ($2) |
| **ИТОГО** | **0.58*** | **Платит пользователь** |

*При курсе TON = $5.5

---

## 💵 Примеры расчётов

### Курс TON = $5.00
```
Затраты:         0.22 TON ($1.10)
Комиссия:        0.40 TON ($2.00) ✅
─────────────────────────────────
Пользователь:    0.62 TON ($3.10)
Ваш доход:       $2.00
```

### Курс TON = $6.00
```
Затраты:         0.22 TON ($1.32)
Комиссия:        0.33 TON ($2.00) ✅
─────────────────────────────────
Пользователь:    0.55 TON ($3.32)
Ваш доход:       $2.00
```

### Курс TON = $3.00
```
Затраты:         0.22 TON ($0.66)
Комиссия:        0.67 TON ($2.00) ✅
─────────────────────────────────
Пользователь:    0.89 TON ($2.66)
Ваш доход:       $2.00
```

### Курс TON = $10.00 (высокий)
```
Затраты:         0.22 TON ($2.20)
Комиссия:        0.20 TON ($2.00) ✅
─────────────────────────────────
Пользователь:    0.42 TON ($4.20)
Ваш доход:       $2.00
```

---

## 🔄 Процесс создания токена

```
1. Пользователь заполняет форму
   └─> Вводит: название, тикер, описание

2. Система рассчитывает комиссию
   └─> GET текущий курс TON/USD
   └─> Расчёт: затраты + платформенная комиссия

3. Пользователь видит детали
   ┌───────────────────────────────┐
   │ Стоимость: 0.58 TON ($3.10)  │
   │ Комиссия платформы: $2.00     │
   └───────────────────────────────┘

4. Пользователь подтверждает оплату в кошельке
   └─> TON Connect отправляет транзакцию на:
       UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn

5. Backend проверяет оплату
   └─> Проверка txHash через TON API

6. Токен деплоится в блокчейн
   └─> Пользователь получает адрес контракта
```

---

## 📈 API Endpoints

### 1. Получить стоимость создания

```http
GET /api/tokens/creation-fee
```

**Response:**
```json
{
  "success": true,
  "fee": {
    "costs": {
      "deployMinter": 0.04,
      "mintInitial": 0.13,
      "gasBuffer": 0.03,
      "networkFees": 0.02,
      "total": 0.22
    },
    "platformFee": 0.36,
    "platformFeeUSD": 2.00,
    "totalFee": 0.58,
    "totalFeeUSD": 3.20,
    "tonPriceUSD": 5.50
  }
}
```

### 2. Подготовить создание токена

```http
POST /api/tokens/prepare-creation
Content-Type: application/json

{
  "name": "My Token",
  "symbol": "MTK",
  "ownerAddress": "UQ..."
}
```

**Response:**
```json
{
  "success": true,
  "tokenId": "token_123...",
  "paymentRequired": {
    "feeBreakdown": { ... },
    "transactions": [
      {
        "type": "platform_fee",
        "to": "UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn",
        "amount": "360000000",
        "description": "Комиссия платформы: $2.00"
      }
    ]
  }
}
```

### 3. Создать токен (после оплаты)

```http
POST /api/tokens/create
Content-Type: application/json

{
  "tokenId": "token_123...",
  "txHash": "abc123...",
  "ownerAddress": "UQ..."
}
```

**Response:**
```json
{
  "success": true,
  "token": { ... },
  "revenue": {
    "platformFeeUSD": "2.00",
    "platformFeeTON": "0.36"
  }
}
```

---

## 🎨 Frontend интеграция

```javascript
// 1. Подготовка
const prepareResult = await fetch('/api/tokens/prepare-creation', {
    method: 'POST',
    body: JSON.stringify({ name, symbol, ownerAddress })
});

const { tokenId, paymentRequired } = await prepareResult.json();

// 2. Оплата через TON Connect
const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [{
        address: paymentRequired.transactions[0].to,
        amount: paymentRequired.transactions[0].amount
    }]
};

const txResult = await tonConnectUI.sendTransaction(transaction);

// 3. Подтверждение и деплой
const createResult = await fetch('/api/tokens/create', {
    method: 'POST',
    body: JSON.stringify({ tokenId, txHash: txResult.boc })
});
```

---

## 📊 Мониторинг доходов

### Backend логи

```bash
💳 Token creation prepared: MTK (token_123...)
   Fee: 0.5800 TON ($3.20)

✅ Payment verified for MTK: abc123...

🚀 Token deployed: MTK (token_123...)
   Platform earned: 2.00 USD
```

### Проверка в блокчейне

1. Откройте https://tonscan.org
2. Вставьте ваш адрес: `UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn`
3. Смотрите входящие транзакции
4. Каждая транзакция ≈ $2.00 🎉

---

## 🔧 Настройка

### Изменить целевую комиссию

```javascript
// api/fee-calculator.js
this.targetFeeUSD = 2.0; // Измените на 3.0 для $3
```

### Изменить ограничения

```javascript
this.minFeeTON = 0.5;  // Минимум в TON
this.maxFeeTON = 10;   // Максимум в TON
```

### Изменить затраты

```javascript
this.costs = {
    deployMinter: 0.04,
    mintInitial: 0.13,
    gasBuffer: 0.03,
    networkFees: 0.02
};
```

---

## 🛡️ Защита от мошенничества

### 1. Проверка оплаты

```javascript
// В production: проверяем транзакцию через TON API
const response = await axios.get(
    `https://tonapi.io/v2/blockchain/transactions/${txHash}`
);

// Проверяем:
// ✅ Транзакция подтверждена
// ✅ Получатель = ваш кошелёк
// ✅ Сумма >= ожидаемой
```

### 2. TTL для pending токенов

```javascript
// Удаляем pending токены старше 1 часа
setInterval(() => {
    const now = Date.now();
    tokensDB.forEach((token, id) => {
        if (token.status === 'pending_payment') {
            const age = now - new Date(token.createdAt).getTime();
            if (age > 3600000) { // 1 час
                tokensDB.delete(id);
            }
        }
    });
}, 300000); // Каждые 5 минут
```

---

## 📈 Прогноз доходов

### При 10 токенах/день

```
10 токенов × $2.00 = $20/день
$20 × 30 дней = $600/месяц
```

### При 50 токенах/день

```
50 токенов × $2.00 = $100/день
$100 × 30 дней = $3,000/месяц
```

### При 100 токенах/день

```
100 токенов × $2.00 = $200/день
$200 × 30 дней = $6,000/месяц
```

---

## ✅ Преимущества системы

1. ✅ **Стабильный доход** - всегда ~$2 независимо от курса TON
2. ✅ **Нет убытков** - затраты всегда покрыты
3. ✅ **Автоматический расчёт** - не нужно вручную обновлять цены
4. ✅ **Прозрачность** - пользователь видит детализацию
5. ✅ **Безопасность** - проверка оплаты через блокчейн
6. ✅ **Масштабируемость** - работает при любом объёме

---

## 🎯 Итого

Система гарантирует вам **стабильный доход $2 с каждого токена** без риска убытков!

Все комиссии автоматически поступают на ваш кошелёк:
```
UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn
```

🚀 **Готово к запуску!**

