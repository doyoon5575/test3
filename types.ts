
export enum GameType {
  MEMORY = 'MEMORY',
  MATH = 'MATH',
  PATTERN = 'PATTERN',
  WORD = 'WORD',
  DAILY = 'DAILY'
}

export interface GameScore {
  type: GameType;
  score: number;
  date: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserStats {
  level: number;
  xp: number;
  streak: number;
  lastPlayed: string | null;
}
