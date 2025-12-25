
import React from 'react';
import { GameType, UserStats } from '../types';
import { BrainCircuit, Calculator, Shapes, Lightbulb, MessageSquare } from 'lucide-react';

interface DashboardProps {
  onStartGame: (type: GameType) => void;
  stats: UserStats;
  tip: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartGame, stats, tip }) => {
  const games = [
    {
      id: GameType.DAILY,
      name: "데일리 AI 퀴즈",
      description: "오늘의 맞춤형 인지 문제",
      icon: MessageSquare,
      color: "bg-purple-100 text-purple-600",
      accent: "bg-purple-600"
    },
    {
      id: GameType.MEMORY,
      name: "기억의 조각",
      description: "그림을 기억하고 짝을 맞춰보세요",
      icon: BrainCircuit,
      color: "bg-blue-100 text-blue-600",
      accent: "bg-blue-600"
    },
    {
      id: GameType.MATH,
      name: "순발력 연산",
      description: "빠르게 계산하여 뇌를 깨워주세요",
      icon: Calculator,
      color: "bg-emerald-100 text-emerald-600",
      accent: "bg-emerald-600"
    },
    {
      id: GameType.PATTERN,
      name: "패턴 따라하기",
      description: "나타나는 순서를 기억해보세요",
      icon: Shapes,
      color: "bg-orange-100 text-orange-600",
      accent: "bg-orange-600"
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome & Stats */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-1">안녕하세요! 👋</h2>
        <p className="text-indigo-100 mb-6">오늘도 건강한 뇌를 만들어볼까요?</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-3 border border-white/20">
            <p className="text-xs text-indigo-200">오늘의 진행도</p>
            <div className="flex items-end justify-between">
              <span className="text-xl font-bold">{stats.xp % 100}%</span>
              <div className="h-1.5 w-16 bg-white/20 rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-white rounded-full" 
                  style={{ width: `${stats.xp % 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/20">
            <p className="text-xs text-indigo-200">연속 출석일</p>
            <p className="text-xl font-bold">{stats.streak}일</p>
          </div>
        </div>
      </section>

      {/* Daily Tip */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start">
        <div className="p-2 bg-amber-200 rounded-full">
          <Lightbulb className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h3 className="font-bold text-amber-900 text-sm mb-1">오늘의 뇌 건강 팁</h3>
          <p className="text-amber-800 text-sm leading-relaxed">
            {tip || "로딩 중..."}
          </p>
        </div>
      </section>

      {/* Game Grid */}
      <section>
        <h3 className="font-bold text-gray-800 mb-4 px-1">인지 훈련 시작하기</h3>
        <div className="grid grid-cols-1 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onStartGame(game.id)}
              className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-left group"
            >
              <div className={`p-4 rounded-xl transition-colors ${game.color}`}>
                <game.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{game.name}</h4>
                <p className="text-sm text-gray-500">{game.description}</p>
              </div>
              <div className={`w-2 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${game.accent}`} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
