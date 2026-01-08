"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteButtons } from "@/components/vote-buttons";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sanitizeImageUrl } from "@/lib/image-utils";

// Generate vote count - some articles get negative votes
function getVoteCount(articleId: string, index?: number): { votes: number; preVoted?: "down" } {
    const charCode = articleId.charCodeAt(0);
    if (charCode % 4 === 0 || (index !== undefined && index % 3 === 2)) {
        return { votes: -12, preVoted: "down" };
    }
    if (charCode % 5 === 0) {
        return { votes: -5, preVoted: "down" };
    }
    return { votes: charCode % 50 + 10 };
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

    const featured = allArticles.find((a) => a.featured) || allArticles[0];
    const articles = allArticles.filter((a) => a._id !== featured._id).slice(0, 6);
    const latestArticles = allArticles.slice(0, 5);
    const featuredVoteData = getVoteCount(featured._id);

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero / Featured Article */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Featured Story
                    </span>
                </div>

                <div className="flex gap-6">
                    <div className="hidden sm:block">
                        <VoteButtons initialVotes={featuredVoteData.votes} preVoted={featuredVoteData.preVoted} />
                    </div>

                    <article className="group flex-1">
                        <Link href={`/article/${featured.slug}`} className="block space-y-4">
                            {/* Featured Image */}
                            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-xl">
                                <Image
                                    src={sanitizeImageUrl(featured.imageUrl)}
                                    alt={featured.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight group-hover:text-violet-500 transition-colors text-balance">
                                {featured.title}
                            </h1>
                            <div className="flex items-center gap-4 pt-2">
                                <div className="sm:hidden">
                                    <VoteButtons initialVotes={featuredVoteData.votes} orientation="horizontal" size="sm" preVoted={featuredVoteData.preVoted} />
                                </div>
                                <Badge variant="secondary" className="font-normal">{featured.category}</Badge>
                                <span className="text-sm text-muted-foreground">
                                    {new Date(featured.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </span>
                                <span className="text-sm text-violet-500 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Read article <ArrowRightIcon className="h-3 w-3" />
                                </span>
                            </div>
                        </Link>
                    </article>
                </div>
            </section>

            <div className="h-px bg-violet-500/20" />

            {/* Main Content Grid */}
            <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Latest Stories</h2>
                        <Link href="/category/world" className="text-sm text-muted-foreground hover:text-violet-500 transition-colors inline-flex items-center gap-1">
                            View all <ArrowRightIcon className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2">
                        {articles.map((article, index) => {
                            const voteData = getVoteCount(article._id, index);
                            return (
                                <div key={article._id} className="flex gap-3">
                                    <VoteButtons initialVotes={voteData.votes} size="sm" preVoted={voteData.preVoted} />
                                    <article className="group flex-1 space-y-3">
                                        <Link href={`/article/${article.slug}`} className="block">
                                            {/* Article Image */}
                                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-3">
                                                <Image
                                                    src={sanitizeImageUrl(article.imageUrl)}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                                <Badge variant="outline" className="font-normal text-xs border-violet-500/30">{article.category}</Badge>
                                                <span>{new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                            </div>
                                            <h3 className="font-semibold text-lg leading-snug group-hover:text-violet-500 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                        </Link>
                                    </article>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <aside>
                    <Card className="border-0 bg-violet-500/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Trending Now</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {latestArticles.map((article, i) => (
                                <Link key={article._id} href={`/article/${article.slug}`} className="flex gap-3 group">
                                    <span className="text-2xl font-bold text-violet-500/40 w-6 shrink-0">{i + 1}</span>
                                    <span className="text-sm leading-snug group-hover:text-violet-500 transition-colors line-clamp-2">{article.title}</span>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}