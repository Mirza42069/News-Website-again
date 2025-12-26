"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

interface FeaturedNewsProps {
    articles: Doc<"articles">[];
}

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export function FeaturedNews({ articles }: FeaturedNewsProps) {
    if (!articles || articles.length === 0) return null;

    const [hero, ...rest] = articles;
    const secondary = rest.slice(0, 2);

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-8 rounded-full gradient-glow" />
                    <h2 className="text-3xl font-bold">Featured Stories</h2>
                </div>
                <Link
                    href="/category/featured"
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    View all
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
                {/* Hero Card - Spans 2 columns and 2 rows */}
                <Link
                    href={`/article/${hero.slug}`}
                    className="group lg:col-span-2 lg:row-span-2"
                >
                    <article className="relative h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden glass-card gradient-border hover-lift card-shine">
                        <img
                            src={hero.imageUrl}
                            alt={hero.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative h-full flex flex-col justify-end p-8">
                            <Badge className="w-fit mb-4 gradient-glow border-0 text-white font-medium px-4 py-1.5 shadow-lg">
                                {hero.category}
                            </Badge>
                            <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                                {hero.title}
                            </h3>
                            <p className="text-white/80 line-clamp-2 text-lg mb-4 max-w-2xl">
                                {hero.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-white/60 text-sm">
                                <span className="font-medium">{hero.author}</span>
                                <span className="w-1 h-1 rounded-full bg-white/40" />
                                <div className="flex items-center gap-1.5">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>{formatDate(hero.publishedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                </Link>

                {/* Secondary Cards */}
                {secondary.map((article, idx) => (
                    <Link key={article._id} href={`/article/${article.slug}`} className="group">
                        <article className="relative h-full min-h-[240px] rounded-2xl overflow-hidden glass-card gradient-border hover-lift card-shine">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            <div className="relative h-full flex flex-col justify-end p-6">
                                <Badge
                                    variant="secondary"
                                    className="w-fit mb-3 bg-white/10 backdrop-blur-sm border-white/20 text-white"
                                >
                                    {article.category}
                                </Badge>
                                <h4 className="text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                    {article.title}
                                </h4>
                                <p className="text-white/60 text-sm mt-2 flex items-center gap-2">
                                    <span>{article.author}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/40" />
                                    <span>{formatDate(article.publishedAt)}</span>
                                </p>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    );
}
