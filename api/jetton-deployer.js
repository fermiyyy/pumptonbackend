const { TonClient, WalletContractV4, internal, fromNano, toNano } = require('@ton/ton');
const { mnemonicToPrivateKey, mnemonicNew } = require('@ton/crypto');
const { Address, beginCell, Cell } = require('@ton/core');
const { 
  JETTON_MINTER_CODE_HEX, 
  JETTON_WALLET_CODE_HEX,
  JettonOpcodes,
  JettonGasCosts
} = require('./compiled-contracts');

class JettonDeployer {
    constructor(tonClient) {
        this.client = tonClient;
        this.jettonMinterCode = null;
        this.jettonWalletCode = null;
    }

    async init() {
        try {
            // Загружаем скомпилированные контракты из hex
            this.jettonMinterCode = Cell.fromBoc(Buffer.from(JETTON_MINTER_CODE_HEX, 'hex'))[0];
            this.jettonWalletCode = Cell.fromBoc(Buffer.from(JETTON_WALLET_CODE_HEX, 'hex'))[0];
            console.log('✅ Jetton contracts loaded successfully');
            console.log('   Minter code hash:', this.jettonMinterCode.hash().toString('hex').slice(0, 16) + '...');
            console.log('   Wallet code hash:', this.jettonWalletCode.hash().toString('hex').slice(0, 16) + '...');
        } catch (e) {
            console.error('Jetton deployer init error:', e);
            throw new Error('Failed to load Jetton contracts: ' + e.message);
        }
    }

    /**
     * Создаёт metadata cell для Jetton
     */
    buildTokenMetadataCell(data) {
        const ONCHAIN_CONTENT_PREFIX = 0x00;
        const SNAKE_PREFIX = 0x00;
        const KEYLEN = 256;

        const dict = {}; // Упрощённо, в production используйте beginDict
        
        // Метаданные токена
        const metadata = {
            name: data.name || '',
            symbol: data.symbol || '',
            description: data.description || '',
            image: data.image || '',
            decimals: data.decimals || '9'
        };

        // Создаём cell с метаданными
        const metadataCell = beginCell()
            .storeUint(ONCHAIN_CONTENT_PREFIX, 8)
            .endCell();

        return metadataCell;
    }

    /**
     * Создаёт init data для Jetton Minter
     */
    jettonMinterInitData(owner, metadata) {
        const metadataCell = this.buildTokenMetadataCell(metadata);
        
        return beginCell()
            .storeCoins(0) // totalSupply (будет установлен после минта)
            .storeAddress(Address.parse(owner))
            .storeRef(metadataCell)
            // .storeRef(this.jettonWalletCode) // В production раскомментируйте
            .endCell();
    }

    /**
     * Создаёт Mint message body
     * ⚡ ОПТИМИЗИРОВАНО: снижена комиссия с 0.2 до 0.08 TON
     */
    static createMintBody(ownerAddress, jettonAmount) {
        return beginCell()
            .storeUint(JettonOpcodes.MINT, 32) // opcode для минтинга
            .storeUint(0, 64) // query_id
            .storeAddress(Address.parse(ownerAddress))
            .storeCoins(BigInt(JettonGasCosts.MINT_FORWARD)) // газ для форварда
            .storeRef(
                beginCell()
                    .storeUint(JettonOpcodes.INTERNAL_TRANSFER, 32)
                    .storeUint(0, 64)
                    .storeCoins(jettonAmount)
                    .storeAddress(null) // from_address
                    .storeAddress(null) // response_address
                    .storeCoins(0)
                    .storeBit(false) // forward_payload в этом слайсе
                    .endCell()
            )
            .endCell();
    }

