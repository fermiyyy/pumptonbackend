import { useState } from 'react';
import { Trophy, TrendingUp, Users, Zap, Crown, Medal, Award, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Page = 'home' | 'token' | 'create' | 'streams' | 'reels' | 'profile' | 'history' | 'leaderboard';

interface LeaderboardProps {
  onNavigate: (page: Page) => void;
}

interface Leader {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  tokens: number;
  volume: number;
  winRate: number;
  badge: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  reward: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const topTraders: Leader[] = [
  { rank: 1, username: 'WhaleKing', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', score: 98750, tokens: 45, volume: 2450000, winRate: 87.5, badge: '👑', tier: 'diamond' },
  { rank: 2, username: 'DiamondHands', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', score: 89320, tokens: 38, volume: 1890000, winRate: 82.3, badge: '💎', tier: 'platinum' },
  { rank: 3, username: 'MoonBoy', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', score: 76540, tokens: 32, volume: 1560000, winRate: 79.1, badge: '🚀', tier: 'platinum' },
  { rank: 4, username: 'CryptoKing', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', score: 68900, tokens: 28, volume: 1340000, winRate: 75.8, badge: '⚡', tier: 'gold' },
  { rank: 5, username: 'MemeTrader', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', score: 62340, tokens: 25, volume: 1120000, winRate: 73.2, badge: '😂', tier: 'gold' },
  { rank: 6, username: 'HodlMaster', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', score: 58720, tokens: 22, volume: 980000, winRate: 71.5, badge: '🔥', tier: 'gold' },
  { rank: 7, username: 'PumpKing', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', score: 54210, tokens: 20, volume: 870000, winRate: 69.3, badge: '💪', tier: 'silver' },
  { rank: 8, username: 'TokenGuru', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', score: 49850, tokens: 18, volume: 760000, winRate: 67.8, badge: '🧠', tier: 'silver' },
];

const weeklyAchievements: Achievement[] = [
  { id: 1, name: 'Стример недели', description: 'Проведи 10+ стримов', icon: '🎥', progress: 7, total: 10, reward: '50 TON', rarity: 'epic' },
  { id: 2, name: 'Создатель хита', description: 'Создай токен с 1000+ холдеров', icon: '🎯', progress: 456, total: 1000, reward: '100 TON', rarity: 'legendary' },
  { id: 3, name: 'Социальная звезда', description: 'Получи 10K лайков на reels', icon: '⭐', progress: 6234, total: 10000, reward: '25 TON', rarity: 'rare' },
  { id: 4, name: 'Ранняя пташка', description: 'Купи 5 токенов в первый час', icon: '🐦', progress: 3, total: 5, reward: '10 TON', rarity: 'common' },
];

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'diamond': return 'from-cyan-400 to-blue-400';
    case 'platinum': return 'from-purple-400 to-pink-400';
    case 'gold': return 'from-yellow-400 to-orange-400';
    case 'silver': return 'from-gray-300 to-gray-400';
    case 'bronze': return 'from-orange-600 to-orange-700';
    default: return 'from-gray-400 to-gray-500';
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10';
    case 'epic': return 'border-purple-500/50 text-purple-400 bg-purple-500/10';
    case 'rare': return 'border-blue-500/50 text-blue-400 bg-blue-500/10';
    case 'common': return 'border-gray-500/50 text-gray-400 bg-gray-500/10';
    default: return 'border-gray-500/50 text-gray-400';
  }
};

export function Leaderboard({ onNavigate }: LeaderboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const currentUserRank = 234;
  const currentUserScore = 12450;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 pb-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-10 h-10 text-yellow-400" />
            Лидерборд
          </h1>
          <p className="text-gray-400">Лучшие трейдеры и достижения сообщества</p>
        </div>

        {/* Your Rank Card */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl">
                #{currentUserRank}
              </div>
              <div>
                <h3 className="text-xl mb-1">Ваш ранг</h3>
                <p className="text-gray-400">До топ-100: {currentUserRank - 100} мест</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-3xl mb-1">{currentUserScore.toLocaleString()}</div>
              <p className="text-gray-400">Очков опыта</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Прогресс до Silver tier</span>
              <span className="text-purple-400">{currentUserScore}/25000</span>
            </div>
            <Progress value={(currentUserScore / 25000) * 100} className="h-2" />
          </div>
        </Card>

        <Tabs defaultValue="traders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-900/50 mb-6">
            <TabsTrigger value="traders">
              <TrendingUp className="w-4 h-4 mr-2" />
              Трейдеры
            </TabsTrigger>
            <TabsTrigger value="creators">
              <Zap className="w-4 h-4 mr-2" />
              Создатели
            </TabsTrigger>
            <TabsTrigger value="streamers">
              <Users className="w-4 h-4 mr-2" />
              Стримеры
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Award className="w-4 h-4 mr-2" />
              Достижения
            </TabsTrigger>
          </TabsList>

          {/* Traders Leaderboard */}
          <TabsContent value="traders" className="space-y-4">
            {/* Period Selector */}
            <div className="flex gap-2 mb-4">
              {['day', 'week', 'month', 'all'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedPeriod === period
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50'
                  }`}
                >
                  {period === 'day' ? 'День' : period === 'week' ? 'Неделя' : period === 'month' ? 'Месяц' : 'Все время'}
                </button>
              ))}
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {topTraders.slice(0, 3).map((leader, idx) => {
                const heights = ['h-64', 'h-72', 'h-60'];
                const orders = [1, 0, 2];
                const actualIdx = orders[idx];
                const actualLeader = topTraders[actualIdx];
                
                return (
                  <div
                    key={actualLeader.rank}
                    className={`order-${idx}`}
                  >
                    <Card className={`bg-gradient-to-b from-gray-900/80 to-gray-900/50 border-purple-500/20 p-6 ${heights[idx]} flex flex-col items-center justify-end relative overflow-hidden`}>
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getTierColor(actualLeader.tier)}`}></div>
                      
                      {actualLeader.rank === 1 && (
                        <div className="absolute top-4 text-4xl animate-bounce">
                          👑
                        </div>
                      )}

                      <div className="relative mb-4">
                        <div className={`absolute inset-0 bg-gradient-to-r ${getTierColor(actualLeader.tier)} blur-xl opacity-50`}></div>
                        <ImageWithFallback 
                          src={actualLeader.avatar}
                          alt={actualLeader.username}
                          className="relative w-20 h-20 rounded-full border-4 border-purple-500/50"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-950 rounded-full flex items-center justify-center border-2 border-purple-500/50">
                          <span className="text-lg">{actualLeader.badge}</span>
                        </div>
                      </div>

                      <h3 className="text-xl mb-1">{actualLeader.username}</h3>
                      <Badge className={`bg-gradient-to-r ${getTierColor(actualLeader.tier)} text-white border-0 mb-3`}>
                        {actualLeader.tier.toUpperCase()}
                      </Badge>

                      <div className="text-3xl mb-2">{actualLeader.score.toLocaleString()}</div>
                      <div className="text-sm text-gray-400 mb-4">Очков</div>

                      <div className="w-full space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Win Rate:</span>
                          <span className="text-green-400">{actualLeader.winRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Объем:</span>
                          <span>${(actualLeader.volume / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Rest of Leaderboard */}
            <div className="space-y-3">
              {topTraders.slice(3).map((leader, idx) => (
                <div
                  key={leader.rank}
                >
                  <Card className="bg-gray-900/50 border-purple-500/20 p-4 hover:border-purple-500/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getTierColor(leader.tier)} rounded-full flex items-center justify-center text-xl`}>
                        #{leader.rank}
                      </div>

                      <ImageWithFallback 
                        src={leader.avatar}
                        alt={leader.username}
                        className="w-12 h-12 rounded-full border-2 border-purple-500/30"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3>{leader.username}</h3>
                          <span className="text-lg">{leader.badge}</span>
                        </div>
                        <Badge variant="outline" className={`border-${leader.tier === 'gold' ? 'yellow' : leader.tier === 'silver' ? 'gray' : 'orange'}-500/50 text-${leader.tier === 'gold' ? 'yellow' : leader.tier === 'silver' ? 'gray' : 'orange'}-400`}>
                          {leader.tier}
                        </Badge>
                      </div>

                      <div className="hidden md:flex gap-8 text-sm">
                        <div className="text-center">
                          <div className="text-gray-400 mb-1">Токены</div>
                          <div>{leader.tokens}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400 mb-1">Объем</div>
                          <div>${(leader.volume / 1000).toFixed(0)}K</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400 mb-1">Win Rate</div>
                          <div className="text-green-400">{leader.winRate}%</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl">{leader.score.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">Очков</div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Creators Leaderboard */}
          <TabsContent value="creators">
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Топ создателей</h3>
              <p className="text-gray-400">Рейтинг создателей токенов появится здесь</p>
            </div>
          </TabsContent>

          {/* Streamers Leaderboard */}
          <TabsContent value="streamers">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Топ стримеров</h3>
              <p className="text-gray-400">Рейтинг стримеров появится здесь</p>
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  Недельные достижения
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weeklyAchievements.map((achievement) => (
                    <Card key={achievement.id} className={`bg-gray-900/50 border-purple-500/20 p-6 ${getRarityColor(achievement.rarity)}`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="text-5xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg">{achievement.name}</h3>
                            <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400">{achievement.reward}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Прогресс</span>
                          <span>{achievement.progress}/{achievement.total}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.total) * 100} 
                          className="h-2"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl mb-4 flex items-center gap-2">
                  <Medal className="w-6 h-6 text-purple-400" />
                  Секретные достижения
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-gray-900/50 border-purple-500/20 p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
                      <div className="relative">
                        <div className="text-5xl mb-3 blur-sm">❓</div>
                        <h3 className="mb-2">Секретное достижение</h3>
                        <p className="text-sm text-gray-400">Выполните скрытые условия для открытия</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
