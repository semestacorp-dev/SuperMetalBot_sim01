
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getGeminiResponse = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set in the environment variables.");
  }

  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using gemini-2.5-flash for general text tasks
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to get response from Gemini: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export { getGeminiResponse };