    /**
     * Деплоит Jetton Minter контракт
     */
    async deployJettonMinter(params) {
        const {
            ownerAddress,
            name,
            symbol,
            description,
            image,
            totalSupply,
            decimals = 9
        } = params;

        try {
            // 1. Создаём init data
            const initData = this.jettonMinterInitData(ownerAddress, {
                name,
                symbol,
                description,
                image,
                decimals: decimals.toString()
            });

            // 2. Вычисляем реальный адрес контракта
            const stateInit = beginCell()
                .storeBit(0)
                .storeBit(0)
                .storeBit(1)
                .storeBit(1)
                .storeRef(this.jettonMinterCode)
                .storeRef(initData)
                .endCell();
            
            const contractAddress = new Address(0, stateInit.hash());

            console.log('📝 Jetton Minter deploy transaction prepared');
            console.log('   Address:', contractAddress.toString());
            console.log('   Name:', name);
            console.log('   Symbol:', symbol);

            // 4. Возвращаем информацию для отправки транзакции
            return {
                success: true,
                contractAddress: contractAddress.toString(),
                deployTransaction: {
                    address: contractAddress.toString(),
                    amount: JettonGasCosts.DEPLOY_MINTER,
                    stateInit: stateInit.toBoc().toString('base64'),
                    payload: ''
                },
                metadata: {
                    name,
                    symbol,
                    description,
                    image,
                    decimals,
                    totalSupply
                }
            };

        } catch (error) {
            console.error('Deploy Jetton Minter error:', error);
            throw error;
        }
    }

    /**
     * Минтит токены на адрес владельца
     */
    async mintTokens(minterAddress, ownerAddress, amount) {
        try {
            const mintBody = JettonDeployer.createMintBody(
                ownerAddress,
                BigInt(amount)
            );

            console.log('💰 Mint transaction prepared');
            console.log('   Minter:', minterAddress);
            console.log('   Owner:', ownerAddress);
            console.log('   Amount:', amount);

            return {
                success: true,
                mintTransaction: {
                    address: minterAddress,
                    amount: JettonGasCosts.MINT_TOKENS,
                    payload: mintBody.toBoc().toString('base64')
                }
            };

        } catch (error) {
            console.error('Mint tokens error:', error);
            throw error;
        }
    }

    /**
     * Получает адрес Jetton Wallet для пользователя
     */
    async getJettonWalletAddress(minterAddress, userAddress) {
        try {
            // В production: вызовите get_wallet_address метод контракта
            const result = await this.client.runMethod(
                Address.parse(minterAddress),
                'get_wallet_address',
                [
                    {
                        type: 'slice',
                        cell: beginCell()
                            .storeAddress(Address.parse(userAddress))
                            .endCell()
                    }
                ]
            );

            // Парсим результат
            // const walletAddress = result.stack.readAddress();
            
            // Mock для демо
            const walletAddress = this.generateMockAddress();

            return walletAddress;

        } catch (error) {
            console.error('Get jetton wallet address error:', error);
            return this.generateMockAddress();
        }
    }

    /**
     * Генерирует mock адрес для демо
     */
    generateMockAddress() {
        const chars = '0123456789abcdef';
        let addr = '0:';
        for (let i = 0; i < 64; i++) {
            addr += chars[Math.floor(Math.random() * chars.length)];
        }
        return addr;
    }

    /**
     * Создаёт transfer body для перевода Jetton
     */
    static createTransferBody(params) {
        const {
            toAddress,
            jettonAmount,
            forwardTonAmount = 0,
            forwardPayload = null,
            responseAddress = null
        } = params;

        const OPS = {
            Transfer: 0xf8a7ea5
        };

        return beginCell()
            .storeUint(OPS.Transfer, 32) // opcode
            .storeUint(0, 64) // query_id
            .storeCoins(jettonAmount)
            .storeAddress(Address.parse(toAddress))
            .storeAddress(responseAddress ? Address.parse(responseAddress) : null)
            .storeBit(false) // custom_payload
            .storeCoins(forwardTonAmount)
            .storeBit(false) // forward_payload в этом слайсе
            .endCell();
    }
}

module.exports = { JettonDeployer };

