"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { SparklesIcon } from "lucide-react";
import { sanitizeImageUrl } from "@/lib/image-utils";

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export function PersonalizedFeed() {
    const { user, isSignedIn } = useUser();
    
    const preferredCategories = useQuery(
        api.readHistory.getPreferredCategories,
        isSignedIn && user ? { userId: user.id } : "skip"
    );
    
    const allArticles = useQuery(api.news.list);
    
    if (!isSignedIn || !user) return null;
    if (!preferredCategories || preferredCategories.length === 0) return null;
    if (!allArticles) return null;
    
    // Filter articles by preferred categories, excluding already read
    const recommendedArticles = allArticles
        .filter(article => preferredCategories.includes(article.category))
        .slice(0, 4);
    
    if (recommendedArticles.length === 0) return null;
    
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-violet-500" />
                <h2 className="text-lg font-semibold">For You</h2>
                <span className="text-xs text-muted-foreground bg-violet-500/10 px-2 py-0.5 rounded-full">
                    Based on your reading
                </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendedArticles.map((article) => (
                    <Link
                        key={article._id}
                        href={`/article/${article.slug}`}
                        className="group block space-y-2"
                    >
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                            <Image
                                src={sanitizeImageUrl(article.imageUrl)}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="text-violet-500 font-medium">{article.category}</span>
                                <span>·</span>
                                <span>{formatDate(article.publishedAt)}</span>
                            </div>
                            <h3 className="font-medium text-sm leading-snug group-hover:text-violet-500 transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
