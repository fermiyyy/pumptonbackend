import { useState } from 'react';
import { Video, Users, Radio, Clock, Gift, Heart, MessageSquare, Play, Scissors, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

type Page = 'home' | 'token' | 'create' | 'streams' | 'reels' | 'profile' | 'history' | 'leaderboard';

interface StreamsProps {
  onNavigate: (page: Page) => void;
}

interface Stream {
  id: string;
  title: string;
  streamer: string;
  avatar: string;
  thumbnail: string;
  viewers: number;
  isLive: boolean;
  category: string;
  donations: number;
  startTime: string;
}

const mockStreams: Stream[] = [
  { id: '1', title: 'PUMP TON: Анализ рынка и лучшие токены дня 🚀', streamer: 'CryptoKing', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', thumbnail: 'https://images.unsplash.com/photo-1610041321024-0dff35bf9923?w=600', viewers: 1234, isLive: true, category: 'Trading', donations: 45.5, startTime: '2 часа назад' },
  { id: '2', title: 'Создаем мем-токен вместе! Live coding 💻', streamer: 'DevMaster', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', thumbnail: 'https://images.unsplash.com/photo-1497015289639-54688650d173?w=600', viewers: 856, isLive: true, category: 'Development', donations: 32.1, startTime: '45 минут назад' },
  { id: '3', title: 'Топ-10 мем-токенов недели | Обзор и прогнозы', streamer: 'MemeTrader', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', thumbnail: 'https://images.unsplash.com/photo-1610041321024-0dff35bf9923?w=600', viewers: 2341, isLive: true, category: 'Analysis', donations: 89.7, startTime: '3 часа назад' },
  { id: '4', title: 'NFT бейджи и игровой опыт в Pump Ton', streamer: 'GamingPro', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', thumbnail: 'https://images.unsplash.com/photo-1497015289639-54688650d173?w=600', viewers: 0, isLive: false, category: 'Gaming', donations: 0, startTime: 'Вчера' },
];

const topDonators = [
  { name: 'WhaleKing', amount: 156.7, avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=50' },
  { name: 'DiamondHands', amount: 89.3, avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=50' },
  { name: 'MoonBoy', amount: 67.8, avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=50' },
];

const chatMessages = [
  { user: 'CryptoFan', message: 'Отличный стрим! 🔥', time: 'только что' },
  { user: 'Trader123', message: 'Когда будет памп?', time: '1 мин назад' },
  { user: 'HodlKing', message: 'Держу токены до луны! 🚀', time: '2 мин назад' },
  { user: 'MemeGod', message: 'Лучший проект в TON!', time: '3 мин назад' },
];

export function Streams({ onNavigate }: StreamsProps) {
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  const handleDonate = () => {
    if (donationAmount && parseFloat(donationAmount) > 0) {
      toast.success(`Донат ${donationAmount} TON отправлен! 💎`);
      setDonationAmount('');
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      toast.success('Сообщение отправлено!');
      setChatMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {!selectedStream ? (
        // Streams List View
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl mb-2 flex items-center gap-2">
              <Video className="w-8 h-8 text-purple-400" />
              Стримы и события
            </h1>
            <p className="text-gray-400">Смотрите прямые трансляции о токенах и трейдинге</p>
          </div>

          <Tabs defaultValue="live" className="w-full">
            <TabsList className="bg-gray-900/50 mb-6">
              <TabsTrigger value="live" className="flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Прямой эфир
                <Badge className="bg-red-500/20 text-red-400 border-red-500/50 ml-1">
                  {mockStreams.filter(s => s.isLive).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="offline">
                <Clock className="w-4 h-4 mr-2" />
                Записи
              </TabsTrigger>
              <TabsTrigger value="clips">
                <Scissors className="w-4 h-4 mr-2" />
                Клипы
              </TabsTrigger>
            </TabsList>

            <TabsContent value="live" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockStreams.filter(s => s.isLive).map((stream) => (
                  <div
                    key={stream.id}
                    onClick={() => setSelectedStream(stream)}
                    className="cursor-pointer hover:scale-102 hover:-translate-y-1 transition-transform"
                  >
                    <Card className="bg-gray-900/50 border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all duration-300">
                      <div className="relative">
                        <ImageWithFallback 
                          src={stream.thumbnail}
                          alt={stream.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                        
                        {stream.isLive && (
                          <Badge className="absolute top-3 left-3 bg-red-600 text-white border-0 animate-pulse">
                            <Radio className="w-3 h-3 mr-1" />
                            LIVE
                          </Badge>
                        )}
                        
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-2 text-white text-sm mb-2">
                            <Eye className="w-4 h-4" />
                            {stream.viewers.toLocaleString()} зрителей
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <ImageWithFallback 
                            src={stream.avatar}
                            alt={stream.streamer}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="line-clamp-2 mb-1">{stream.title}</h3>
                            <p className="text-sm text-gray-400">{stream.streamer}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-purple-500/10">
                          <Badge variant="outline" className="border-purple-500/30">
                            {stream.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-yellow-400">
                            <Gift className="w-4 h-4" />
                            {stream.donations} TON
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="offline">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockStreams.filter(s => !s.isLive).map((stream) => (
                  <Card key={stream.id} className="bg-gray-900/50 border-purple-500/20 overflow-hidden">
                    <div className="relative">
                      <ImageWithFallback 
                        src={stream.thumbnail}
                        alt={stream.title}
                        className="w-full h-48 object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button className="bg-purple-600 hover:bg-purple-700 rounded-full w-16 h-16">
                          <Play className="w-8 h-8" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2">{stream.title}</h3>
                      <p className="text-sm text-gray-400">{stream.streamer} • {stream.startTime}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="clips">
              <div className="text-center py-12">
                <Scissors className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl mb-2">Клипы появятся скоро</h3>
                <p className="text-gray-400">Лучшие моменты из стримов будут автоматически нарезаны</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Stream Player View
        <div className="h-screen flex flex-col">
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Video Player */}
            <div className="flex-1 bg-black relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageWithFallback 
                  src={selectedStream.thumbnail}
                  alt={selectedStream.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Stream Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-red-600 text-white border-0 animate-pulse">
                        <Radio className="w-3 h-3 mr-1" />
                        LIVE
                      </Badge>
                      <div className="flex items-center gap-2 text-white">
                        <Eye className="w-4 h-4" />
                        {selectedStream.viewers.toLocaleString()}
                      </div>
                    </div>
                    <Button 
                      variant="ghost"
                      onClick={() => setSelectedStream(null)}
                      className="text-white"
                    >
                      ✕ Закрыть
                    </Button>
                  </div>
                </div>

                {/* Bottom Overlay - Stream Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h2 className="text-xl text-white mb-2">{selectedStream.title}</h2>
                  <div className="flex items-center gap-3">
                    <ImageWithFallback 
                      src={selectedStream.avatar}
                      alt={selectedStream.streamer}
                      className="w-10 h-10 rounded-full border-2 border-purple-500"
                    />
                    <div>
                      <div className="text-white">{selectedStream.streamer}</div>
                      <div className="text-sm text-gray-300">{selectedStream.category}</div>
                    </div>
                  </div>
                </div>

                {/* Donation Bar */}
                <div className="absolute right-4 top-20 bg-gray-900/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 w-64">
                  <h4 className="text-sm mb-3 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-yellow-400" />
                    Донат стримеру
                  </h4>
                  <div className="space-y-2">
                    <Input 
                      type="number"
                      placeholder="Сумма в TON"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="bg-gray-950/50 border-purple-500/20 h-8 text-sm"
                    />
                    <div className="flex gap-2">
                      {[1, 5, 10].map((amount) => (
                        <Button 
                          key={amount}
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7 text-xs border-purple-500/30"
                          onClick={() => setDonationAmount(amount.toString())}
                        >
                          {amount} TON
                        </Button>
                      ))}
                    </div>
                    <Button 
                      onClick={handleDonate}
                      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 h-8 text-sm"
                    >
                      💎 Отправить
                    </Button>
                  </div>
                </div>

                {/* Emoji Reactions */}
                <div className="absolute right-4 bottom-24 space-y-2">
                  {['❤️', '🔥', '🚀', '💎', '😂'].map((emoji) => (
                    <button
                      key={emoji}
                      className="block w-12 h-12 bg-gray-900/70 backdrop-blur-sm border border-purple-500/30 rounded-full text-2xl hover:bg-gray-800/70 hover:scale-110 transition-all"
                      onClick={() => toast.success(`Отправлено: ${emoji}`)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat & Info Sidebar */}
            <div className="w-full lg:w-80 bg-gray-950 border-l border-purple-500/20 flex flex-col">
              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsList className="bg-gray-900/50">
                  <TabsTrigger value="chat" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Чат
                  </TabsTrigger>
                  <TabsTrigger value="donators" className="flex-1">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Топ
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-4">
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-3">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className="bg-gray-900/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-purple-400 text-sm">{msg.user}</span>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input 
                      placeholder="Написать сообщение..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-gray-900/50 border-purple-500/20"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      ➤
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="donators" className="flex-1 m-0 p-4">
                  <h3 className="text-lg mb-4">Топ донатеры</h3>
                  <div className="space-y-3">
                    {topDonators.map((donator, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 bg-gray-900/50 rounded-lg p-3"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center">
                          <span>{idx + 1}</span>
                        </div>
                        <ImageWithFallback 
                          src={donator.avatar}
                          alt={donator.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div>{donator.name}</div>
                          <div className="text-sm text-yellow-400 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {donator.amount} TON
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h4 className="mb-2">Всего донатов</h4>
                    <div className="text-2xl text-yellow-400">{selectedStream.donations} TON</div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
