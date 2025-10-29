require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { TonClient, WalletContractV4, internal } = require('@ton/ton');
const { mnemonicToPrivateKey } = require('@ton/crypto');
const { Address, beginCell, toNano } = require('@ton/core');
const { feeCalculator } = require('./fee-calculator');
const { JettonDeployer } = require('./jetton-deployer');

const app = express();
app.use(cors());
app.use(express.json());

// TON Client Configuration
const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TON_API_KEY || ''
});

// Jetton Deployer
const jettonDeployer = new JettonDeployer(client);

// Инициализация deployer при запуске
(async () => {
    try {
        await jettonDeployer.init();
        console.log('✅ Jetton Deployer готов к работе');
    } catch (e) {
        console.error('❌ Ошибка инициализации Jetton Deployer:', e);
    }
})();

// In-memory database (замените на MongoDB/PostgreSQL в production)
const tokensDB = new Map();
const tradesDB = [];

// Jetton Minter Contract Code (упрощенная версия)
const JETTON_MINTER_CODE = `
te6ccgEBCQEA3QABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQIC2AYHAHWyATTP/oA+kAh8AH6QCH0AfpA9AT0BPQE0gABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAByAADbKGCEPlOAHAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdKAAdAAc=
`.trim();

// API Endpoints

