import { useState } from 'react';
import { ArrowLeft, Share2, Heart, TrendingUp, TrendingDown, Shield, Zap, QrCode, Activity, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

type Page = 'home' | 'token' | 'create' | 'streams' | 'reels' | 'profile' | 'history' | 'leaderboard';

interface TokenPageProps {
  tokenId: string | null;
  onNavigate: (page: Page) => void;
}

const transactions = [
  { id: 1, type: 'buy', amount: 1500, price: 0.0527, user: '0x7f3a...b92c', time: '2 мин назад' },
  { id: 2, type: 'sell', amount: 800, price: 0.0525, user: '0x9e2b...4a1d', time: '5 мин назад' },
  { id: 3, type: 'buy', amount: 3200, price: 0.0523, user: '0x1c5f...8e3a', time: '8 мин назад' },
];

const socialPosts = [
  { id: 1, user: 'CryptoKing', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', content: 'PEPETON to the moon! 🚀🚀🚀 Держу 10K токенов!', likes: 234, comments: 45, time: '10 мин назад' },
  { id: 2, user: 'MemeTrader', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', content: 'Лучший мем-токен в TON! Разработчики красавцы 💎', likes: 187, comments: 32, time: '25 мин назад' },
];

export function TokenPage({ tokenId, onNavigate }: TokenPageProps) {
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('trade');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBuy = () => {
    toast.success('Покупка выполнена успешно! 🎉');
  };

  const handleSell = () => {
    toast.success('Продажа выполнена успешно! ✅');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 pb-8">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-gray-950/80 border-b border-purple-500/20 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2 flex-shrink-0" />
            Назад
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? 'text-pink-400' : 'text-gray-400'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-400' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50"></div>
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=200"
                      alt="Pepe Rocket"
                      className="relative w-20 h-20 rounded-full border-2 border-purple-500/50"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-3xl mb-1 flex items-center gap-2">
                      <span className="truncate">Pepe Rocket</span>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 flex-shrink-0 whitespace-nowrap">
                        🔥 Trending
                      </Badge>
                    </h1>
                    <p className="text-gray-400 text-lg truncate">PEPETON</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50 whitespace-nowrap">
                    <Shield className="w-3 h-3 mr-1 flex-shrink-0" />
                    Проверен
                  </Badge>
                  <Button variant="outline" size="sm" className="border-purple-500/50 whitespace-nowrap">
                    <QrCode className="w-4 h-4 mr-1 flex-shrink-0" />
                    QR
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-950/50 rounded-lg p-3 min-w-0">
                  <div className="text-xs text-gray-400 mb-1 truncate">Цена</div>
                  <div className="text-xl truncate">$0.0527</div>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <TrendingUp className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">+125.4%</span>
                  </div>
                </div>
                <div className="bg-gray-950/50 rounded-lg p-3 min-w-0">
                  <div className="text-xs text-gray-400 mb-1 truncate">Market Cap</div>
                  <div className="text-xl truncate">$1.25M</div>
                  <div className="text-sm text-gray-400 truncate">Rank #234</div>
                </div>
                <div className="bg-gray-950/50 rounded-lg p-3 min-w-0">
                  <div className="text-xs text-gray-400 mb-1 truncate">Ликвидность</div>
                  <div className="text-xl truncate">$450K</div>
                  <div className="text-sm text-gray-400 truncate">36% от cap</div>
                </div>
                <div className="bg-gray-950/50 rounded-lg p-3 min-w-0">
                  <div className="text-xs text-gray-400 mb-1 truncate">Холдеры</div>
                  <div className="text-xl truncate">3,420</div>
                  <div className="text-sm text-green-400 truncate">+245 сегодня</div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6">
              <h2 className="text-xl mb-6">График цены</h2>
              <div className="h-72 relative">
                <svg className="w-full h-full" viewBox="0 0 800 300">
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="0" y1={i * 75} x2="800" y2={i * 75} stroke="#374151" strokeDasharray="3 3" />
                  ))}
                  <path 
                    d="M 0,230 L 133,180 L 266,210 L 400,140 L 533,90 L 666,60 L 800,10" 
                    stroke="#a855f7" 
                    strokeWidth="3" 
                    fill="none"
                  />
                  <path 
                    d="M 0,230 L 133,180 L 266,210 L 400,140 L 533,90 L 666,60 L 800,10 L 800,300 L 0,300 Z" 
                    fill="url(#priceGradient)"
                  />
                </svg>
              </div>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
                <TabsTrigger value="trade">Сделки</TabsTrigger>
                <TabsTrigger value="social">Сообщество</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trade" className="mt-4">
                <Card className="bg-gray-900/50 border-purple-500/20">
                  <div className="p-4">
                    <h3 className="text-lg mb-4">Последние транзакции</h3>
                    <div className="space-y-3">
                      {transactions.map((tx) => (
                        <div 
                          key={tx.id}
                          className="flex items-center justify-between gap-3 p-3 bg-gray-950/50 rounded-lg hover:bg-gray-950/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Badge className={`flex-shrink-0 whitespace-nowrap ${tx.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {tx.type === 'buy' ? '🟢 Покупка' : '🔴 Продажа'}
                            </Badge>
                            <div className="min-w-0 flex-1">
                              <div className="truncate">{tx.amount.toLocaleString()} PEPETON</div>
                              <div className="text-sm text-gray-400 truncate">{tx.user}</div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="truncate">${tx.price.toFixed(4)}</div>
                            <div className="text-sm text-gray-400 whitespace-nowrap">{tx.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="mt-4">
                <div className="space-y-4">
                  {socialPosts.map((post) => (
                    <Card key={post.id} className="bg-gray-900/50 border-purple-500/20 p-4 hover:border-purple-500/40 transition-colors">
                      <div className="flex items-start gap-3">
                        <ImageWithFallback 
                          src={post.avatar}
                          alt={post.user}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="truncate">{post.user}</span>
                            <span className="text-sm text-gray-400 whitespace-nowrap flex-shrink-0">{post.time}</span>
                          </div>
                          <p className="mb-3 break-word">{post.content}</p>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <button className="flex items-center gap-1 hover:text-pink-400 transition-colors">
                              <ThumbsUp className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                              <MessageSquare className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{post.comments}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6 sticky top-24">
              <h3 className="text-xl mb-6">Торговля</h3>
              
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-950/50">
                  <TabsTrigger value="buy" className="data-[state=active]:bg-green-600">
                    Купить
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="data-[state=active]:bg-red-600">
                    Продать
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="buy" className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Количество TON</label>
                    <Input 
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-gray-950/50 border-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Получите</label>
                    <div className="bg-gray-950/50 border border-purple-500/20 rounded-lg p-3">
                      <div className="text-2xl truncate">
                        {amount ? (parseFloat(amount) / 0.0527).toFixed(2) : '0.00'}
                      </div>
                      <div className="text-sm text-gray-400">PEPETON</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[25, 50, 75, 100].map((percent) => (
                      <Button 
                        key={percent}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-500/30 hover:bg-purple-500/20"
                        onClick={() => setAmount((100 * percent / 100).toString())}
                      >
                        {percent}%
                      </Button>
                    ))}
                  </div>

                  <Button 
                    onClick={handleBuy}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-6"
                  >
                    <TrendingUp className="w-5 h-5 mr-2 flex-shrink-0" />
                    Купить PEPETON
                  </Button>

                  <Button 
                    variant="outline"
                    className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <Zap className="w-5 h-5 mr-2 flex-shrink-0" />
                    Boost (2x комиссия)
                  </Button>
                </TabsContent>

                <TabsContent value="sell" className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Количество PEPETON</label>
                    <Input 
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-gray-950/50 border-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Получите</label>
                    <div className="bg-gray-950/50 border border-purple-500/20 rounded-lg p-3">
                      <div className="text-2xl truncate">
                        {amount ? (parseFloat(amount) * 0.0527).toFixed(4) : '0.0000'}
                      </div>
                      <div className="text-sm text-gray-400">TON</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[25, 50, 75, 100].map((percent) => (
                      <Button 
                        key={percent}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-500/30 hover:bg-purple-500/20"
                      >
                        {percent}%
                      </Button>
                    ))}
                  </div>

                  <Button 
                    onClick={handleSell}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-6"
                  >
                    <TrendingDown className="w-5 h-5 mr-2 flex-shrink-0" />
                    Продать PEPETON
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="text-sm">Мгновенная торговля</span>
                </div>
                <p className="text-xs text-gray-400">
                  Комиссия сети: ~0.5 TON<br/>
                  Проскальзывание: 1%
                </p>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-purple-500/20 p-6">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                Оценка рисков
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate">Ликвидность</span>
                    <span className="text-green-400 flex-shrink-0">Высокая</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate">Аудит</span>
                    <span className="text-green-400 flex-shrink-0">Пройден</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate">Распределение</span>
                    <span className="text-yellow-400 flex-shrink-0">Средний</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                🤖 AI Score: <span className="text-green-400">8.5/10</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
