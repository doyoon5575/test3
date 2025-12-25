
import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface MemoryGameProps {
  onComplete: (xp: number) => void;
  onCancel: () => void;
}

const ICONS = ['🍎', '🍌', '🍇', '🍒', '🍓', '🍑', '🥝', '🍍'];

const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, onCancel }) => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const shuffle = () => {
      const combined = [...ICONS, ...ICONS]
        .sort(() => Math.random() - 0.5);
      setCards(combined);
    };
    shuffle();
  }, []);

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setSolved(prev => {
          const next = [...prev, ...newFlipped];
          if (next.length === cards.length) {
            setTimeout(() => onComplete(50), 800);
          }
          return next;
        });
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">기억의 조각</h2>
          <p className="text-sm text-gray-500">같은 그림을 찾아보세요</p>
        </div>
        <button onClick={onCancel} className="text-sm text-gray-400">종료</button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || solved.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-300 transform ${
                isFlipped 
                ? 'bg-white border-2 border-indigo-200 rotate-0' 
                : 'bg-indigo-600 -rotate-3 hover:scale-105'
              }`}
            >
              {isFlipped ? card : <HelpCircle className="w-8 h-8 text-white/50" />}
            </button>
          );
        })}
      </div>

      <div className="bg-gray-50 p-4 rounded-xl flex justify-between">
        <span className="text-gray-600 font-medium">시도 횟수</span>
        <span className="font-bold text-indigo-600">{moves}번</span>
      </div>
    </div>
  );
};

export default MemoryGame;
