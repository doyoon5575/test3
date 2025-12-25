
import React, { useState, useEffect } from 'react';

interface PatternGameProps {
  onComplete: (xp: number) => void;
  onCancel: () => void;
}

const PatternGame: React.FC<PatternGameProps> = ({ onComplete, onCancel }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [level, setLevel] = useState(1);

  const startNextLevel = (newLevel: number) => {
    const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(nextSeq);
    setUserSequence([]);
    playSequence(nextSeq);
  };

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setActiveButton(seq[i]);
      await new Promise(r => setTimeout(r, 500));
      setActiveButton(null);
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    startNextLevel(1);
  }, []);

  const handleButtonClick = (idx: number) => {
    if (isPlaying) return;

    const newUserSeq = [...userSequence, idx];
    setUserSequence(newUserSeq);

    // Check if correct
    if (newUserSeq[newUserSeq.length - 1] !== sequence[newUserSeq.length - 1]) {
      alert(`아쉬워요! ${level}단계까지 성공했습니다.`);
      onComplete(level * 10);
      return;
    }

    // Check if level complete
    if (newUserSeq.length === sequence.length) {
      setLevel(l => l + 1);
      setTimeout(() => startNextLevel(level + 1), 1000);
    }
  };

  const colors = [
    'bg-rose-400',
    'bg-blue-400',
    'bg-emerald-400',
    'bg-amber-400'
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-xl font-bold">패턴 따라하기</h2>
        <div className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">
          Level {level}
        </div>
        <button onClick={onCancel} className="text-sm text-gray-400">종료</button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-12">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            disabled={isPlaying}
            onClick={() => handleButtonClick(i)}
            className={`aspect-square rounded-3xl transition-all duration-200 ${colors[i]} ${
              activeButton === i ? 'ring-8 ring-white/50 scale-105 brightness-125' : 'opacity-80 hover:opacity-100'
            }`}
          />
        ))}
      </div>

      <p className="text-center text-gray-500 font-medium">
        {isPlaying ? '패턴을 기억하세요...' : '방금 본 순서대로 버튼을 누르세요!'}
      </p>
    </div>
  );
};

export default PatternGame;
