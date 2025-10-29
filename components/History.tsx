import { useState } from 'react';
import { History as HistoryIcon, Download, Filter, Search, TrendingUp, TrendingDown, Coins, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Page = 'home' | 'token' | 'create' | 'streams' | 'reels' | 'profile' | 'history' | 'leaderboard';

interface HistoryProps {
  onNavigate: (page: Page) => void;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'create' | 'donate';
  token: string;
  ticker: string;
  amount: number;
  price: number;
  total: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
  icon: string;
  aiComment?: string;
  riskScore?: number;
}

const mockTransactions: Transaction[] = [
  { 
    id: '1', 
    type: 'buy', 
    token: 'Pepe Rocket', 
    ticker: 'PEPETON', 
    amount: 125000, 
    price: 0.0527, 
    total: 6587.5, 
    date: '2 часа назад', 
    status: 'completed', 
    hash: '0x9f2a...4e8d',
    icon: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100',
    aiComment: 'Хороший вход! Токен показывает сильный восходящий тренд.',
    riskScore: 7.5
  },
  { 
    id: '2', 
    type: 'sell', 
    token: 'Moon Doge', 
    ticker: 'MDOGE', 
    amount: 45000, 
    price: 0.0876, 
    total: 3942, 
    date: '5 часов назад', 
    status: 'completed', 
    hash: '0x7c3b...2f1a',
    icon: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100',
    aiComment: 'Продажа в зоне сопротивления. Разумное решение.',
    riskScore: 6.2
  },
  { 
    id: '3', 
    type: 'create', 
    token: 'Chad Token', 
    ticker: 'CHAD', 
    amount: 1000000, 
    price: 0.0, 
    total: 0.6, 
    date: '1 день назад', 
    status: 'completed', 
    hash: '0x4d8a...9e3c',
    icon: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100',
    aiComment: 'Токен успешно создан. Добавьте ликвидность для начала торговли.',
    riskScore: 5.0
  },
  { 
    id: '4', 
    type: 'donate', 
    token: 'Стрим CryptoKing', 
    ticker: 'DONATION', 
    amount: 10, 
    price: 1.0, 
    total: 10, 
    date: '2 дня назад', 
    status: 'completed', 
    hash: '0x1e5f...7b2d',
    icon: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100'
  },
  { 
    id: '5', 
    type: 'buy', 
    token: 'Shiba TON', 
    ticker: 'SHITON', 
    amount: 78000, 
    price: 0.156, 
    total: 12168, 
    date: '3 дня назад', 
    status: 'completed', 
    hash: '0x6b9c...3a4f',
    icon: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100',
    aiComment: 'Отличная покупка! Фундаментальные показатели сильные.',
    riskScore: 8.5
  },
  { 
    id: '6', 
    type: 'sell', 
    token: 'Wojak Finance', 
    ticker: 'WOJAK', 
    amount: 32000, 
    price: 0.0045, 
    total: 144, 
    date: '4 дня назад', 
    status: 'failed', 
    hash: '0x2a7f...5c8e',
    icon: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100'
  },
];

export function History({ onNavigate }: HistoryProps) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch = tx.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return '🟢';
      case 'sell': return '🔴';
      case 'create': return '⚡';
      case 'donate': return '💎';
      default: return '📝';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'buy': return 'Покупка';
      case 'sell': return 'Продажа';
      case 'create': return 'Создание';
      case 'donate': return 'Донат';
      default: return type;
    }
  };

  const totalProfit = mockTransactions
    .filter(tx => tx.status === 'completed' && (tx.type === 'buy' || tx.type === 'sell'))
    .reduce((sum, tx) => sum + (tx.type === 'sell' ? tx.total : -tx.total), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 pb-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2 flex items-center gap-2">
            <HistoryIcon className="w-8 h-8 text-purple-400" />
            История транзакций
          </h1>
          <p className="text-gray-400">Все ваши операции в блокчейне TON</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-900/50 border-purple-500/20 p-4">
            <div className="text-sm text-gray-400 mb-1">Всего сделок</div>
            <div className="text-2xl">{mockTransactions.length}</div>
          </Card>
          <Card className="bg-gray-900/50 border-purple-500/20 p-4">
            <div className="text-sm text-gray-400 mb-1">Покупок</div>
            <div className="text-2xl text-green-400">
              {mockTransactions.filter(tx => tx.type === 'buy').length}
            </div>
          </Card>
          <Card className="bg-gray-900/50 border-purple-500/20 p-4">
            <div className="text-sm text-gray-400 mb-1">Продаж</div>
            <div className="text-2xl text-red-400">
              {mockTransactions.filter(tx => tx.type === 'sell').length}
            </div>
          </Card>
          <Card className={`bg-gray-900/50 border-purple-500/20 p-4 ${totalProfit >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
            <div className="text-sm text-gray-400 mb-1">Общая прибыль</div>
            <div className={`text-2xl ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} TON
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border-purple-500/20 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Поиск по токенам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-950/50 border-purple-500/20"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48 bg-gray-950/50 border-purple-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все операции</SelectItem>
                <SelectItem value="buy">Покупки</SelectItem>
                <SelectItem value="sell">Продажи</SelectItem>
                <SelectItem value="create">Создание</SelectItem>
                <SelectItem value="donate">Донаты</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-purple-500/50">
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </Button>
          </div>
        </Card>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((tx, index) => (
            <div
              key={tx.id}
            >
              <Card 
                className="bg-gray-900/50 border-purple-500/20 p-4 hover:border-purple-500/40 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedTx(tx)}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Icon & Type */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      {tx.type !== 'donate' ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-md opacity-30"></div>
                          <ImageWithFallback 
                            src={tx.icon}
                            alt={tx.token}
                            className="relative w-12 h-12 rounded-full"
                          />
                        </>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center">
                          💎
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-950 rounded-full flex items-center justify-center text-xs">
                        {getTypeIcon(tx.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="truncate">{tx.token}</h3>
                        <Badge 
                          variant="outline"
                          className={`
                            ${tx.type === 'buy' ? 'border-green-500/50 text-green-400' : ''}
                            ${tx.type === 'sell' ? 'border-red-500/50 text-red-400' : ''}
                            ${tx.type === 'create' ? 'border-purple-500/50 text-purple-400' : ''}
                            ${tx.type === 'donate' ? 'border-yellow-500/50 text-yellow-400' : ''}
                          `}
                        >
                          {getTypeLabel(tx.type)}
                        </Badge>
                        {tx.status === 'failed' && (
                          <Badge variant="outline" className="border-red-500/50 text-red-400">
                            Отменено
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{tx.ticker}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Value */}
                  <div className="flex items-center gap-6 md:gap-8">
                    <div className="text-right">
                      <div>{tx.amount.toLocaleString()} {tx.type === 'donate' ? 'TON' : tx.ticker}</div>
                      {tx.price > 0 && (
                        <div className="text-sm text-gray-400">${tx.price.toFixed(4)}</div>
                      )}
                    </div>

                    <div className="text-right min-w-[100px]">
                      <div className={`text-lg ${
                        tx.type === 'buy' || tx.type === 'create' || tx.type === 'donate' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {tx.type === 'buy' || tx.type === 'create' || tx.type === 'donate' ? '-' : '+'}
                        {tx.total.toFixed(2)} TON
                      </div>
                      {tx.riskScore && (
                        <div className="text-sm text-gray-400">
                          Risk: {tx.riskScore}/10
                        </div>
                      )}
                    </div>

                    <div className="hidden md:block">
                      {tx.status === 'completed' ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          ✓ Выполнено
                        </Badge>
                      ) : tx.status === 'pending' ? (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                          ⏳ В процессе
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                          ✗ Ошибка
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Comment */}
                {tx.aiComment && (
                  <div className="mt-4 pt-4 border-t border-purple-500/10">
                    <div className="flex items-start gap-2 bg-purple-500/10 rounded-lg p-3">
                      <span className="text-lg">🤖</span>
                      <div>
                        <div className="text-sm text-purple-400 mb-1">AI Анализ</div>
                        <p className="text-sm text-gray-300">{tx.aiComment}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <Card className="bg-gray-900/50 border-purple-500/20 p-12 text-center">
            <HistoryIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl mb-2">Транзакций не найдено</h3>
            <p className="text-gray-400">Попробуйте изменить фильтры поиска</p>
          </Card>
        )}
      </div>
    </div>
  );
}
