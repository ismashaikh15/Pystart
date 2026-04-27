import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getFeedback(
  userCode: string,
  lessonTitle: string,
  instruction: string
): Promise<AIResponse> {
  const prompt = `
    You are "Py", a friendly and encouraging Python coach for kids (ages 8-14).
    The student is working on a lesson called "${lessonTitle}".
    The goal is: "${instruction}".
    
    Student's code:
    \`\`\`python
    ${userCode}
    \`\`\`
    
    Tasks:
    1. Check if the code is correct for the instruction.
    2. If there are errors (syntax or logic), explain them in a simple, kid-friendly way.
    3. Instead of saying "SyntaxError", say things like "Oops! Python expected brackets here ()".
    4. Provide the improved version of the code if it's wrong.
    
    Respond in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING },
            isCorrect: { type: Type.BOOLEAN },
            improvedCode: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["feedback", "isCorrect"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as AIResponse;
  } catch (error) {
    console.error("AI Error:", error);
    return {
      feedback: "Oh no! My brain is a bit fuzzy right now. Try checking your code once more!",
      isCorrect: false,
    };
  }
}

export async function simplifyExplanation(topic: string): Promise<string> {
  const prompt = `Explain the Python concept of "${topic}" to an 8-year-old using a fun analogy. Keep it short (2-3 sentences).`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "I'll explain this better next time!";
  } catch (error) {
    return "Let's try to learn this together!";
  }
}
