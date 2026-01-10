"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { SparklesIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sanitizeImageUrl } from "@/lib/image-utils";
import { HeroCarousel } from "@/components/hero-carousel";
import { PersonalizedFeed } from "@/components/personalized-feed";

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
    });
}

// Category colors that complement violet
function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        Technology: "text-violet-500",
        Business: "text-amber-400",
        Science: "text-cyan-400",
        World: "text-blue-400",
        Sports: "text-green-400",
        Health: "text-pink-400",
        Entertainment: "text-rose-400",
    };
    return colors[category] || "text-violet-500";
}

export default function HomePage() {
    const allArticles = useQuery(api.news.list);

    // Loading
    if (allArticles === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    // Empty
    if (allArticles.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
                <div className="text-center space-y-6 max-w-md">
                    <div className="mx-auto w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center">
                        <SparklesIcon className="h-8 w-8 text-violet-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold">Welcome to newsroom</h1>
                        <p className="text-muted-foreground">
                            Get started by adding some sample articles to explore the platform.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Grid articles start from index 4 since carousel uses first 4
    const gridArticles = allArticles.slice(4, 10);
    const trendingArticles = allArticles.slice(0, 5);
    const leftColumnArticle = gridArticles[0];
    const middleColumnArticles = gridArticles.slice(1, 3);
    const rightColumnArticles = gridArticles.slice(3, 5);

    return (
        <div className="animate-fade-in space-y-10">
            {/* Hero Carousel Section */}
            <HeroCarousel articles={allArticles.slice(0, 4)} />

            {/* Personalized Feed for logged-in users */}
            <PersonalizedFeed />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_280px] gap-8">
                {/* Left Column - Large Card */}
                {leftColumnArticle && (
                    <div className="lg:col-span-1">
                        <ArticleCardLarge article={leftColumnArticle} />
                    </div>
                )}

                {/* Middle Column - Stacked Cards */}
                <div className="space-y-8">
                    {middleColumnArticles.map((article) => (
                        <ArticleCardSmall key={article._id} article={article} />
                    ))}
                </div>

                {/* Right Column - Stacked Cards */}
                <div className="space-y-8">
                    {rightColumnArticles.map((article) => (
                        <ArticleCardSmall key={article._id} article={article} />
                    ))}
                </div>

                {/* Trending Sidebar */}
                <aside className="hidden lg:block">
                    <h3 className="text-xl font-bold mb-6">Trending</h3>
                    <div className="space-y-6">
                        {trendingArticles.map((article) => (
                            <Link key={article._id} href={`/article/${article.slug}`} className="block group">
                                <h4 className="font-semibold leading-snug group-hover:text-violet-500 transition-colors line-clamp-2">
                                    {article.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">{article.author}</p>
                            </Link>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}

function ArticleCardLarge({ article }: { article: Doc<"articles"> }) {
    return (
        <article className="group">
            <Link href={`/article/${article.slug}`} className="block space-y-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                    <Image
                        src={sanitizeImageUrl(article.imageUrl)}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={`uppercase font-medium ${getCategoryColor(article.category)}`}>{article.category}</span>
                    <span>·</span>
                    <span>{formatDate(article.publishedAt)}</span>
                </div>
                <h2 className="text-xl font-bold leading-tight group-hover:text-violet-500 transition-colors">
                    {article.title}
                </h2>
                <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                <div className="flex items-center gap-2 pt-2">
                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                        {article.authorImage && (
                            <Image src={article.authorImage} alt={article.author || ""} width={32} height={32} className="object-cover" />
                        )}
                    </div>
                    <span className="text-sm font-medium">{article.author}</span>
                </div>
            </Link>
        </article>
    );
}

function ArticleCardSmall({ article }: { article: Doc<"articles"> }) {
    return (
        <article className="group">
            <Link href={`/article/${article.slug}`} className="block space-y-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                    <Image
                        src={sanitizeImageUrl(article.imageUrl)}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={`uppercase font-medium ${getCategoryColor(article.category)}`}>{article.category}</span>
                    <span>·</span>
                    <span>{formatDate(article.publishedAt)}</span>
                </div>
                <h3 className="font-semibold leading-snug group-hover:text-violet-500 transition-colors line-clamp-2">
                    {article.title}
                </h3>
            </Link>
        </article>
    );
}
