import { useState } from 'react';
import { TrendingUp, TrendingDown, Flame, Users, DollarSign, ArrowUpRight, Filter, Search, Sparkles, Calendar, Clock, Zap, Shield, Activity, Eye, Heart, Star, TrendingUpIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

type Page = 'home' | 'token' | 'create' | 'streams' | 'reels' | 'profile' | 'history' | 'leaderboard';

interface HomeProps {
  onNavigateToToken: (tokenId: string) => void;
  onNavigate: (page: Page) => void;
}

interface Token {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change24h: number;
  change1h: number;
  change7d: number;
  marketCap: number;
  volume: number;
  holders: number;
  transactions24h: number;
  riskLevel: 'low' | 'medium' | 'high';
  trending: boolean;
  memeScore: number;
  image: string;
  createdAt: string;
  ownerShare: number;
  auditPassed: boolean;
  boostCount: number;
  likes: number;
  postsCount: number;
  isVerified: boolean;
}

const mockTokens: Token[] = [
  { 
    id: '1', name: 'Pepe Rocket', ticker: 'PEPETON', price: 0.0234, 
    change24h: 125.4, change1h: 8.2, change7d: 245.6,
    marketCap: 1250000, volume: 450000, holders: 3420, transactions24h: 892,
    riskLevel: 'medium', trending: true, memeScore: 95, 
    image: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=400',
    createdAt: '2 дня назад', ownerShare: 15.2, auditPassed: true,
    boostCount: 12, likes: 3420, postsCount: 45, isVerified: true
  },
  { 
    id: '2', name: 'Moon Doge', ticker: 'MDOGE', price: 0.0876, 
    change24h: -15.2, change1h: 2.1, change7d: -8.4,
    marketCap: 890000, volume: 320000, holders: 2150, transactions24h: 567,
    riskLevel: 'high', trending: false, memeScore: 82, 
    image: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=400',
    createdAt: '5 дней назад', ownerShare: 45.8, auditPassed: false,
    boostCount: 3, likes: 1890, postsCount: 23, isVerified: false
  },
  { 
    id: '3', name: 'Shiba TON', ticker: 'SHITON', price: 0.156, 
    change24h: 67.8, change1h: 12.4, change7d: 189.2,
    marketCap: 2100000, volume: 780000, holders: 5670, transactions24h: 1245,
    riskLevel: 'low', trending: true, memeScore: 98, 
    image: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=400',
    createdAt: '1 неделя назад', ownerShare: 8.7, auditPassed: true,
    boostCount: 28, likes: 8920, postsCount: 67, isVerified: true
  },
  { 
    id: '4', name: 'Wojak Finance', ticker: 'WOJAK', price: 0.0045, 
    change24h: 234.5, change1h: 45.2, change7d: 456.8,
    marketCap: 670000, volume: 290000, holders: 1890, transactions24h: 334,
    riskLevel: 'high', trending: true, memeScore: 88, 
    image: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=400',
    createdAt: '12 часов назад', ownerShare: 78.3, auditPassed: false,
    boostCount: 7, likes: 2340, postsCount: 12, isVerified: false
  },
  { 
    id: '5', name: 'Chad Token', ticker: 'CHAD', price: 0.234, 
    change24h: 12.3, change1h: 1.8, change7d: 34.7,
    marketCap: 1560000, volume: 540000, holders: 4230, transactions24h: 678,
    riskLevel: 'low', trending: false, memeScore: 76, 
    image: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=400',
    createdAt: '3 дня назад', ownerShare: 22.1, auditPassed: true,
    boostCount: 15, likes: 4560, postsCount: 89, isVerified: true
  },
  { 
    id: '6', name: 'Gigachad', ticker: 'GIGA', price: 0.089, 
    change24h: -8.4, change1h: -2.3, change7d: -15.6,
    marketCap: 430000, volume: 180000, holders: 980, transactions24h: 156,
    riskLevel: 'medium', trending: false, memeScore: 71, 
    image: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=400',
    createdAt: '1 день назад', ownerShare: 67.4, auditPassed: true,
    boostCount: 2, likes: 890, postsCount: 8, isVerified: false
  },
];

const newsItems = [
  { id: 1, title: 'TON Blockchain достиг 10M транзакций!', image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400', date: '2 часа назад' },
  { id: 2, title: 'Новый рекорд: PEPETON вырос на 500% за день', image: 'https://images.unsplash.com/photo-1623002126996-a38b8a41f4f3?w=400', date: '5 часов назад' },
  { id: 3, title: 'Pump Ton запускает NFT бейджи для холдеров', image: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=400', date: '1 день назад' },
];

export function Home({ onNavigateToToken, onNavigate }: HomeProps) {
  const [sortBy, setSortBy] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterAudit, setFilterAudit] = useState<'all' | 'audited' | 'not-audited'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const sortedAndFilteredTokens = mockTokens
    .filter(token => {
      const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.ticker.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = filterRisk === 'all' || token.riskLevel === filterRisk;
      const matchesAudit = filterAudit === 'all' || 
        (filterAudit === 'audited' && token.auditPassed) ||
        (filterAudit === 'not-audited' && !token.auditPassed);
      
      return matchesSearch && matchesRisk && matchesAudit;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'volume':
          return b.volume - a.volume;
        case 'meme':
          return b.memeScore - a.memeScore;
        case 'marketCap':
          return b.marketCap - a.marketCap;
        case 'holders':
          return b.holders - a.holders;
        case 'likes':
          return b.likes - a.likes;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return b.change24h - a.change24h;
      }
    });

  // Топ виджеты
  const topTokensWeek = mockTokens.slice(0, 3);
  const topByLikes = [...mockTokens].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const topByBoosts = [...mockTokens].sort((a, b) => b.boostCount - a.boostCount).slice(0, 3);
  const recordOfDay = mockTokens.find(t => t.change24h === Math.max(...mockTokens.map(t => t.change24h)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <section className="relative overflow-hidden px-4 pt-8 pb-12 md:pt-16 md:pb-20">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1623002126996-a38b8a41f4f3?w=1200')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-gray-950"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="text-purple-300 text-sm">TON Blockchain Ecosystem</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
            Pump Ton
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Создавай, торгуй и побеждай в мире мем-токенов на TON
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => onNavigate('create')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <Flame className="w-5 h-5 mr-2 flex-shrink-0" />
              Создать токен
            </Button>
            <Button 
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-6 rounded-xl"
            >
              <TrendingUp className="w-5 h-5 mr-2 flex-shrink-0" />
              Топ токенов
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 hover:scale-105 transition-transform">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl truncate">$12.4M</div>
              <div className="text-sm text-gray-400 truncate">24ч Объем</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 hover:scale-105 transition-transform">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl truncate">45.2K</div>
              <div className="text-sm text-gray-400 truncate">Активных трейдеров</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 hover:scale-105 transition-transform">
              <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl truncate">234</div>
              <div className="text-sm text-gray-400 truncate">Новых токенов</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 max-w-7xl mx-auto">
        <h2 className="text-2xl mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0" />
          Новости и события
        </h2>
        <Carousel className="w-full">
          <CarouselContent>
            {newsItems.map((news) => (
              <CarouselItem key={news.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="bg-gray-900/50 border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all duration-300 cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-400 mb-2">{news.date}</p>
                    <h3 className="text-lg line-clamp-2">{news.title}</h3>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Виджеты */}
      <section className="px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Главные токены недели */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              Топ недели
            </h3>
            <div className="space-y-3">
              {topTokensWeek.map((token, idx) => (
                <div key={token.id} className="flex items-center gap-3 p-2 hover:bg-gray-800/30 rounded-lg cursor-pointer" onClick={() => onNavigateToToken(token.id)}>
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <ImageWithFallback src={token.image} alt={token.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{token.ticker}</div>
                    <div className="text-xs text-green-400 truncate">+{token.change24h.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Рекорд дня */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400 flex-shrink-0" />
              Рекорд дня
            </h3>
            {recordOfDay && (
              <div className="text-center" onClick={() => onNavigateToToken(recordOfDay.id)}>
                <ImageWithFallback src={recordOfDay.image} alt={recordOfDay.name} className="w-16 h-16 rounded-full mx-auto mb-3" />
                <h4 className="text-xl truncate">{recordOfDay.name}</h4>
                <div className="text-2xl text-green-400 font-bold">+{recordOfDay.change24h.toFixed(1)}%</div>
                <div className="text-sm text-gray-400">{recordOfDay.ticker}</div>
              </div>
            )}
          </Card>

          {/* Топ по лайкам */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400 flex-shrink-0" />
              Топ по лайкам
            </h3>
            <div className="space-y-3">
              {topByLikes.map((token, idx) => (
                <div key={token.id} className="flex items-center gap-3 p-2 hover:bg-gray-800/30 rounded-lg cursor-pointer" onClick={() => onNavigateToToken(token.id)}>
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <ImageWithFallback src={token.image} alt={token.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{token.ticker}</div>
                    <div className="text-xs text-pink-400 flex items-center gap-1 truncate">
                      <Heart className="w-3 h-3 flex-shrink-0" />
                      {token.likes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Самые активные посты */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6 mb-8">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400 flex-shrink-0" />
            Самые активные посты
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topByBoosts.map((token) => (
              <div key={token.id} className="flex items-center gap-3 p-3 bg-gray-950/50 rounded-lg hover:bg-gray-950/80 transition-colors cursor-pointer" onClick={() => onNavigateToToken(token.id)}>
                <ImageWithFallback src={token.image} alt={token.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate">{token.name}</div>
                  <div className="text-sm text-gray-400 truncate">{token.postsCount} постов</div>
                </div>
                <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/50 flex-shrink-0">
                  <Zap className="w-3 h-3 mr-1" />
                  {token.boostCount}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="px-4 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400 flex-shrink-0" />
            Токены
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-3 w-full">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Поиск токенов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-purple-500/20"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-900/50 border-purple-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">🔥 Trending</SelectItem>
                  <SelectItem value="price">💰 Цена</SelectItem>
                  <SelectItem value="volume">📊 Объем</SelectItem>
                  <SelectItem value="marketCap">📈 Market Cap</SelectItem>
                  <SelectItem value="holders">👥 Холдеры</SelectItem>
                  <SelectItem value="meme">😂 Meme Score</SelectItem>
                  <SelectItem value="likes">❤️ Лайки</SelectItem>
                  <SelectItem value="newest">🆕 Новые</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterRisk} onValueChange={(value: any) => setFilterRisk(value)}>
                <SelectTrigger className="w-full sm:w-32 bg-gray-900/50 border-purple-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все риски</SelectItem>
                  <SelectItem value="low">🛡️ Низкий</SelectItem>
                  <SelectItem value="medium">⚠️ Средний</SelectItem>
                  <SelectItem value="high">🔥 Высокий</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterAudit} onValueChange={(value: any) => setFilterAudit(value)}>
                <SelectTrigger className="w-full sm:w-32 bg-gray-900/50 border-purple-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="audited">✅ Аудированы</SelectItem>
                  <SelectItem value="not-audited">❌ Не аудированы</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAndFilteredTokens.map((token) => (
            <div
              key={token.id}
              onClick={() => onNavigateToToken(token.id)}
              className="cursor-pointer hover:scale-102 hover:-translate-y-1 transition-transform"
            >
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <ImageWithFallback 
                          src={token.image}
                          alt={token.name}
                          className="relative w-12 h-12 rounded-full border-2 border-purple-500/50"
                        />
                        {token.isVerified && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Shield className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="flex items-center gap-2">
                          <span className="truncate">{token.name}</span>
                          {token.trending && <Flame className="w-4 h-4 text-orange-400 animate-pulse flex-shrink-0" />}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">{token.ticker}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            {token.createdAt}
                          </Badge>
                          {token.auditPassed && (
                            <Badge className="bg-green-600/20 text-green-400 border-green-500/50 text-xs px-2 py-0">
                              ✅ Audited
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={`flex-shrink-0 whitespace-nowrap ${
                        token.riskLevel === 'low' ? 'border-green-500/50 text-green-400' : ''
                      }${
                        token.riskLevel === 'medium' ? 'border-yellow-500/50 text-yellow-400' : ''
                      }${
                        token.riskLevel === 'high' ? 'border-red-500/50 text-red-400' : ''
                      }`}
                    >
                      {token.riskLevel === 'low' ? '🛡️ Низкий' : token.riskLevel === 'medium' ? '⚠️ Средний' : '🔥 Высокий'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl">${token.price.toFixed(4)}</span>
                      <div className="flex flex-col items-end gap-1">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
                          token.change24h > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {token.change24h > 0 ? <TrendingUp className="w-3 h-3 flex-shrink-0" /> : <TrendingDown className="w-3 h-3 flex-shrink-0" />}
                          <span className="whitespace-nowrap">{Math.abs(token.change24h).toFixed(1)}%</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {token.change1h > 0 ? '+' : ''}{token.change1h.toFixed(1)}% 1ч
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-500/10">
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400 truncate">Market Cap</div>
                        <div className="text-sm truncate">${(token.marketCap / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400 truncate">Объем 24ч</div>
                        <div className="text-sm truncate">${(token.volume / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400 truncate">Холдеры</div>
                        <div className="text-sm truncate">{token.holders.toLocaleString()}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400 truncate">Транзакции</div>
                        <div className="text-sm truncate">{token.transactions24h.toLocaleString()}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400 truncate">Meme Score</div>
                        <div className="text-sm truncate">😂 {token.memeScore}/100</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400 truncate">Доля владельца</div>
                        <div className="text-sm truncate">{token.ownerShare.toFixed(1)}%</div>
                      </div>
                    </div>

                    {/* Социальные метрики */}
                    <div className="flex items-center justify-between pt-3 border-t border-purple-500/10">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-pink-400">
                          <Heart className="w-3 h-3 flex-shrink-0" />
                          <span>{token.likes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-purple-400">
                          <Zap className="w-3 h-3 flex-shrink-0" />
                          <span>{token.boostCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-400">
                          <Eye className="w-3 h-3 flex-shrink-0" />
                          <span>{token.postsCount}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToToken(token.id);
                      }}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2 flex-shrink-0" />
                      Торговать
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 max-w-7xl mx-auto">
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/20 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl mb-2">Присоединяйся к сообществу</h2>
            <p className="text-gray-400">Следи за новостями и общайся с трейдерами</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              📱 Telegram
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              💎 Discord
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              👛 Tonkeeper
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
