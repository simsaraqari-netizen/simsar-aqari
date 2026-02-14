
import { GoogleGenAI } from "@google/genai";

export const getPropertyAdvice = async (propertyTitle: string, price: number, area: string) => {
  // Initializing inside the function to ensure current environment variable access.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك خبيراً في العقار الكويتي، أعطني نصيحة سريعة حول هذا العقار: "${propertyTitle}" بسعر ${price} د.ك في منطقة ${area}. هل السعر منطقي؟ وما هي مميزات المنطقة؟`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، لا يمكن الحصول على نصيحة ذكية حالياً.";
  }
};
