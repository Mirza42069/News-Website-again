"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { VoteButtons } from "@/components/vote-buttons";
import { ArrowRightIcon } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

interface NewsCardProps {
    article: Doc<"articles">;
    variant?: "default" | "horizontal" | "minimal";
    index?: number;
}

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Generate vote count - some articles get negative votes
function getVoteCount(articleId: string, index?: number): { votes: number; preVoted?: "down" } {
    const charCode = articleId.charCodeAt(0);

    // Make some articles have negative votes (every 3rd or 4th article)
    if (charCode % 4 === 0 || (index !== undefined && index % 3 === 2)) {
        return { votes: -12, preVoted: "down" };
    }
    if (charCode % 5 === 0) {
        return { votes: -5, preVoted: "down" };
    }

    return { votes: charCode % 50 + 10 };
}

export function NewsCard({ article, variant = "default", index }: NewsCardProps) {
    const { votes, preVoted } = getVoteCount(article._id, index);

    // Minimal variant - clean text-only design with votes
    if (variant === "minimal") {
        return (
            <div className="flex gap-3 py-4">
                <VoteButtons initialVotes={votes} size="sm" preVoted={preVoted} />
                <Link href={`/article/${article.slug}`} className="group block flex-1">
                    <article className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="text-violet-500">{article.category}</span>
                            <span className="w-1 h-1 rounded-full bg-violet-500/30" />
                            <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <h3 className="font-semibold leading-snug group-hover:text-violet-500 transition-colors line-clamp-2">
                            {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.excerpt}
                        </p>
                    </article>
                </Link>
            </div>
        );
    }

    // Horizontal variant - for featured sections
    if (variant === "horizontal") {
        return (
            <div className="flex gap-4 py-4 border-b border-violet-500/10 last:border-0">
                <VoteButtons initialVotes={votes} preVoted={preVoted} />
                <Link href={`/article/${article.slug}`} className="group block flex-1">
                    <article className="flex flex-col sm:flex-row gap-4">
                        {article.imageUrl && (
                            <div className="relative sm:w-48 aspect-[16/10] overflow-hidden rounded-lg flex-shrink-0">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        )}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="font-normal text-xs border-violet-500/30">
                                    {article.category}
                                </Badge>
                                <span>{formatDate(article.publishedAt)}</span>
                            </div>
                            <h3 className="font-semibold text-lg leading-snug group-hover:text-violet-500 transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {article.excerpt}
                            </p>
                        </div>
                    </article>
                </Link>
            </div>
        );
    }

    // Default card variant - clean minimal card with votes
    return (
        <div className="h-full flex gap-3">
            <VoteButtons initialVotes={votes} size="sm" preVoted={preVoted} />
            <Link href={`/article/${article.slug}`} className="group block flex-1">
                <article className="h-full space-y-4 hover-lift">
                    {/* Image */}
                    {article.imageUrl && (
                        <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="font-normal text-xs border-violet-500/30 text-violet-500">
                                {article.category}
                            </Badge>
                            <span>{formatDate(article.publishedAt)}</span>
                        </div>

                        <h3 className="font-semibold text-lg leading-snug group-hover:text-violet-500 transition-colors line-clamp-2">
                            {article.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                            <span>{article.author}</span>
                            <span className="text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                                Read <ArrowRightIcon className="h-3 w-3" />
                            </span>
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    );
}
