import { NextResponse } from "next/server";

// Cache configuration using Next.js 16 cache headers
export const dynamic = "force-static";
export const revalidate = 300; // Revalidate every 5 minutes

// Simulated articles data for caching demo
// In production, this would fetch from Convex or another database
const CACHED_ARTICLES = [
    {
        id: "1",
        title: "Breaking News: Technology Advances",
        category: "Technology",
        excerpt: "Latest developments in AI and machine learning...",
        publishedAt: Date.now() - 3600000,
    },
    {
        id: "2",
        title: "Business Markets Update",
        category: "Business",
        excerpt: "Stock markets show positive trends...",
        publishedAt: Date.now() - 7200000,
    },
    {
        id: "3",
        title: "Science Discovery",
        category: "Science",
        excerpt: "Researchers announce breakthrough...",
        publishedAt: Date.now() - 10800000,
    },
];

export async function GET() {
    // Add cache headers for CDN/browser caching
    const headers = new Headers();
    headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    headers.set("X-Cache-Status", "HIT");
    headers.set("X-Cache-Time", new Date().toISOString());

    return NextResponse.json(
        {
            articles: CACHED_ARTICLES,
            cached: true,
            cachedAt: new Date().toISOString(),
            revalidateIn: "5 minutes",
        },
        { headers }
    );
}
