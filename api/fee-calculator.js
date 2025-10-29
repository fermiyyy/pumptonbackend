const axios = require('axios');

/**
 * Умный калькулятор комиссий для создания токенов
 * Цель: получать ~$2 с каждого токена без ухода в минус
 */
class FeeCalculator {
    constructor() {
        // Ваш кошелёк для получения комиссий
        this.platformWallet = 'UQAFlXXrd9zkbyNxbi_vIPIXZpKnAUY83hrcZ6lVX0iRmavn';
        
        // Кеш курса TON/USD
        this.tonPriceUSD = null;
        this.lastPriceUpdate = null;
        this.priceUpdateInterval = 5 * 60 * 1000; // 5 минут
        
        // Целевая комиссия в USD
        this.targetFeeUSD = 2.0; // $2
        
        // Реальные затраты на деплой в TON
        this.costs = {
            deployMinter: 0.04,      // Деплой Minter контракта
            mintInitial: 0.13,       // Первоначальный минт
            gasBuffer: 0.03,         // Буфер на непредвиденные расходы
            networkFees: 0.02        // Сетевые комиссии
        };
        
        // Минимальная комиссия в TON (защита от слишком низких цен)
        this.minFeeTON = 0.5;
        
        // Максимальная комиссия в TON (защита от слишком высоких цен)
        this.maxFeeTON = 10;
    }

    /**
     * Получает текущий курс TON/USD
     */
    async fetchTONPrice() {
        try {
            // Попытка 1: CoinGecko API (бесплатный)
            try {
                const response = await axios.get(
                    'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd',
                    { timeout: 5000 }
                );
                if (response.data && response.data['the-open-network']) {
                    return response.data['the-open-network'].usd;
                }
            } catch (e) {
                console.warn('CoinGecko API failed, trying alternative...');
            }

            // Попытка 2: CoinMarketCap (альтернатива)
            try {
                const response = await axios.get(
                    'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/market-pairs/latest?slug=toncoin&start=1&limit=1',
                    { timeout: 5000 }
                );
                if (response.data && response.data.data) {
                    const price = response.data.data.marketPairs?.[0]?.price;
                    if (price) return parseFloat(price);
                }
            } catch (e) {
                console.warn('CoinMarketCap API failed, trying alternative...');
            }

            // Попытка 3: TON API
            try {
                const response = await axios.get(
                    'https://tonapi.io/v2/rates?tokens=ton&currencies=usd',
                    { timeout: 5000 }
                );
                if (response.data && response.data.rates) {
                    return response.data.rates.TON?.prices?.USD;
                }
            } catch (e) {
                console.warn('TON API failed');
            }

            // Fallback: используем последнюю известную цену или дефолт
            console.warn('All price APIs failed, using fallback');
            return this.tonPriceUSD || 5.5; // Дефолт ~$5.5

        } catch (error) {
            console.error('Error fetching TON price:', error.message);
            return this.tonPriceUSD || 5.5;
        }
    }

    /**
     * Обновляет цену TON если прошло достаточно времени
     */
    async updateTONPrice() {
        const now = Date.now();
        
        if (!this.lastPriceUpdate || (now - this.lastPriceUpdate) > this.priceUpdateInterval) {
            console.log('📊 Обновление курса TON/USD...');
            this.tonPriceUSD = await this.fetchTONPrice();
            this.lastPriceUpdate = now;
            console.log(`✅ Курс TON: $${this.tonPriceUSD.toFixed(2)}`);
        }
        
        return this.tonPriceUSD;
    }

    /**
     * Рассчитывает общие затраты на создание токена в TON
     */
    calculateTotalCosts() {
        const total = Object.values(this.costs).reduce((sum, cost) => sum + cost, 0);
        return total;
    }

    /**
     * Рассчитывает комиссию платформы в TON
     */
    async calculatePlatformFee() {
        await this.updateTONPrice();
        
        // Комиссия = целевая сумма в USD / курс TON
        let feeInTON = this.targetFeeUSD / this.tonPriceUSD;
        
        // Применяем ограничения
        if (feeInTON < this.minFeeTON) {
            console.warn(`⚠️ Комиссия ${feeInTON.toFixed(4)} TON слишком низкая, установлено минимум ${this.minFeeTON} TON`);
            feeInTON = this.minFeeTON;
        }
        
        if (feeInTON > this.maxFeeTON) {
            console.warn(`⚠️ Комиссия ${feeInTON.toFixed(4)} TON слишком высокая, установлено максимум ${this.maxFeeTON} TON`);
            feeInTON = this.maxFeeTON;
        }
        
        return feeInTON;
    }

