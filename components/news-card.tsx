"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, ArrowUpRightIcon } from "lucide-react";
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

export function NewsCard({ article, variant = "default", index }: NewsCardProps) {
    // Minimal variant - just title and meta
    if (variant === "minimal") {
        return (
            <Link href={`/article/${article.slug}`} className="group block">
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                    <div className="space-y-1.5 flex-1">
                        <p className="font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{article.category}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                            <span>{formatDate(article.publishedAt)}</span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Horizontal variant
    if (variant === "horizontal") {
        return (
            <Link href={`/article/${article.slug}`} className="group block">
                <article className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl glass-card gradient-border hover-lift">
                    <div className="relative sm:w-48 h-32 sm:h-auto rounded-xl overflow-hidden flex-shrink-0">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Badge className="absolute top-2 left-2 gradient-glow border-0 text-white text-xs">
                            {article.category}
                        </Badge>
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-2">
                        <h3 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{formatDate(article.publishedAt)}</span>
                            </div>
                            {article.readTime && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                    <div className="flex items-center gap-1">
                                        <ClockIcon className="h-3 w-3" />
                                        <span>{article.readTime} min</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    // Default card variant
    return (
        <Link href={`/article/${article.slug}`} className="group block h-full">
            <article className="relative h-full rounded-2xl overflow-hidden glass-card gradient-border hover-lift card-shine">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    <Badge className="absolute top-4 left-4 gradient-glow border-0 text-white font-medium shadow-lg">
                        {article.category}
                    </Badge>

                    {/* Hover arrow */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowUpRightIcon className="h-5 w-5 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-xs font-bold">
                                {article.author?.charAt(0) || "A"}
                            </div>
                            <span className="text-sm text-muted-foreground">{article.author}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {formatDate(article.publishedAt)}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
