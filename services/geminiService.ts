
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

export const getDailyQuiz = async (): Promise<QuizQuestion[]> => {
  // 호출 시점에 인스턴스를 생성하여 환경 변수 주입 보장
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "치매 예방을 위한 실생활 관련 인지 능력 퀴즈 3개를 만들어줘. 기억력, 논리력, 계산력을 포함해줘. 모든 내용은 한국어로 작성해줘.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING },
              minItems: 4,
              maxItems: 4
            },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse quiz response:", error);
    return [];
  }
};

export const getBrainTip = async (): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "오늘의 치매 예방 팁을 한 문장으로 친절하게 알려줘. 한국어로 작성해줘.",
  });
  return response.text || "매일 꾸준히 뇌 운동을 하는 것이 중요합니다!";
};
