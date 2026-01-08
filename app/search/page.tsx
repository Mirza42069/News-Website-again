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
import { ArrowLeftIcon, SearchIcon, SparklesIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { sanitizeImageUrl } from "@/lib/image-utils";

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
    const [isAISearch, setIsAISearch] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [aiResults, setAiResults] = React.useState<any[] | null>(null);

    const handleAIToggle = async () => {
        if (isAISearch) {
            setIsAISearch(false);
            setAiResults(null);
            toast.info("Switched to keyword search");
            return;
        }

        if (!allArticles || !query) return;

        setIsProcessing(true);
        toast.loading("Running AI semantic analysis...", { id: "ai-search" });

        try {
            const response = await fetch("/api/ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query,
                    articles: allArticles.map(a => ({
                        _id: a._id,
                        title: a.title,
                        excerpt: a.excerpt,
                        category: a.category,
                        content: a.content?.substring(0, 500),
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "AI search failed");
            }

            // Map the ranked articles back with full data
            const rankedWithFullData = data.rankedArticles.map((ranked: any) => {
                const fullArticle = allArticles.find(a => a._id === ranked._id);
                return { ...fullArticle, score: ranked.score };
            }).filter(Boolean);

            setAiResults(rankedWithFullData);
            setIsAISearch(true);
            toast.success("AI Search enabled", {
                id: "ai-search",
                description: "Results ranked by semantic relevance",
            });
        } catch (error) {
            console.error("AI Search error:", error);
            toast.error(error instanceof Error ? error.message : "AI search failed", {
                id: "ai-search",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const results = React.useMemo(() => {
        if (!allArticles) return [];

        // If AI search is active and we have results, use them
        if (isAISearch && aiResults) {
            return aiResults;
        }

        // Show all articles if no query
        if (!query) return allArticles;

        // Regular keyword search
        const lowerQuery = query.toLowerCase();
        return allArticles.filter(
            (article) =>
                article.title.toLowerCase().includes(lowerQuery) ||
                article.excerpt.toLowerCase().includes(lowerQuery) ||
                article.category.toLowerCase().includes(lowerQuery) ||
                article.author.toLowerCase().includes(lowerQuery)
        );
    }, [allArticles, query, isAISearch, aiResults]);

    if (allArticles === undefined) {
        return <div className="text-center py-20 text-muted-foreground">Loading...</div>;
    }

    return (
        <>
            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        {query ? (
                            <>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <SearchIcon className="h-4 w-4" />
                                    <span className="text-sm">Search results for</span>
                                </div>
                                <h1 className="text-2xl font-bold">"{query}"</h1>
                            </>
                        ) : (
                            <h1 className="text-2xl font-bold">All News</h1>
                        )}
                        <p className="text-muted-foreground">
                            {results.length} article{results.length !== 1 ? "s" : ""}
                            {query && isAISearch && <span className="text-violet-500 ml-1">• AI ranked</span>}
                        </p>
                    </div>

                    {/* AI Search Toggle - only show when searching */}
                    {query && (
                        <Button
                            variant={isAISearch ? "default" : "outline"}
                            size="sm"
                            onClick={handleAIToggle}
                            disabled={isProcessing}
                            className={isAISearch
                                ? "gap-2 bg-violet-500 hover:bg-violet-600 text-white"
                                : "gap-2 border-violet-500/30 text-violet-500 hover:bg-violet-500/10"
                            }
                        >
                            {isProcessing ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                                <SparklesIcon className="h-4 w-4" />
                            )}
                            {isAISearch ? "AI Search On" : "Try AI Search"}
                        </Button>
                    )}
                </div>

                {query && isAISearch && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-sm">
                        <SparklesIcon className="h-4 w-4 text-violet-500" />
                        <span className="text-violet-500">
                            Powered by Gemini AI — results ranked by semantic meaning
                        </span>
                    </div>
                )}
            </div>

            {results.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No articles found matching your search.</p>
                    {!isAISearch && query && (
                        <Button
                            variant="link"
                            className="text-violet-500 mt-2"
                            onClick={handleAIToggle}
                        >
                            <SparklesIcon className="h-4 w-4 mr-1" />
                            Try AI Search for better results
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map((article, index) => (
                        <Link key={article._id} href={`/article/${article.slug}`} className="block group">
                            <article className="flex gap-4 p-4 rounded-lg border border-transparent hover:border-violet-500/20 hover:bg-violet-500/5 transition-colors">
                                {/* AI Rank Badge */}
                                {isAISearch && (
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500/10 text-violet-500 font-semibold text-sm flex-shrink-0">
                                        {index + 1}
                                    </div>
                                )}

                                {article.imageUrl && (
                                    <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={sanitizeImageUrl(article.imageUrl)}
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
                                        {isAISearch && 'score' in article && (
                                            <span className="text-violet-500 ml-auto">
                                                {Math.round((article as any).score)}% match
                                            </span>
                                        )}
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
