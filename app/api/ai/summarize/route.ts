import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: NextRequest) {
    try {
        const { content, title } = await request.json();

        if (!content || !title) {
            return NextResponse.json(
                { error: "Content and title are required" },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key not configured" },
                { status: 500 }
            );
        }

        const prompt = `You are a news article summarizer. Create a concise, well-structured summary of the following article.

Title: ${title}

Article Content:
${content}

Please provide:
1. A brief 2-3 sentence overview
2. 3-4 key points as bullet points
3. The main takeaway

Format your response in markdown with clear headings.`;

        // Try with stable model first, fallback if needed
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

        const summary = response.text || "Unable to generate summary.";

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("AI Summarize error:", error);
        return NextResponse.json(
            { error: "AI service temporarily unavailable. Please try again in a moment." },
            { status: 503 }
        );
    }
}
