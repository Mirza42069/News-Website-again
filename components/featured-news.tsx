"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

interface FeaturedNewsProps {
    articles: Doc<"articles">[];
}

export function FeaturedNews({ articles }: FeaturedNewsProps) {
    if (!articles || articles.length === 0) return null;

    const [hero, ...secondary] = articles;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Featured Stories</h2>
                <Button variant="ghost" className="text-muted-foreground" asChild>
                    <Link href="/category">
                        View all <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Main Hero Card */}
                <Link href={`/article/${hero.slug}`} className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
                    <div className="aspect-[16/9] w-full overflow-hidden">
                        <img
                            src={hero.imageUrl}
                            alt={hero.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="default">{hero.category}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {new Date(hero.publishedAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold leading-none tracking-tight group-hover:text-primary transition-colors">
                            {hero.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2">
                            {hero.excerpt}
                        </p>
                    </div>
                </Link>

                {/* Secondary Stack */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                    {secondary.slice(0, 3).map((article) => (
                        <Link key={article._id} href={`/article/${article.slug}`} className="group flex flex-row items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors text-card-foreground shadow-sm bg-card">
                            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0">{article.category}</Badge>
                                <h4 className="font-semibold leading-none tracking-tight group-hover:underline line-clamp-2">
                                    {article.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                    {article.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
