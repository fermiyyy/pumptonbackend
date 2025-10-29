import { useState } from 'react';
import { ArrowLeft, ArrowRight, Rocket, CheckCircle, AlertCircle, Wallet, Coins, Upload, ImageIcon, Shield, Zap, Settings, Info, DollarSign, Users, Lock, Unlock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

type Page = 'home' | 'token' | 'create' | 'streams' | 'reels' | 'profile' | 'history' | 'leaderboard';

interface CreateTokenProps {
  onNavigate: (page: Page) => void;
}

interface TokenData {
  name: string;
  ticker: string;
  supply: string;
  decimals: number;
  description: string;
  icon: string;
  website: string;
  telegram: string;
  maxHolders?: number;
  transferFee?: string;
  tradingFee?: string;
  antiWhale: boolean;
  autoBurn: boolean;
  liquidityLock: boolean;
  auditRequested: boolean;
  boostPackage?: 'basic' | 'premium' | 'vip';
}

export function CreateToken({ onNavigate }: CreateTokenProps) {
  const [step, setStep] = useState(1);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData>({
    name: '',
    ticker: '',
    supply: '',
    decimals: 9,
    description: '',
    icon: '',
    website: '',
    telegram: '',
    maxHolders: undefined,
    transferFee: '0',
    tradingFee: '0',
    antiWhale: false,
    autoBurn: false,
    liquidityLock: false,
    auditRequested: false,
    boostPackage: undefined,
  });

  const [validations, setValidations] = useState({
    nameAvailable: false,
    tickerAvailable: false,
    supplyValid: false,
  });

  const totalSteps = 4;
  
  // Детальная структура комиссий
  const feeStructure = {
    networkFee: 0.5, // TON
    platformFee: 0.1, // TON
    serviceFee: 0.05, // TON
    auditFee: tokenData.auditRequested ? 2.0 : 0, // TON
    boostFee: tokenData.boostPackage === 'basic' ? 1.0 : 
              tokenData.boostPackage === 'premium' ? 5.0 :
              tokenData.boostPackage === 'vip' ? 15.0 : 0,
  };

  const totalFee = Object.values(feeStructure).reduce((sum, fee) => sum + fee, 0);

  const handleInputChange = (field: keyof TokenData, value: any) => {
    setTokenData({ ...tokenData, [field]: value });

    // Simulate validation checks
    if (field === 'name' && typeof value === 'string' && value.length >= 3) {
      setTimeout(() => {
        setValidations(prev => ({ ...prev, nameAvailable: true }));
      }, 500);
    }
    if (field === 'ticker' && typeof value === 'string' && value.length >= 2) {
      setTimeout(() => {
        setValidations(prev => ({ ...prev, tickerAvailable: true }));
      }, 500);
    }
    if (field === 'supply' && typeof value === 'string' && parseFloat(value) > 0) {
      setValidations(prev => ({ ...prev, supplyValid: true }));
    }
  };

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    toast.success('Кошелек подключен! 👛');
  };

  const handleCreateToken = () => {
    toast.success('Токен успешно создан! 🎉');
    setTimeout(() => {
      setStep(4);
    }, 1000);
  };

  const canProceedToStep2 = tokenData.name && tokenData.ticker && tokenData.supply && 
                            validations.nameAvailable && validations.tickerAvailable && validations.supplyValid;
  const canProceedToStep3 = isWalletConnected && acceptedTerms;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-gray-950/80 border-b border-purple-500/20 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад
          </Button>
          <div className="text-center">
            <h1 className="text-xl">Создать токен</h1>
            <p className="text-sm text-gray-400">Шаг {step} из {totalSteps}</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-purple-400' : 'text-gray-500'}>Информация</span>
            <span className={step >= 2 ? 'text-purple-400' : 'text-gray-500'}>Превью</span>
            <span className={step >= 3 ? 'text-purple-400' : 'text-gray-500'}>Подтверждение</span>
            <span className={step >= 4 ? 'text-purple-400' : 'text-gray-500'}>Готово</span>
          </div>
        </div>

        <div>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div>
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6 md:p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl mb-2">Основная информация</h2>
                  <p className="text-gray-400">Заполните данные о вашем токене</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Название токена *</Label>
                    <div className="relative mt-2">
                      <Input 
                        id="name"
                        placeholder="Pepe Rocket"
                        value={tokenData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-gray-950/50 border-purple-500/20 pr-10"
                      />
                      {tokenData.name && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {validations.nameAvailable ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
                      )}
                    </div>
                    {validations.nameAvailable && (
                      <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Название доступно
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="ticker">Тикер *</Label>
                      <div className="relative mt-2">
                        <Input 
                          id="ticker"
                          placeholder="PEPETON"
                          value={tokenData.ticker}
                          onChange={(e) => handleInputChange('ticker', e.target.value.toUpperCase())}
                          className="bg-gray-950/50 border-purple-500/20 pr-10"
                          maxLength={10}
                        />
                        {tokenData.ticker && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {validations.tickerAvailable ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                            )}
                          </div>
                        )}
                      </div>
                      {validations.tickerAvailable && (
                        <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Тикер доступен
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="supply">Общее предложение *</Label>
                      <div className="relative mt-2">
                        <Input 
                          id="supply"
                          type="number"
                          placeholder="1000000000"
                          value={tokenData.supply}
                          onChange={(e) => handleInputChange('supply', e.target.value)}
                          className="bg-gray-950/50 border-purple-500/20 pr-10"
                        />
                        {validations.supplyValid && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="decimals">Знаков после запятой</Label>
                      <Select value={tokenData.decimals.toString()} onValueChange={(value) => handleInputChange('decimals', parseInt(value))}>
                        <SelectTrigger className="bg-gray-950/50 border-purple-500/20 mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 (USDC стиль)</SelectItem>
                          <SelectItem value="9">9 (TON стиль)</SelectItem>
                          <SelectItem value="18">18 (ETH стиль)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Дополнительные параметры */}
                  <Card className="bg-gray-950/30 border-purple-500/10 p-4">
                    <h3 className="text-lg mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-400" />
                      Дополнительные параметры
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="maxHolders">Максимум холдеров (опционально)</Label>
                        <Input 
                          id="maxHolders"
                          type="number"
                          placeholder="50000"
                          value={tokenData.maxHolders || ''}
                          onChange={(e) => handleInputChange('maxHolders', e.target.value ? parseInt(e.target.value) : undefined)}
                          className="bg-gray-950/50 border-purple-500/20 mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="transferFee">Комиссия за перевод (%)</Label>
                        <Input 
                          id="transferFee"
                          type="number"
                          step="0.1"
                          placeholder="0"
                          value={tokenData.transferFee}
                          onChange={(e) => handleInputChange('transferFee', e.target.value)}
                          className="bg-gray-950/50 border-purple-500/20 mt-2"
                        />
                      </div>
                    </div>

                    {/* Антискам настройки */}
                    <div className="mt-6 space-y-4">
                      <h4 className="text-md font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        Антискам настройки
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                          <div>
                            <div className="font-medium">Anti-Whale защита</div>
                            <div className="text-sm text-gray-400">Ограничение максимальной сделки</div>
                          </div>
                          <Switch 
                            checked={tokenData.antiWhale}
                            onCheckedChange={(checked) => handleInputChange('antiWhale', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                          <div>
                            <div className="font-medium">Авто-сжигание</div>
                            <div className="text-sm text-gray-400">Сжигать часть токенов при каждой сделке</div>
                          </div>
                          <Switch 
                            checked={tokenData.autoBurn}
                            onCheckedChange={(checked) => handleInputChange('autoBurn', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                          <div>
                            <div className="font-medium">Блокировка ликвидности</div>
                            <div className="text-sm text-gray-400">Заблокировать LP токены</div>
                          </div>
                          <Switch 
                            checked={tokenData.liquidityLock}
                            onCheckedChange={(checked) => handleInputChange('liquidityLock', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                          <div>
                            <div className="font-medium">Запросить аудит</div>
                            <div className="text-sm text-gray-400">Добровольная проверка (+2 TON)</div>
                          </div>
                          <Switch 
                            checked={tokenData.auditRequested}
                            onCheckedChange={(checked) => handleInputChange('auditRequested', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea 
                      id="description"
                      placeholder="Расскажите о вашем токене..."
                      value={tokenData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="bg-gray-950/50 border-purple-500/20 mt-2 min-h-24"
                    />
                  </div>

                  <div>
                    <Label>Иконка токена</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-950/50 border-2 border-dashed border-purple-500/30 rounded-full flex items-center justify-center cursor-pointer hover:border-purple-500/60 transition-colors">
                        {tokenData.icon ? (
                          <ImageWithFallback src={tokenData.icon} alt="Token icon" className="w-full h-full rounded-full" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-500" />
                        )}
                      </div>
                      <Button variant="outline" className="border-purple-500/50">
                        <Upload className="w-4 h-4 mr-2" />
                        Загрузить
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="website">Веб-сайт (опционально)</Label>
                      <Input 
                        id="website"
                        placeholder="https://yourtoken.com"
                        value={tokenData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="bg-gray-950/50 border-purple-500/20 mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="telegram">Telegram (опционально)</Label>
                      <Input 
                        id="telegram"
                        placeholder="@yourtoken"
                        value={tokenData.telegram}
                        onChange={(e) => handleInputChange('telegram', e.target.value)}
                        className="bg-gray-950/50 border-purple-500/20 mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
                  >
                    Далее
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 2 && (
            <div>
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6 md:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl mb-2">Превью токена</h2>
                  <p className="text-gray-400">Проверьте все данные перед созданием</p>
                </div>

                <div className="max-w-md mx-auto">
                  <Card className="bg-gray-950/50 border-purple-500/30 p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Coins className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl">{tokenData.name || 'Название токена'}</h3>
                        <p className="text-gray-400">{tokenData.ticker || 'TICKER'}</p>
                      </div>
                    </div>

                    {tokenData.description && (
                      <p className="text-gray-300 mb-6">{tokenData.description}</p>
                    )}

                    <div className="space-y-3 pt-4 border-t border-purple-500/20">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Общее предложение:</span>
                        <span>{parseFloat(tokenData.supply).toLocaleString()}</span>
                      </div>
                      {tokenData.website && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Веб-сайт:</span>
                          <span className="text-purple-400">{tokenData.website}</span>
                        </div>
                      )}
                      {tokenData.telegram && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Telegram:</span>
                          <span className="text-purple-400">{tokenData.telegram}</span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Детальная структура комиссий */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
                    <h4 className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                      Детальная структура комиссий
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Комиссия сети TON:</span>
                        <span>{feeStructure.networkFee} TON</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Комиссия платформы:</span>
                        <span>{feeStructure.platformFee} TON</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Сервисная комиссия:</span>
                        <span>{feeStructure.serviceFee} TON</span>
                      </div>
                      {feeStructure.auditFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Добровольный аудит:</span>
                          <span>{feeStructure.auditFee} TON</span>
                        </div>
                      )}
                      {feeStructure.boostFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Boost пакет:</span>
                          <span>{feeStructure.boostFee} TON</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-purple-500/20">
                        <span className="font-medium">Итого:</span>
                        <span className="text-purple-400 font-bold">{totalFee.toFixed(2)} TON</span>
                      </div>
                    </div>
                  </div>

                  {/* Boost пакеты */}
                  <div className="bg-gray-950/30 border border-purple-500/10 rounded-lg p-4 mb-6">
                    <h4 className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Boost пакеты (опционально)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card 
                        className={`cursor-pointer transition-all ${
                          tokenData.boostPackage === 'basic' 
                            ? 'border-yellow-500/50 bg-yellow-500/10' 
                            : 'border-purple-500/20 hover:border-purple-500/40'
                        }`}
                        onClick={() => handleInputChange('boostPackage', tokenData.boostPackage === 'basic' ? undefined : 'basic')}
                      >
                        <div className="p-4 text-center">
                          <div className="text-lg font-bold mb-2">Basic</div>
                          <div className="text-2xl font-bold text-yellow-400 mb-2">1 TON</div>
                          <div className="text-sm text-gray-400 space-y-1">
                            <div>• Приоритет в списке</div>
                            <div>• 24ч размещение</div>
                          </div>
                        </div>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all ${
                          tokenData.boostPackage === 'premium' 
                            ? 'border-blue-500/50 bg-blue-500/10' 
                            : 'border-purple-500/20 hover:border-purple-500/40'
                        }`}
                        onClick={() => handleInputChange('boostPackage', tokenData.boostPackage === 'premium' ? undefined : 'premium')}
                      >
                        <div className="p-4 text-center">
                          <div className="text-lg font-bold mb-2">Premium</div>
                          <div className="text-2xl font-bold text-blue-400 mb-2">5 TON</div>
                          <div className="text-sm text-gray-400 space-y-1">
                            <div>• Топ-10 размещение</div>
                            <div>• 72ч размещение</div>
                            <div>• Уведомления</div>
                          </div>
                        </div>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all ${
                          tokenData.boostPackage === 'vip' 
                            ? 'border-purple-500/50 bg-purple-500/10' 
                            : 'border-purple-500/20 hover:border-purple-500/40'
                        }`}
                        onClick={() => handleInputChange('boostPackage', tokenData.boostPackage === 'vip' ? undefined : 'vip')}
                      >
                        <div className="p-4 text-center">
                          <div className="text-lg font-bold mb-2">VIP</div>
                          <div className="text-2xl font-bold text-purple-400 mb-2">15 TON</div>
                          <div className="text-sm text-gray-400 space-y-1">
                            <div>• #1 размещение</div>
                            <div>• 7 дней размещение</div>
                            <div>• Эксклюзивные уведомления</div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-purple-500/50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
                  >
                    Подтвердить
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div>
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6 md:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl mb-2">Подключите кошелек</h2>
                  <p className="text-gray-400">Для создания токена необходимо подключить TON кошелек</p>
                </div>

                {!isWalletConnected ? (
                  <div className="max-w-md mx-auto space-y-4">
                    <Button 
                      onClick={handleConnectWallet}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-6"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Подключить Tonkeeper
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-purple-500/50 py-6"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Другие кошельки
                    </Button>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <div>Кошелек подключен</div>
                        <div className="text-sm text-gray-400">UQx7f...92b3c</div>
                      </div>
                    </div>

                    <div className="bg-gray-950/50 border border-purple-500/20 rounded-lg p-4">
                      <h4 className="mb-4">Детали транзакции</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Токен:</span>
                          <span>{tokenData.name} ({tokenData.ticker})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Предложение:</span>
                          <span>{parseFloat(tokenData.supply).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Стоимость:</span>
                          <span>{totalFee.toFixed(2)} TON</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-yellow-400 mb-1">Внимание!</p>
                        <p className="text-gray-300">Убедитесь, что все данные введены корректно. После создания токена изменить информацию будет невозможно.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        Я согласен с <span className="text-purple-400">условиями использования</span> и <span className="text-purple-400">политикой конфиденциальности</span>
                      </Label>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="border-purple-500/50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                  </Button>
                  <Button 
                    onClick={handleCreateToken}
                    disabled={!canProceedToStep3}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Создать токен
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div>
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6 md:p-8 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full mb-6">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>

                <h2 className="text-3xl mb-4">Токен создан! 🎉</h2>
                <p className="text-gray-400 mb-8">
                  {tokenData.name} ({tokenData.ticker}) успешно создан и развернут в сети TON
                </p>

                <div className="max-w-md mx-auto bg-gray-950/50 border border-purple-500/20 rounded-lg p-6 mb-8">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Адрес контракта:</span>
                      <span className="text-purple-400">EQx7f...92b3c</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Транзакция:</span>
                      <span className="text-purple-400">0x9f2a...4e8d</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Комиссия:</span>
                      <span>{totalFee.toFixed(2)} TON</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => onNavigate('token')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
                  >
                    Перейти к токену
                  </Button>
                  <Button 
                    onClick={() => onNavigate('home')}
                    variant="outline"
                    className="border-purple-500/50 px-8"
                  >
                    На главную
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
