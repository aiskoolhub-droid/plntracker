
import { GoogleGenAI } from "@google/genai";
import { Expense } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (expenses: Expense[]) => {
  if (expenses.length === 0) return "Dodaj kilka wydatków, aby otrzymać poradę finansową AI.";

  const expenseSummary = expenses
    .map(e => `${e.title}: ${e.amount} PLN (${e.category})`)
    .join(', ');

  const prompt = `Analizując poniższe wydatki w PLN: ${expenseSummary}. 
  Podaj krótką, motywującą poradę finansową (max 2 zdania) po polsku.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Błąd podczas generowania porady.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Nie udało się połączyć z asystentem AI.";
  }
};
