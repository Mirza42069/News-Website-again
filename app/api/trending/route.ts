import { NextResponse } from "next/server";

// Advanced caching with stale-while-revalidate pattern
export const dynamic = "force-static";
export const revalidate = 60; // Revalidate every minute for trending

// Simulated trending calculation
function calculateTrendingScore(views: number, recency: number, shares: number): number {
    // Decay factor based on time
    const decayFactor = Math.exp(-recency / (24 * 60 * 60 * 1000)); // 24 hour half-life
    return (views * 0.5 + shares * 2) * decayFactor;
}

// Simulated trending articles
const TRENDING_ARTICLES = [
    {
        id: "t1",
        title: "AI Revolution: What's Next?",
        category: "Technology",
        views: 15000,
        shares: 450,
        trendingScore: 95,
    },
    {
        id: "t2",
        title: "Climate Summit Results",
        category: "World",
        views: 12000,
        shares: 380,
        trendingScore: 88,
    },
    {
        id: "t3",
        title: "Market Analysis: Q4 Outlook",
        category: "Business",
        views: 8500,
        shares: 220,
        trendingScore: 72,
    },
    {
        id: "t4",
        title: "New Space Discovery",
        category: "Science",
        views: 11000,
        shares: 290,
        trendingScore: 81,
    },
    {
        id: "t5",
        title: "Tech Giants Earnings Report",
        category: "Business",
        views: 9200,
        shares: 310,
        trendingScore: 78,
    },
];

export async function GET() {
    const now = new Date();

    // Calculate fresh trending scores
    const articlesWithScores = TRENDING_ARTICLES.map((article, index) => ({
        ...article,
        rank: index + 1,
        updatedAt: now.toISOString(),
    }));

    // Add comprehensive cache headers
    const headers = new Headers();

    // Cache for 1 minute, allow stale content for up to 10 minutes while revalidating
    headers.set(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=600, stale-if-error=3600"
    );

    // Surrogate keys for CDN cache invalidation (Vercel/Cloudflare)
    headers.set("Surrogate-Key", "trending articles homepage");

    // Cache tags for fine-grained invalidation
    headers.set("X-Cache-Tags", "trending,articles,homepage");

    // Debug info
    headers.set("X-Cache-Generated", now.toISOString());
    headers.set("X-Revalidate-After", "60 seconds");

    return NextResponse.json(
        {
            trending: articlesWithScores,
            meta: {
                cached: true,
                generatedAt: now.toISOString(),
                revalidateIn: "1 minute",
                staleWhileRevalidate: "10 minutes",
                tags: ["trending", "articles", "homepage"],
            },
        },
        { headers }
    );
}
