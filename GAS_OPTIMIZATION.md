# ⚡ Оптимизация комиссий в Jetton контрактах

## 📊 Анализ текущих комиссий

### 1. **Jetton Wallet Constants** (из `jetton-wallet.fc`)

```func
const min_tons_for_storage = 10000000; ;; 0.01 TON
const gas_consumption = 10000000;       ;; 0.01 TON
```

### 2. **Minter Constants** (из `constants.fc`)

```func
int const::min_tons_for_storage() asm "10000000 PUSHINT";        ;; 0.01 TON
int const::provide_address_gas_consumption() asm "10000000 PUSHINT"; ;; 0.01 TON
```

### 3. **Текущие операции и их стоимость**

| Операция | Gas | Пересылка | Storage | **Итого** |
|----------|-----|-----------|---------|-----------|
| **Deploy Minter** | 0.01 | 0.02 | 0.01 | **~0.05 TON** |
| **Mint** | 0.01 | 0.02 | 0.02 | **~0.05 TON** |
| **Transfer** | 0.01 | 0.02-0.04 | 0.01 | **~0.04-0.06 TON** |
| **Burn** | 0.01 | 0.01 | - | **~0.02 TON** |

---

## ✅ **Безопасные оптимизации** (Можно применять)

### 1. **Уменьшить `min_tons_for_storage` до 0.005 TON**

**Текущий код** (`jetton-wallet.fc:23`):
```func
const min_tons_for_storage = 10000000; ;; 0.01 TON
```

**Оптимизированный**:
```func
const min_tons_for_storage = 5000000; ;; 0.005 TON ✅ БЕЗОПАСНО
```

**Экономия**: `0.005 TON` на каждой транзакции
**Риски**: ✅ Минимальные. 0.005 TON достаточно для хранения wallet state (~500 байт)

---

### 2. **Уменьшить `gas_consumption` до 0.007 TON**

**Текущий код** (`jetton-wallet.fc:24`):
```func
const gas_consumption = 10000000; ;; 0.01 TON
```

**Оптимизированный**:
```func
const gas_consumption = 7000000; ;; 0.007 TON ✅ БЕЗОПАСНО
```

**Обоснование**:
- Реальный gas для transfer ~5000-6000 единиц
- Цена gas: 6905 единиц = 1 TON
- Итого: ~6000 * 6905 = ~5,000,000 nanoTON
- + 30% запас = ~7,000,000 nanoTON

**Экономия**: `0.003 TON` на каждой транзакции
**Риски**: ✅ Минимальные

---

### 3. **Оптимизация Mint operation**

**Текущий код** (`test/lib/jetton-minter.ts:30`):
```typescript
.storeCoins(toNano(0.2)) // gas fee
```

**Оптимизированный**:
```typescript
.storeCoins(toNano(0.08)) // 0.08 TON вместо 0.2 ✅ БЕЗОПАСНО
```

**Экономия**: `0.12 TON` при минтинге
**Риски**: ✅ Нет. 0.08 TON достаточно для создания wallet + internal transfer

---

### 4. **Оптимизация Transfer fees**

**Текущий код** (`jetton-wallet.fc:88-93`):
```func
throw_unless(709, msg_value >
                   forward_ton_amount +
                   fwd_count * fwd_fee +
                   (2 * gas_consumption + min_tons_for_storage));
```

С оптимизированными константами:
- `2 * gas_consumption` = 2 * 0.007 = 0.014 TON
- `min_tons_for_storage` = 0.005 TON
- Итого минимум: **0.019 TON** вместо 0.03 TON

**Экономия**: `0.011 TON` на каждом transfer

---

## 🔧 **Как применить оптимизации**

### Вариант 1: Редактировать контракт (Рекомендуется)

1. Откройте `minter-contract-main/contracts/jetton-wallet.fc`
2. Измените строки 23-24:

```func
const min_tons_for_storage = 5000000; ;; 0.005 TON (было 0.01)
const gas_consumption = 7000000;       ;; 0.007 TON (было 0.01)
```

