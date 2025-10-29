import { Home, TrendingUp, Plus, Video, Film, User, History as HistoryIcon, Trophy, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

type Page = 'home' | 'token' | 'create' | 'streams' | 'reels' | 'profile' | 'history' | 'leaderboard';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export function Navigation({ currentPage, onNavigate, theme, onThemeToggle }: NavigationProps) {
  const navItems = [
    { id: 'home' as Page, icon: Home, label: 'Главная' },
    { id: 'create' as Page, icon: Plus, label: 'Создать' },
    { id: 'streams' as Page, icon: Video, label: 'Стримы' },
    { id: 'reels' as Page, icon: Film, label: 'Reels' },
    { id: 'leaderboard' as Page, icon: Trophy, label: 'Топ' },
    { id: 'history' as Page, icon: HistoryIcon, label: 'История' },
    { id: 'profile' as Page, icon: User, label: 'Профиль' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`hidden md:flex items-center justify-between px-8 py-4 sticky top-0 z-50 backdrop-blur-xl border-b ${
        theme === 'dark' 
          ? 'bg-gray-950/80 border-purple-500/20' 
          : 'bg-white/80 border-purple-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pump</span> Ton
            </h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>TON Blockchain</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        <Button
          onClick={onThemeToggle}
          variant="outline"
          size="icon"
          className="rounded-lg"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl ${
        theme === 'dark'
          ? 'bg-gray-950/95 border-purple-500/20'
          : 'bg-white/95 border-purple-200'
      }`}>
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'text-purple-400'
                    : theme === 'dark'
                    ? 'text-gray-500'
                    : 'text-gray-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
