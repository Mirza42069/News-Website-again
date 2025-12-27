"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const allArticles = useQuery(api.news.list);

    const results = React.useMemo(() => {
        if (!allArticles || !query) return [];
        const lowerQuery = query.toLowerCase();
        return allArticles.filter(
            (article) =>
                article.title.toLowerCase().includes(lowerQuery) ||
                article.excerpt.toLowerCase().includes(lowerQuery) ||
                article.category.toLowerCase().includes(lowerQuery) ||
                article.author.toLowerCase().includes(lowerQuery)
        );
    }, [allArticles, query]);

    if (allArticles === undefined) {
        return <div className="text-center py-20 text-muted-foreground">Loading...</div>;
    }

    return (
        <>
            <div className="mb-8 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <SearchIcon className="h-4 w-4" />
                    <span className="text-sm">Search results for</span>
                </div>
                <h1 className="text-2xl font-bold">"{query}"</h1>
                <p className="text-muted-foreground">{results.length} article{results.length !== 1 ? "s" : ""} found</p>
            </div>

            {results.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No articles found matching your search.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {results.map((article) => (
                        <Link key={article._id} href={`/article/${article.slug}`} className="block group">
                            <article className="flex gap-4 p-4 rounded-lg border border-transparent hover:border-violet-500/20 hover:bg-violet-500/5 transition-colors">
                                {article.imageUrl && (
                                    <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={article.imageUrl}
                                            alt=""
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="font-normal text-xs">{article.category}</Badge>
                                        <span>{formatDate(article.publishedAt)}</span>
                                    </div>
                                    <h2 className="font-medium group-hover:text-violet-500 transition-colors line-clamp-2">{article.title}</h2>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}

export default function SearchPage() {
    return (
        <div className="animate-fade-in">
            <Button variant="ghost" size="sm" asChild className="mb-8 text-muted-foreground hover:text-violet-500">
                <Link href="/"><ArrowLeftIcon className="mr-2 h-4 w-4" />Back</Link>
            </Button>
            <Suspense fallback={<div className="text-center py-20 text-muted-foreground">Loading...</div>}>
                <SearchResults />
            </Suspense>
        </div>
    );
}