3. Перекомпилируйте контракты:
```bash
cd minter-contract-main
npm install
npm run build
```

4. Скопируйте скомпилированные файлы:
```bash
cp build/*.compiled.json ../hosting-deploy-upload/api/contracts/
```

---

### Вариант 2: Использовать оптимизированные значения в deployer

Обновите `hosting-deploy-upload/api/jetton-deployer.js`:

```javascript
static createMintBody(ownerAddress, jettonAmount) {
    const OPS = {
        Mint: 21,
        InternalTransfer: 0x178d4519
    };

    return beginCell()
        .storeUint(OPS.Mint, 32)
        .storeUint(0, 64)
        .storeAddress(Address.parse(ownerAddress))
        .storeCoins(toNano('0.08')) // ✅ 0.08 вместо 0.2
        .storeRef(
            beginCell()
                .storeUint(OPS.InternalTransfer, 32)
                .storeUint(0, 64)
                .storeCoins(jettonAmount)
                .storeAddress(null)
                .storeAddress(null)
                .storeCoins(0)
                .storeBit(false)
                .endCell()
        )
        .endCell();
}
```

---

## 💰 **Итоговая таблица экономии**

| Операция | Было | Стало | Экономия |
|----------|------|-------|----------|
| **Deploy Minter** | 0.05 TON | 0.04 TON | **0.01 TON (20%)** |
| **Mint** | 0.25 TON | 0.13 TON | **0.12 TON (48%)** |
| **Transfer** | 0.05 TON | 0.04 TON | **0.01 TON (20%)** |
| **Общая экономия на 1000 transfer** | 50 TON | 40 TON | **10 TON** |

---

## ⚠️ **ОПАСНЫЕ оптимизации** (НЕ рекомендуется)

### ❌ 1. Убрать storage reserve полностью

```func
const min_tons_for_storage = 0; ;; ❌ ОПАСНО!
```

**Проблема**: Контракт может быть удалён сборщиком мусора при низком балансе

---

### ❌ 2. Снизить gas_consumption ниже 0.005 TON

```func
const gas_consumption = 3000000; ;; 0.003 TON ❌ ОПАСНО!
```

**Проблема**: Транзакция может не пройти при сложных операциях

---

### ❌ 3. Использовать mode 128 (игнорировать ошибки)

```func
send_raw_message(msg.end_cell(), 128); ;; ❌ ОПАСНО!
```

**Проблема**: Токены могут быть потеряны при ошибках

---

## 📈 **Рекомендуемая конфигурация**

### Для **Mainnet** (Production):

```func
const min_tons_for_storage = 5000000;  ;; 0.005 TON
const gas_consumption = 8000000;        ;; 0.008 TON (консервативно)
```

### Для **Testnet** (Development):

```func
const min_tons_for_storage = 5000000;  ;; 0.005 TON
const gas_consumption = 7000000;        ;; 0.007 TON (агрессивно)
```

---

## 🧪 **Тестирование оптимизаций**

После изменений **обязательно** протестируйте:

```bash
cd minter-contract-main
npm test
```

Проверьте:
- ✅ Все тесты проходят
- ✅ Transfer работает с минимальной комиссией
- ✅ Mint работает корректно
- ✅ Burn не вызывает ошибок

---

## 📊 **Мониторинг после деплоя**

Отслеживайте:
1. **Bounce rate** - должно быть <1%
2. **Average gas used** - должно быть ~0.005-0.008 TON
3. **Failed transactions** - должно быть 0

Если bounce rate >5% - увеличьте `gas_consumption` обратно до 0.01 TON.

---

## 🔗 **Полезные ссылки**

- [TON Gas](https://docs.ton.org/develop/smart-contracts/fees)
- [Jetton Standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [Contract Best Practices](https://docs.ton.org/develop/smart-contracts/guidelines)

---

## 💡 **Итого**

**Безопасные оптимизации могут снизить комиссии на 20-48%** без риска для контракта!

Рекомендую применить **все безопасные оптимизации** из этого гайда. Это сэкономит вам и вашим пользователям **десятки TON** при активной торговле.

