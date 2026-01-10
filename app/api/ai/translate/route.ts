import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      );
    }

    const languageName =
      targetLanguage === "id" ? "Indonesian (Bahasa Indonesia)" : "English";

    const prompt = `Translate the following text to ${languageName}. 
Only return the translated text, nothing else. Preserve all markdown formatting, headers, lists, and structure.

Text to translate:
${text}`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
    } catch {
      // Fallback to 1.5-flash if 2.0 is overloaded
      response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
    }

    const translatedText = response.text?.trim();

    if (!translatedText) {
      return NextResponse.json(
        { error: "Failed to generate translation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      {
        error: "Translation service temporarily unavailable. Please try again.",
      },
      { status: 503 }
    );
  }
}
