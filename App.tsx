
import React, { useState, useEffect } from 'react';
import { Brain, LayoutDashboard, Trophy, Settings, Sparkles } from 'lucide-react';
import Dashboard from './components/Dashboard';
import MemoryGame from './components/games/MemoryGame';
import MathGame from './components/games/MathGame';
import PatternGame from './components/games/PatternGame';
import DailyQuiz from './components/DailyQuiz';
import { GameType, UserStats } from './types';
import { getBrainTip } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'game' | 'stats'>('dashboard');
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    streak: 0,
    lastPlayed: null
  });
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    const fetchTip = async () => {
      const dailyTip = await getBrainTip();
      setTip(dailyTip);
    };
    fetchTip();
  }, []);

  const handleStartGame = (type: GameType) => {
    setCurrentGame(type);
    setActiveTab('game');
  };

  const handleGameComplete = (earnedXp: number) => {
    setStats(prev => {
      const newXp = prev.xp + earnedXp;
      const newLevel = Math.floor(newXp / 100) + 1;
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        streak: prev.streak + 1,
        lastPlayed: new Date().toISOString()
      };
    });
    setActiveTab('dashboard');
    setCurrentGame(null);
  };

  const renderContent = () => {
    if (activeTab === 'game') {
      switch (currentGame) {
        case GameType.MEMORY:
          return <MemoryGame onComplete={handleGameComplete} onCancel={() => setActiveTab('dashboard')} />;
        case GameType.MATH:
          return <MathGame onComplete={handleGameComplete} onCancel={() => setActiveTab('dashboard')} />;
        case GameType.PATTERN:
          return <PatternGame onComplete={handleGameComplete} onCancel={() => setActiveTab('dashboard')} />;
        case GameType.DAILY:
          return <DailyQuiz onComplete={handleGameComplete} onCancel={() => setActiveTab('dashboard')} />;
        default:
          return <Dashboard onStartGame={handleStartGame} stats={stats} tip={tip} />;
      }
    }

    if (activeTab === 'dashboard') {
      return <Dashboard onStartGame={handleStartGame} stats={stats} tip={tip} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h2 className="text-2xl font-bold mb-4">준비 중인 기능입니다</h2>
        <p className="text-gray-600">더 많은 통계와 기록을 곧 만나보실 수 있습니다.</p>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-xl relative">
      {/* Header */}
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">브레인 가든</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full border border-amber-200">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-bold text-amber-700">Lv.{stats.level}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {renderContent()}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t flex justify-around p-3 z-10 shadow-lg">
        <button 
          onClick={() => { setActiveTab('dashboard'); setCurrentGame(null); }}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-xs font-medium">홈</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'stats' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <Trophy className="w-6 h-6" />
          <span className="text-xs font-medium">업적</span>
        </button>
        <button 
          onClick={() => {}} 
          className="flex flex-col items-center gap-1 p-2 text-gray-400 cursor-not-allowed"
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs font-medium">설정</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
