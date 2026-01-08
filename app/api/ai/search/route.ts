import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface Article {
    _id: string;
    title: string;
    excerpt: string;
    category: string;
    content?: string;
}

export async function POST(request: NextRequest) {
    try {
        const { query, articles } = await request.json() as { query: string; articles: Article[] };

        if (!query || !articles || !Array.isArray(articles)) {
            return NextResponse.json(
                { error: "Query and articles array are required" },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key not configured" },
                { status: 500 }
            );
        }

        // Create a simplified article list for the AI
        const articleList = articles.map((a, i) => 
            `[${i}] Title: "${a.title}" | Category: ${a.category} | Excerpt: ${a.excerpt.substring(0, 150)}...`
        ).join("\n");

        const prompt = `You are a semantic search engine. Analyze how relevant each article is to the user's search query.

User's Search Query: "${query}"

Articles to rank:
${articleList}

For each article, assign a relevance score from 0-100 based on:
- How well the article matches the semantic meaning of the query (not just keywords)
- Topic relevance and conceptual connections
- How useful this article would be for someone searching for "${query}"

Respond ONLY with a JSON array of objects with "index" (number) and "score" (number 0-100).
Example: [{"index": 0, "score": 85}, {"index": 1, "score": 45}]

Only include articles with score > 0. Sort by score descending.`;

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

        const text = response.text || "[]";
        
        // Extract JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            return NextResponse.json({ rankedArticles: articles.map((a, i) => ({ ...a, score: 50 - i })) });
        }

        const scores: { index: number; score: number }[] = JSON.parse(jsonMatch[0]);
        
        // Map scores back to articles
        const rankedArticles = scores
            .filter(s => s.score > 0 && s.index >= 0 && s.index < articles.length)
            .map(s => ({
                ...articles[s.index],
                score: s.score,
            }));

        return NextResponse.json({ rankedArticles });
    } catch (error) {
        console.error("AI Search error:", error);
        return NextResponse.json(
            { error: "AI service temporarily unavailable. Please try again." },
            { status: 503 }
        );
    }
}
