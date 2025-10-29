import { useState } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Upload, Image as ImageIcon, Music, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

type Page = 'home' | 'token' | 'create' | 'streams' | 'reels' | 'profile' | 'history' | 'leaderboard';

interface ReelsProps {
  onNavigate: (page: Page) => void;
}

interface Reel {
  id: string;
  author: string;
  avatar: string;
  video: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  token?: string;
  tags: string[];
}

const mockReels: Reel[] = [
  { id: '1', author: 'CryptoKing', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', video: 'https://images.unsplash.com/photo-1610041321024-0dff35bf9923?w=400', caption: 'PEPETON полетел! 🚀 Купил в самом низу #PumpTon #TON', likes: 12450, comments: 234, shares: 89, liked: false, token: 'PEPETON', tags: ['#PumpTon', '#TON', '#Crypto'] },
  { id: '2', author: 'MemeTrader', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', video: 'https://images.unsplash.com/photo-1497015289639-54688650d173?w=400', caption: 'Как я сделал 10x за неделю 💎 #Trading #Meme', likes: 8920, comments: 156, shares: 67, liked: true, tags: ['#Trading', '#Meme'] },
  { id: '3', author: 'DiamondHands', avatar: 'https://images.unsplash.com/photo-1691085272761-eb72dc7dd3f5?w=100', video: 'https://images.unsplash.com/photo-1623002126996-a38b8a41f4f3?w=400', caption: 'Новый токен только что залистился! 🔥 #NewToken', likes: 15670, comments: 342, shares: 128, liked: false, tags: ['#NewToken', '#Launch'] },
];

export function Reels({ onNavigate }: ReelsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reels, setReels] = useState(mockReels);
  const [isMuted, setIsMuted] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    caption: '',
    tags: '',
    sound: '',
  });

  const currentReel = reels[currentIndex];

  const handleLike = () => {
    setReels(reels.map((reel, idx) => 
      idx === currentIndex 
        ? { ...reel, liked: !reel.liked, likes: reel.liked ? reel.likes - 1 : reel.likes + 1 }
        : reel
    ));
  };

  const handleShare = () => {
    toast.success('Ссылка скопирована! 📋');
  };

  const handleUpload = () => {
    toast.success('Reels загружен! 🎉');
    setShowUpload(false);
    setUploadData({ caption: '', tags: '', sound: '' });
  };

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Main Reel Display */}
      <div>
        <div className="h-full w-full relative">
          {/* Video Background */}
          <div className="absolute inset-0">
            <ImageWithFallback 
              src={currentReel.video}
              alt={currentReel.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
          </div>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() => onNavigate('home')}
              >
                ✕
              </Button>
              <h1 className="text-xl text-white">Reels</h1>
            </div>

            <Dialog open={showUpload} onOpenChange={setShowUpload}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-purple-500/20">
                <DialogHeader>
                  <DialogTitle>Загрузить Reels</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Видео</label>
                    <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/60 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Нажмите для загрузки</p>
                      <p className="text-xs text-gray-500 mt-1">MP4, макс. 60 сек</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Описание</label>
                    <Textarea 
                      placeholder="Расскажите о вашем видео..."
                      value={uploadData.caption}
                      onChange={(e) => setUploadData({...uploadData, caption: e.target.value})}
                      className="bg-gray-950/50 border-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Теги</label>
                    <Input 
                      placeholder="#PumpTon #Crypto #TON"
                      value={uploadData.tags}
                      onChange={(e) => setUploadData({...uploadData, tags: e.target.value})}
                      className="bg-gray-950/50 border-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Музыка (опционально)</label>
                    <Input 
                      placeholder="Выберите трек"
                      value={uploadData.sound}
                      onChange={(e) => setUploadData({...uploadData, sound: e.target.value})}
                      className="bg-gray-950/50 border-purple-500/20"
                    />
                  </div>

                  <Button 
                    onClick={handleUpload}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Опубликовать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Content Overlay - Bottom Left */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <div className="max-w-md">
              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <ImageWithFallback 
                  src={currentReel.avatar}
                  alt={currentReel.author}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div>
                  <div className="text-white">{currentReel.author}</div>
                  {currentReel.token && (
                    <Badge className="bg-purple-600 text-white border-0 mt-1">
                      ${currentReel.token}
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="ml-auto border-white text-white hover:bg-white hover:text-black"
                >
                  Подписаться
                </Button>
              </div>

              {/* Caption */}
              <p className="text-white mb-3">{currentReel.caption}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {currentReel.tags.map((tag, idx) => (
                  <span key={idx} className="text-purple-300 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons - Right Side */}
          <div className="absolute right-4 bottom-24 space-y-6 z-10">
            <button
              onClick={handleLike}
              className="flex flex-col items-center active:scale-90 transition-transform"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
                currentReel.liked 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-gray-900/50 text-white hover:bg-gray-800/70'
              }`}>
                <Heart className={`w-7 h-7 ${currentReel.liked ? 'fill-white' : ''}`} />
              </div>
              <span className="text-white text-sm mt-1">{(currentReel.likes / 1000).toFixed(1)}K</span>
            </button>

            <button
              className="flex flex-col items-center active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 rounded-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gray-800/70 transition-colors">
                <MessageCircle className="w-7 h-7" />
              </div>
              <span className="text-white text-sm mt-1">{currentReel.comments}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 rounded-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gray-800/70 transition-colors">
                <Share2 className="w-7 h-7" />
              </div>
              <span className="text-white text-sm mt-1">{currentReel.shares}</span>
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex flex-col items-center active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 rounded-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gray-800/70 transition-colors">
                {isMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
              </div>
            </button>
          </div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={() => handleScroll('up')}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full text-white opacity-50 hover:opacity-100 transition-opacity"
            >
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                ↑
              </div>
            </button>
          )}
          
          {currentIndex < reels.length - 1 && (
            <button
              onClick={() => handleScroll('down')}
              className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-full text-white opacity-50 hover:opacity-100 transition-opacity"
            >
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                ↓
              </div>
            </button>
          )}

          {/* Progress Indicator */}
          <div className="absolute top-20 right-4 space-y-1">
            {reels.map((_, idx) => (
              <div
                key={idx}
                className={`w-1 h-8 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top Reels Widget - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block absolute top-20 left-6 w-64 z-20">
        <Card className="bg-gray-900/80 backdrop-blur-xl border-purple-500/30 p-4">
          <h3 className="mb-3 flex items-center gap-2">
            <Play className="w-5 h-5 text-purple-400" />
            Топ Reels
          </h3>
          <div className="space-y-2">
            {mockReels.slice(0, 3).map((reel, idx) => (
              <div 
                key={reel.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 rounded p-2 transition-colors"
                onClick={() => setCurrentIndex(idx)}
              >
                <div className="text-purple-400">{idx + 1}</div>
                <ImageWithFallback 
                  src={reel.video}
                  alt={reel.author}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{reel.author}</div>
                  <div className="text-xs text-gray-400">{(reel.likes / 1000).toFixed(1)}K ❤️</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