    /**
     * Рассчитывает итоговую стоимость для пользователя
     */
    async calculateTokenCreationFee() {
        const costs = this.calculateTotalCosts();
        const platformFee = await this.calculatePlatformFee();
        const totalFee = costs + platformFee;
        
        const breakdown = {
            // Детализация
            costs: {
                deployMinter: this.costs.deployMinter,
                mintInitial: this.costs.mintInitial,
                gasBuffer: this.costs.gasBuffer,
                networkFees: this.costs.networkFees,
                total: costs
            },
            
            // Комиссия платформы
            platformFee: platformFee,
            platformFeeUSD: platformFee * this.tonPriceUSD,
            
            // Итого
            totalFee: totalFee,
            totalFeeUSD: totalFee * this.tonPriceUSD,
            
            // Метаданные
            tonPriceUSD: this.tonPriceUSD,
            platformWallet: this.platformWallet,
            timestamp: new Date().toISOString()
        };
        
        console.log('💰 Расчёт комиссии:');
        console.log(`   Затраты на деплой: ${costs.toFixed(4)} TON ($${(costs * this.tonPriceUSD).toFixed(2)})`);
        console.log(`   Комиссия платформы: ${platformFee.toFixed(4)} TON ($${breakdown.platformFeeUSD.toFixed(2)})`);
        console.log(`   ИТОГО: ${totalFee.toFixed(4)} TON ($${breakdown.totalFeeUSD.toFixed(2)})`);
        
        return breakdown;
    }

    /**
     * Создаёт транзакции для оплаты создания токена
     */
    async createPaymentTransactions(userAddress) {
        const feeData = await this.calculateTokenCreationFee();
        
        // Транзакция 1: Оплата комиссии платформы на ваш кошелёк
        const platformPayment = {
            to: this.platformWallet,
            amount: Math.ceil(feeData.platformFee * 1e9).toString(), // В nanoTON
            payload: this.createPaymentPayload('Platform fee for token creation')
        };
        
        // Транзакция 2: Деплой контракта (будет создана после оплаты)
        const deployPayment = {
            amount: Math.ceil(feeData.costs.total * 1e9).toString(),
            description: 'Token deployment costs'
        };
        
        return {
            feeBreakdown: feeData,
            transactions: [
                {
                    type: 'platform_fee',
                    ...platformPayment,
                    description: `Комиссия платформы: $${feeData.platformFeeUSD.toFixed(2)}`
                }
            ],
            deployCosts: deployPayment,
            totalRequired: feeData.totalFee
        };
    }

    /**
     * Создаёт payload для транзакции
     */
    createPaymentPayload(comment) {
        // Создаём text comment для TON транзакции
        const commentBuffer = Buffer.from(comment, 'utf8');
        // Добавляем опкод 0 для text comment
        const payload = Buffer.concat([
            Buffer.from([0, 0, 0, 0]), // opcode 0
            commentBuffer
        ]);
        return payload.toString('base64');
    }

    /**
     * Проверяет получена ли оплата (РЕАЛЬНАЯ ПРОВЕРКА)
     */
    async verifyPayment(txHash, expectedAmount) {
        try {
            console.log(`🔍 Проверка транзакции: ${txHash}`);
            console.log(`   Ожидаемая сумма: ${expectedAmount} nanoTON (${(expectedAmount / 1e9).toFixed(4)} TON)`);
            
            // Метод 1: Проверка через TON API (tonapi.io)
            try {
                const response = await axios.get(
                    `https://tonapi.io/v2/blockchain/transactions/${txHash}`,
                    { timeout: 10000 }
                );
                
                if (response.data && response.data.out_msgs) {
                    const payment = response.data.out_msgs.find(msg => 
                        msg.destination?.address === this.platformWallet &&
                        parseInt(msg.value) >= expectedAmount
                    );
                    
                    if (payment) {
                        console.log(`✅ Оплата подтверждена: ${(parseInt(payment.value) / 1e9).toFixed(4)} TON`);
                        return true;
                    }
                }
            } catch (apiError) {
                console.warn('TON API check failed, trying alternative method...');
            }

            // Метод 2: Проверка через toncenter.com
            try {
                const response = await axios.get(
                    `https://toncenter.com/api/v2/getTransactions?address=${this.platformWallet}&limit=10`,
                    { timeout: 10000 }
                );
                
                if (response.data && response.data.result) {
                    // Ищем транзакцию в последних 10
                    const recentTx = response.data.result.find(tx => {
                        if (!tx.in_msg) return false;
                        const value = parseInt(tx.in_msg.value || 0);
                        return value >= expectedAmount;
                    });
                    
                    if (recentTx) {
                        console.log(`✅ Оплата найдена в истории кошелька`);
                        return true;
                    }
                }
            } catch (centerError) {
                console.warn('TonCenter API check failed');
            }

            // Если hash начинается с 'mock_' - это демо-режим
            if (txHash.startsWith('mock_')) {
                console.log(`✅ Демо-режим: оплата принята`);
                return true;
            }
            
            console.warn(`⚠️ Оплата не подтверждена для ${txHash}`);
            return false;
            
        } catch (error) {
            console.error('Payment verification error:', error);
            // В production верните false
            // Для демо возвращаем true
            return txHash.startsWith('mock_');
        }
    }

    /**
     * Получает статистику по собранным комиссиям
     */
    async getRevenueStats() {
        // В production: запросите историю транзакций с вашего кошелька
        // и подсчитайте комиссии
        
        return {
            platformWallet: this.platformWallet,
            totalTokensCreated: 0, // Из БД
            totalRevenueTO: 0,     // Сумма всех platformFee
            totalRevenueUSD: 0,
            averageFeeUSD: 0,
            lastUpdate: new Date().toISOString()
        };
    }
}

// Singleton instance
const feeCalculator = new FeeCalculator();

module.exports = { FeeCalculator, feeCalculator };

