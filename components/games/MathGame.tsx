
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface MathGameProps {
  onComplete: (xp: number) => void;
  onCancel: () => void;
}

const MathGame: React.FC<MathGameProps> = ({ onComplete, onCancel }) => {
  const [problem, setProblem] = useState({ q: '', a: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);

  const generateProblem = () => {
    const n1 = Math.floor(Math.random() * 15) + 1;
    const n2 = Math.floor(Math.random() * 15) + 1;
    const op = Math.random() > 0.5 ? '+' : '-';
    const ans = op === '+' ? n1 + n2 : n1 - n2;
    
    const opts = new Set([ans]);
    while (opts.size < 4) {
      opts.add(ans + (Math.floor(Math.random() * 10) - 5));
    }
    
    setProblem({ q: `${n1} ${op} ${n2} = ?`, a: ans });
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateProblem();
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (val: number) => {
    if (val === problem.a) {
      setScore(s => s + 1);
      generateProblem();
    } else {
      setTimeLeft(t => Math.max(0, t - 2));
    }
  };

  if (isGameOver) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center h-full">
        <h2 className="text-3xl font-bold mb-2">시간 종료!</h2>
        <p className="text-gray-500 mb-8">당신의 점수는 {score}점입니다.</p>
        <button 
          onClick={() => onComplete(score * 5)}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg"
        >
          경험치 받기 (+{score * 5} XP)
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2 text-rose-500 font-bold">
          <Timer className="w-5 h-5" />
          <span>{timeLeft}초</span>
        </div>
        <div className="text-lg font-bold text-gray-800">점수: {score}</div>
        <button onClick={onCancel} className="text-sm text-gray-400">종료</button>
      </div>

      <div className="text-center mb-12">
        <h3 className="text-5xl font-bold text-indigo-600 tracking-tight">
          {problem.q}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="p-6 bg-white border-2 border-gray-100 rounded-2xl text-2xl font-bold text-gray-700 hover:border-indigo-200 active:bg-indigo-50 transition-all shadow-sm"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MathGame;