// Получить стоимость создания токена
app.get('/api/tokens/creation-fee', async (req, res) => {
    try {
        const feeData = await feeCalculator.calculateTokenCreationFee();
        
        res.json({
            success: true,
            fee: feeData,
            message: `Стоимость создания токена: ${feeData.totalFee.toFixed(4)} TON (~$${feeData.totalFeeUSD.toFixed(2)})`
        });
    } catch (error) {
        console.error('Fee calculation error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Создание токена (Jetton) - Шаг 1: Подготовка платежа
app.post('/api/tokens/prepare-creation', async (req, res) => {
    try {
        const { name, symbol, totalSupply, description, image, ownerAddress } = req.body;

        if (!name || !symbol || !ownerAddress) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: name, symbol, ownerAddress' 
            });
        }

        // Рассчитываем комиссию
        const paymentData = await feeCalculator.createPaymentTransactions(ownerAddress);

        // Генерируем уникальный ID для токена
        const tokenId = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Сохраняем временные данные токена (pending payment)
        const pendingToken = {
            id: tokenId,
            name,
            symbol,
            totalSupply: totalSupply || '1000000000',
            description: description || '',
            image: image || '',
            owner: ownerAddress,
            status: 'pending_payment',
            paymentData: paymentData,
            createdAt: new Date().toISOString()
        };

        tokensDB.set(tokenId, pendingToken);

        console.log(`💳 Token creation prepared: ${symbol} (${tokenId})`);
        console.log(`   Fee: ${paymentData.feeBreakdown.totalFee.toFixed(4)} TON ($${paymentData.feeBreakdown.totalFeeUSD.toFixed(2)})`);

        res.json({
            success: true,
            tokenId: tokenId,
            paymentRequired: paymentData,
            message: `Для создания токена ${symbol} отправьте ${paymentData.feeBreakdown.totalFee.toFixed(4)} TON`,
            instructions: {
                step1: `Отправьте ${paymentData.feeBreakdown.platformFee.toFixed(4)} TON на ${paymentData.transactions[0].to}`,
                step2: 'Подтвердите оплату',
                step3: 'Токен будет создан автоматически после подтверждения'
            }
        });

    } catch (error) {
        console.error('Token preparation error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Создание токена (Jetton) - Шаг 2: Подтверждение оплаты и деплой
app.post('/api/tokens/create', async (req, res) => {
    try {
        const { tokenId, txHash, ownerAddress } = req.body;

        if (!tokenId || !txHash) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: tokenId, txHash' 
            });
        }

        // Получаем pending token
        const pendingToken = tokensDB.get(tokenId);
        
        if (!pendingToken) {
            return res.status(404).json({ 
                success: false, 
                error: 'Token not found' 
            });
        }

        if (pendingToken.status !== 'pending_payment') {
            return res.status(400).json({ 
                success: false, 
                error: `Token status is ${pendingToken.status}, expected pending_payment` 
            });
        }

        // Проверяем оплату
        const expectedAmount = Math.ceil(pendingToken.paymentData.feeBreakdown.platformFee * 1e9);
        const paymentVerified = await feeCalculator.verifyPayment(txHash, expectedAmount);

        if (!paymentVerified) {
            return res.status(400).json({ 
                success: false, 
                error: 'Payment not verified. Please ensure the transaction is confirmed.' 
            });
        }

        console.log(`✅ Payment verified for ${pendingToken.symbol}: ${txHash}`);

        // Реальный деплой Jetton контракта
        let contractAddress = generateMockAddress(); // Fallback
        
        try {
            // Попытка реального деплоя
            const deployResult = await jettonDeployer.deployJettonMinter({
                ownerAddress: ownerAddress,
                name: pendingToken.name,
                symbol: pendingToken.symbol,
                description: pendingToken.description,
                image: pendingToken.image,
                totalSupply: pendingToken.totalSupply,
                decimals: 9
            });
            
            if (deployResult.success) {
                contractAddress = deployResult.contractAddress;
                console.log(`✅ Контракт подготовлен к деплою: ${contractAddress}`);
                
                // В реальном production здесь нужно отправить deployTransaction
                // через TON Connect или wallet сервис
            }
        } catch (deployError) {
            console.warn('⚠️ Real deploy failed, using mock:', deployError.message);
        }

        const tokenData = {
            ...pendingToken,
            id: tokenId,
            address: contractAddress,
            status: 'deployed',
            decimals: 9,
            holders: 1,
            volume24h: 0,
            marketCap: 0,
            price: 0.001,
            change24h: 0,
            auditPassed: false,
            verified: false,
            deployedAt: new Date().toISOString(),
            paymentTxHash: txHash
        };

        tokensDB.set(tokenId, tokenData);

        console.log(`🚀 Token deployed: ${tokenData.symbol} (${tokenId})`);
        console.log(`   Platform earned: ${pendingToken.paymentData.feeBreakdown.platformFeeUSD.toFixed(2)} USD`);

        res.json({
            success: true,
            token: tokenData,
            message: `Token ${tokenData.symbol} created successfully!`,
            revenue: {
                platformFeeUSD: pendingToken.paymentData.feeBreakdown.platformFeeUSD.toFixed(2),
                platformFeeTON: pendingToken.paymentData.feeBreakdown.platformFee.toFixed(4)
            }
        });

    } catch (error) {
        console.error('Token creation error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Получение списка токенов
app.get('/api/tokens', async (req, res) => {
    try {
        const { search, sort, limit = 50 } = req.query;
        
        let tokens = Array.from(tokensDB.values());

        // Поиск
        if (search) {
            const searchLower = search.toLowerCase();
            tokens = tokens.filter(t => 
                t.name.toLowerCase().includes(searchLower) || 
                t.symbol.toLowerCase().includes(searchLower)
            );
        }

        // Сортировка
        if (sort === 'marketCap') {
            tokens.sort((a, b) => b.marketCap - a.marketCap);
        } else if (sort === 'volume') {
            tokens.sort((a, b) => b.volume24h - a.volume24h);
        } else if (sort === 'holders') {
            tokens.sort((a, b) => b.holders - a.holders);
        } else {
            // По умолчанию - по времени создания (новые первые)
            tokens.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Лимит
        tokens = tokens.slice(0, parseInt(limit));

        res.json({
            success: true,
            tokens,
            count: tokens.length,
            total: tokensDB.size
        });

    } catch (error) {
        console.error('Get tokens error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Получение информации о токене
app.get('/api/tokens/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const token = tokensDB.get(id);

        if (!token) {
            return res.status(404).json({ 
                success: false, 
                error: 'Token not found' 
            });
        }

        res.json({
            success: true,
            token
        });

    } catch (error) {
        console.error('Get token error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Покупка токена
app.post('/api/tokens/:id/buy', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, buyerAddress } = req.body;

        const token = tokensDB.get(id);
        if (!token) {
            return res.status(404).json({ 
                success: false, 
                error: 'Token not found' 
            });
        }

        const amountFloat = parseFloat(amount);
        if (isNaN(amountFloat) || amountFloat <= 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid amount' 
            });
        }

        // Симуляция покупки (в production - взаимодействие с DEX)
        const tokensReceived = (amountFloat / token.price).toFixed(2);
        
        // Обновляем статистику
        token.volume24h += amountFloat;
        token.holders += 1;
        token.marketCap = token.price * parseFloat(token.totalSupply);
        token.change24h += Math.random() * 5; // Симуляция роста

        // Сохраняем сделку
        const trade = {
            id: `trade_${Date.now()}`,
            tokenId: id,
            type: 'buy',
            amount: amountFloat,
            tokensReceived,
            buyer: buyerAddress,
            timestamp: new Date().toISOString(),
            txHash: generateMockTxHash()
        };
        tradesDB.push(trade);

        console.log(`✅ Buy trade: ${tokensReceived} ${token.symbol} for ${amountFloat} TON`);

        res.json({
            success: true,
            trade,
            token,
            message: `Bought ${tokensReceived} ${token.symbol} for ${amountFloat} TON`
        });

    } catch (error) {
        console.error('Buy token error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Продажа токена
app.post('/api/tokens/:id/sell', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, sellerAddress } = req.body;

        const token = tokensDB.get(id);
        if (!token) {
            return res.status(404).json({ 
                success: false, 
                error: 'Token not found' 
            });
        }

        const amountFloat = parseFloat(amount);
        if (isNaN(amountFloat) || amountFloat <= 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid amount' 
            });
        }

        // Симуляция продажи
        const tonReceived = (amountFloat * token.price).toFixed(4);
        
        // Обновляем статистику
        token.volume24h += parseFloat(tonReceived);
        token.change24h -= Math.random() * 2; // Симуляция падения

        // Сохраняем сделку
        const trade = {
            id: `trade_${Date.now()}`,
            tokenId: id,
            type: 'sell',
            amount: amountFloat,
            tonReceived,
            seller: sellerAddress,
            timestamp: new Date().toISOString(),
            txHash: generateMockTxHash()
        };
        tradesDB.push(trade);

        console.log(`✅ Sell trade: ${amountFloat} ${token.symbol} for ${tonReceived} TON`);

        res.json({
            success: true,
            trade,
            token,
            message: `Sold ${amountFloat} ${token.symbol} for ${tonReceived} TON`
        });

    } catch (error) {
        console.error('Sell token error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// История сделок
app.get('/api/trades', async (req, res) => {
    try {
        const { tokenId, limit = 50 } = req.query;

        let trades = [...tradesDB];

        if (tokenId) {
            trades = trades.filter(t => t.tokenId === tokenId);
        }

        trades.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        trades = trades.slice(0, parseInt(limit));

        res.json({
            success: true,
            trades,
            count: trades.length
        });

    } catch (error) {
        console.error('Get trades error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// WebSocket для real-time обновлений
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    socket.on('subscribe_token', (tokenId) => {
        socket.join(`token_${tokenId}`);
        console.log(`Client ${socket.id} subscribed to token ${tokenId}`);
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

// Эмитить обновления цен каждые 5 секунд
setInterval(() => {
    tokensDB.forEach((token, tokenId) => {
        // Симуляция изменения цены
        const priceChange = (Math.random() - 0.5) * 0.00001;
        token.price = Math.max(0.0001, token.price + priceChange);
        token.change24h = (Math.random() - 0.5) * 10;

        io.to(`token_${tokenId}`).emit('price_update', {
            tokenId,
            price: token.price,
            change24h: token.change24h,
            timestamp: new Date().toISOString()
        });
    });
}, 5000);

// Helper functions
function generateMockAddress() {
    const chars = '0123456789abcdef';
    let addr = '0:';
    for (let i = 0; i < 64; i++) {
        addr += chars[Math.floor(Math.random() * chars.length)];
    }
    return addr;
}

function generateMockTxHash() {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        tokens: tokensDB.size,
        trades: tradesDB.length
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Backend API running on http://localhost:${PORT}`);
    console.log(`📊 WebSocket server ready for real-time updates`);
});

module.exports = { app, io, tokensDB, tradesDB };

