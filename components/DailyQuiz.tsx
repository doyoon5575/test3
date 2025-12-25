
import React, { useState, useEffect } from 'react';
import { getDailyQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';

interface DailyQuizProps {
  onComplete: (xp: number) => void;
  onCancel: () => void;
}

const DailyQuiz: React.FC<DailyQuizProps> = ({ onComplete, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const data = await getDailyQuiz();
      setQuestions(data);
      setLoading(false);
    };
    fetchQuiz();
  }, []);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    
    const correct = selectedOption === questions[currentIndex].correctAnswer;
    if (correct) setScore(s => s + 1);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(score * 20); // 20 XP per correct answer
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">AI가 오늘의 맞춤 문제를 <br/>생성하고 있습니다...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">문제를 불러오지 못했습니다.</p>
        <button onClick={onCancel} className="text-indigo-600 font-bold">돌아가기</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-indigo-600">문제 {currentIndex + 1} / {questions.length}</span>
        <button onClick={onCancel} className="text-sm text-gray-400">종료</button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 leading-tight mb-4">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => {
          let style = "border-gray-200 hover:border-indigo-300";
          if (isAnswered) {
            if (idx === currentQuestion.correctAnswer) {
              style = "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20";
            } else if (idx === selectedOption) {
              style = "bg-rose-50 border-rose-500";
            } else {
              style = "opacity-50 border-gray-100";
            }
          } else if (selectedOption === idx) {
            style = "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20";
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${style}`}
            >
              <span className={`font-medium ${selectedOption === idx ? 'text-indigo-700' : 'text-gray-700'}`}>
                {option}
              </span>
              {isAnswered && idx === currentQuestion.correctAnswer && <CheckCircle2 className="text-emerald-500 w-5 h-5" />}
              {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle className="text-rose-500 w-5 h-5" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="bg-indigo-50 p-4 rounded-xl mb-6">
          <p className="text-sm text-indigo-900 leading-relaxed">
            <span className="font-bold">해설:</span> {currentQuestion.explanation}
          </p>
        </div>
      )}

      <div className="sticky bottom-4">
        {!isAnswered ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={selectedOption === null}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
              selectedOption === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
            }`}
          >
            정답 확인
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
          >
            {currentIndex === questions.length - 1 ? '완료' : '다음 문제'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyQuiz;
