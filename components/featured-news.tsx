"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Featured Stories</h2>
                <Link
                    href="/category/featured"
                    className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                    View all
                    <ArrowRightIcon className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
                {/* Hero Card - Spans 2 columns and 2 rows */}
                <Link
                    href={`/article/${hero.slug}`}
                    className="group lg:col-span-2 lg:row-span-2"
                >
                    <Card className="h-full overflow-hidden">
                        <div className="relative h-full min-h-[300px] lg:min-h-[400px]">
                            <img
                                src={hero.imageUrl}
                                alt={hero.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-6">
                                <Badge className="w-fit mb-2 bg-accent text-accent-foreground">
                                    {hero.category}
                                </Badge>
                                <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight mb-2 group-hover:text-accent transition-colors">
                                    {hero.title}
                                </h3>
                                <p className="text-white/90 line-clamp-2 text-sm lg:text-base mb-3">
                                    {hero.excerpt}
                                </p>
                                <div className="flex items-center gap-3 text-white/80 text-xs">
                                    <span>{hero.author}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/60" />
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        <span>{formatDate(hero.publishedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Link>

                {/* Secondary Cards */}
                {secondary.map((article) => (
                    <Link key={article._id} href={`/article/${article.slug}`} className="group">
                        <Card className="h-full overflow-hidden">
                            <div className="relative h-full min-h-[180px]">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30" />
                                <div className="absolute inset-0 flex flex-col justify-end p-4">
                                    <Badge variant="secondary" className="w-fit mb-2">
                                        {article.category}
                                    </Badge>
                                    <h4 className="text-base font-semibold text-white leading-snug group-hover:text-accent transition-colors line-clamp-2">
                                        {article.title}
                                    </h4>
                                    <p className="text-white/80 text-xs mt-1 flex items-center gap-2">
                                        <span>{article.author}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/60" />
                                        <span>{formatDate(article.publishedAt)}</span>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
