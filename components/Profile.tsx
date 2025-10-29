import { useState } from 'react';
import { Settings, Edit, Wallet, Trophy, Video, Film, Coins, Bell, Shield, Download, Share2, Star, Crown, Zap, Target, Gift, Users, TrendingUp, Award, Sparkles, Flame } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';

type Page = 'home' | 'token' | 'create' | 'streams' | 'reels' | 'profile' | 'history' | 'leaderboard';

interface ProfileProps {
  onNavigate: (page: Page) => void;
}

const userTokens = [
  { name: 'Pepe Rocket', ticker: 'PEPETON', amount: 125000, value: 6587.5, change: 125.4, icon: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100' },
  { name: 'Moon Doge', ticker: 'MDOGE', amount: 45000, value: 3942, change: -15.2, icon: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100' },
  { name: 'Shiba TON', ticker: 'SHITON', amount: 78000, value: 12168, change: 67.8, icon: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100' },
];

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  points: number;
  category: 'trading' | 'creation' | 'social' | 'streaming' | 'milestone';
  progress?: number;
  maxProgress?: number;
  dateUnlocked?: string;
  nftAvailable?: boolean;
}

const achievements: Achievement[] = [
  { id: 1, title: 'Первый токен', description: 'Создал первый токен', icon: '🎯', unlocked: true, rarity: 'common', points: 50, category: 'creation', dateUnlocked: '2024-01-15', nftAvailable: true },
  { id: 2, title: 'Миллионер', description: 'Портфель > $1M', icon: '💎', unlocked: true, rarity: 'rare', points: 200, category: 'trading', dateUnlocked: '2024-01-20', nftAvailable: true },
  { id: 3, title: 'Ранний инвестор', description: 'Купил токен в первые 24ч', icon: '⚡', unlocked: true, rarity: 'epic', points: 500, category: 'trading', dateUnlocked: '2024-01-18', nftAvailable: false },
  { id: 4, title: 'Топ трейдер', description: 'Вошел в топ-100', icon: '🏆', unlocked: false, rarity: 'legendary', points: 1000, category: 'trading', progress: 67, maxProgress: 100, nftAvailable: true },
  { id: 5, title: 'Стример', description: 'Провел первый стрим', icon: '🎥', unlocked: true, rarity: 'rare', points: 300, category: 'streaming', dateUnlocked: '2024-01-22', nftAvailable: true },
  { id: 6, title: 'Мем лорд', description: 'Создано 10+ reels', icon: '😂', unlocked: false, rarity: 'epic', points: 750, category: 'social', progress: 8, maxProgress: 10, nftAvailable: false },
  { id: 7, title: 'Whale Hunter', description: 'Сделано 1000+ транзакций', icon: '🐋', unlocked: true, rarity: 'epic', points: 800, category: 'trading', dateUnlocked: '2024-01-25', nftAvailable: true },
  { id: 8, title: 'Король бустов', description: 'Использовано 50+ бустов', icon: '🚀', unlocked: false, rarity: 'legendary', points: 1200, category: 'social', progress: 23, maxProgress: 50, nftAvailable: true },
  { id: 9, title: 'Социальный активист', description: '1000+ лайков от сообщества', icon: '❤️', unlocked: true, rarity: 'rare', points: 400, category: 'social', dateUnlocked: '2024-01-28', nftAvailable: false },
  { id: 10, title: 'Pump Master', description: 'Создал токен с ростом >1000%', icon: '💫', unlocked: false, rarity: 'mythic', points: 2500, category: 'creation', progress: 0, maxProgress: 1, nftAvailable: true },
];

// Статистика пользователя
const userStats = {
  totalPoints: 2250,
  rank: 234,
  level: 15,
  xpToNextLevel: 750,
  totalXp: 5250,
  prestige: 2,
  weeklyScore: 1850,
  monthlyScore: 8200,
  allTimeScore: 45000,
};

// Топ достижения недели
const weeklyTopAchievements = [
  { id: 7, title: 'Whale Hunter', count: 12 },
  { id: 9, title: 'Социальный активист', count: 8 },
  { id: 3, title: 'Ранний инвестор', count: 15 },
];

export function Profile({ onNavigate }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    trades: true,
    news: true,
    streams: false,
  });

  const handleSaveProfile = () => {
    toast.success('Профиль обновлен! ✅');
    setIsEditing(false);
  };

  const totalValue = userTokens.reduce((sum, token) => sum + token.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50"></div>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=200"
                alt="Profile"
                className="relative w-24 h-24 rounded-full border-4 border-purple-500/50"
              />
              {isEditing && (
                <Button 
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-purple-600 hover:bg-purple-700 w-8 h-8"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input 
                    defaultValue="CryptoKing"
                    className="bg-gray-950/50 border-purple-500/20"
                  />
                  <Textarea 
                    defaultValue="Трейдер и создатель мем-токенов 🚀 | Diamond Hands 💎"
                    className="bg-gray-950/50 border-purple-500/20"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl mb-2 flex items-center gap-2">
                    CryptoKing
                    <Badge className="bg-purple-600 text-white border-0">
                      PRO
                    </Badge>
                  </h1>
                  <p className="text-gray-400 mb-4">
                    Трейдер и создатель мем-токенов 🚀 | Diamond Hands 💎
                  </p>
                </>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Ранг: #{userStats.rank}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>Уровень {userStats.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span>{userStats.totalPoints} очков</span>
                </div>
                {userStats.prestige > 0 && (
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-orange-400" />
                    <span>Престиж {userStats.prestige}</span>
                  </div>
                )}
              </div>

              {/* Прогресс уровня */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Прогресс до уровня {userStats.level + 1}</span>
                  <span>{userStats.xpToNextLevel} XP осталось</span>
                </div>
                <Progress value={(userStats.totalXp % 1000) / 10} className="h-2" />
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSaveProfile}
                    className="bg-gradient-to-r from-green-600 to-green-700"
                  >
                    Сохранить
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-purple-500/50"
                  >
                    Отмена
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-purple-500/50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-purple-500/50"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Wallets */}
          <div className="mt-6 pt-6 border-t border-purple-500/20">
            <h3 className="mb-3 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-400" />
              TON Кошельки
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-950/50 border border-purple-500/20 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Основной кошелек</div>
                  <div className="font-mono">UQx7f...92b3c</div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  Подключен
                </Badge>
              </div>
              <Button 
                variant="outline"
                className="border-dashed border-purple-500/30 h-auto p-3"
              >
                + Добавить кошелек
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-900/50 border-purple-500/20 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Портфель</div>
                <div className="text-xl">${totalValue.toLocaleString()}</div>
              </div>
            </div>
            <div className="text-sm text-green-400">+$2,450 сегодня</div>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/20 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Достижения</div>
                <div className="text-xl">{achievements.filter(a => a.unlocked).length}/{achievements.length}</div>
              </div>
            </div>
            <div className="text-sm text-purple-400">{userStats.totalPoints} очков</div>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/20 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Донаты</div>
                <div className="text-xl">156.7 TON</div>
              </div>
            </div>
            <div className="text-sm text-yellow-400">От 234 человек</div>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/20 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Неделя</div>
                <div className="text-xl">{userStats.weeklyScore}</div>
              </div>
            </div>
            <div className="text-sm text-orange-400">+{userStats.weeklyScore - 1200} за неделю</div>
          </Card>
        </div>

        {/* Достижения престижа и NFT бейджи */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-orange-400" />
              Статус профиля
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Текущий уровень</span>
                <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/50">
                  Уровень {userStats.level}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Престиж</span>
                <div className="flex items-center gap-2">
                  {userStats.prestige > 0 ? (
                    <>
                      {Array.from({ length: userStats.prestige }).map((_, i) => (
                        <Crown key={i} className="w-4 h-4 text-orange-400" />
                      ))}
                      <span className="text-orange-400 text-sm">{userStats.prestige}</span>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">Нет престижа</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">NFT бейджи</span>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/50">
                  {achievements.filter(a => a.unlocked && a.nftAvailable).length} шт.
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-400" />
              Топ достижения недели
            </h3>
            <div className="space-y-3">
              {weeklyTopAchievements.map((ach, idx) => {
                const achievement = achievements.find(a => a.id === ach.id);
                return (
                  <div key={ach.id} className="flex items-center gap-3 p-2 bg-gray-950/50 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div className="text-2xl">{achievement?.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{ach.title}</div>
                      <div className="text-xs text-gray-400">{ach.count} раз за неделю</div>
                    </div>
                    <Badge className="bg-red-600/20 text-red-400 border-red-500/50">
                      +{achievement?.points}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="bg-gray-900/50 mb-6">
            <TabsTrigger value="tokens">Токены</TabsTrigger>
            <TabsTrigger value="achievements">Достижения</TabsTrigger>
            <TabsTrigger value="leaderboard">Рейтинг</TabsTrigger>
            <TabsTrigger value="streams">Стримы</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens">
            <div className="space-y-3">
              {userTokens.map((token) => (
                <Card key={token.ticker} className="bg-gray-900/50 border-purple-500/20 p-4 hover:border-purple-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ImageWithFallback 
                        src={token.icon}
                        alt={token.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3>{token.name}</h3>
                        <p className="text-sm text-gray-400">{token.ticker}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl">${token.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">{token.amount.toLocaleString()} токенов</div>
                    </div>

                    <div className={`px-3 py-1 rounded-lg ${
                      token.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {token.change > 0 ? '+' : ''}{token.change.toFixed(1)}%
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="space-y-6">
              {/* Статистика достижений */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gray-900/50 border-purple-500/20 p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{achievements.filter(a => a.unlocked).length}</div>
                  <div className="text-sm text-gray-400">Разблокировано</div>
                </Card>
                <Card className="bg-gray-900/50 border-purple-500/20 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{achievements.filter(a => a.nftAvailable && a.unlocked).length}</div>
                  <div className="text-sm text-gray-400">NFT бейджи</div>
                </Card>
                <Card className="bg-gray-900/50 border-purple-500/20 p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{achievements.filter(a => !a.unlocked).length}</div>
                  <div className="text-sm text-gray-400">Заблокировано</div>
                </Card>
                <Card className="bg-gray-900/50 border-purple-500/20 p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">{userStats.totalPoints}</div>
                  <div className="text-sm text-gray-400">Всего очков</div>
                </Card>
              </div>

              {/* Фильтр по категориям */}
              <div className="flex flex-wrap gap-2">
                {['trading', 'creation', 'social', 'streaming', 'milestone'].map((category) => (
                  <Badge 
                    key={category}
                    variant="outline" 
                    className="cursor-pointer border-purple-500/50 hover:bg-purple-500/20"
                  >
                    {category === 'trading' ? '💼 Торговля' :
                     category === 'creation' ? '🎨 Создание' :
                     category === 'social' ? '👥 Социальное' :
                     category === 'streaming' ? '🎥 Стриминг' :
                     '🏆 Вехи'}
                  </Badge>
                ))}
              </div>

              {/* Сетка достижений */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative ${!achievement.unlocked ? 'opacity-50' : ''} hover:scale-105 transition-transform`}
                  >
                    <Card className={`bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6 text-center ${
                      achievement.unlocked ? 'hover:border-purple-500/40' : ''
                    }`}>
                      <div className="relative">
                        <div className="text-5xl mb-3">{achievement.icon}</div>
                        {achievement.nftAvailable && achievement.unlocked && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="mb-1">{achievement.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                      
                      {/* Прогресс для незаблокированных достижений */}
                      {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Прогресс</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <Badge 
                          variant="outline"
                          className={`
                            ${achievement.rarity === 'common' ? 'border-gray-500/50 text-gray-400' : ''}
                            ${achievement.rarity === 'rare' ? 'border-blue-500/50 text-blue-400' : ''}
                            ${achievement.rarity === 'epic' ? 'border-purple-500/50 text-purple-400' : ''}
                            ${achievement.rarity === 'legendary' ? 'border-yellow-500/50 text-yellow-400' : ''}
                            ${achievement.rarity === 'mythic' ? 'border-red-500/50 text-red-400' : ''}
                          `}
                        >
                          {achievement.rarity}
                        </Badge>
                        <div className="text-sm text-gray-400">+{achievement.points}</div>
                      </div>

                      {achievement.dateUnlocked && (
                        <div className="text-xs text-gray-500">
                          Получено: {new Date(achievement.dateUnlocked).toLocaleDateString()}
                        </div>
                      )}
                      
                      {!achievement.unlocked && (
                        <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Заблокировано
                          </span>
                        </div>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Глобальный рейтинг
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">#{userStats.rank}</div>
                    <div className="text-sm text-gray-400">из 12,543 пользователей</div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Очки за месяц
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{userStats.monthlyScore.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">+{userStats.monthlyScore - 6500} к прошлому месяцу</div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-400" />
                    Все время
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">{userStats.allTimeScore.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Всего набрано очков</div>
                  </div>
                </Card>
              </div>

              <Card className="bg-gray-900/50 border-purple-500/20 p-6">
                <h3 className="text-lg mb-4">Ближайшие цели</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-lg">
                    <div>
                      <div className="font-medium">Достичь топ-200</div>
                      <div className="text-sm text-gray-400">Нужно: {userStats.rank - 200} позиций</div>
                    </div>
                    <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/50">
                      +500 XP
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-lg">
                    <div>
                      <div className="font-medium">Собрать 20 NFT бейджей</div>
                      <div className="text-sm text-gray-400">Осталось: {20 - achievements.filter(a => a.unlocked && a.nftAvailable).length}</div>
                    </div>
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/50">
                      +1000 XP
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="streams">
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Ваши стримы появятся здесь</h3>
              <p className="text-gray-400 mb-6">Начните транслировать, чтобы делиться контентом с сообществом</p>
              <Button 
                onClick={() => onNavigate('streams')}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Начать стрим
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-purple-500/20 p-6">
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-400" />
                  Уведомления
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="trades">Сделки и торговля</Label>
                      <p className="text-sm text-gray-400">Уведомления о покупках и продажах</p>
                    </div>
                    <Switch 
                      id="trades"
                      checked={notifications.trades}
                      onCheckedChange={(checked) => setNotifications({...notifications, trades: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="news">Новости и события</Label>
                      <p className="text-sm text-gray-400">Важные обновления платформы</p>
                    </div>
                    <Switch 
                      id="news"
                      checked={notifications.news}
                      onCheckedChange={(checked) => setNotifications({...notifications, news: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="streams">Стримы</Label>
                      <p className="text-sm text-gray-400">Новые стримы от подписок</p>
                    </div>
                    <Switch 
                      id="streams"
                      checked={notifications.streams}
                      onCheckedChange={(checked) => setNotifications({...notifications, streams: checked})}
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/20 p-6">
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Приватность и безопасность
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-purple-500/30">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт данных
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-purple-500/30">
                    Управление сессиями
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10">
                    Удалить аккаунт
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
