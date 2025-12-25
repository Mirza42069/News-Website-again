"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/header";
import { NewsCard } from "@/components/news-card";
import { FeaturedNews } from "@/components/featured-news";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUpIcon } from "lucide-react";

export default function HomePage() {
    const allArticles = useQuery(api.news.list);
    const seed = useMutation(api.news.seed);

    // Loading Skeleton
    if (allArticles === undefined) {
        return (
            <div className="min-h-screen bg-background font-sans antialiased">
                <Header />
                <main className="container py-8 space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-1/4" />
                        <div className="grid gap-6 md:grid-cols-2">
                            <Skeleton className="h-[400px] rounded-xl" />
                            <div className="space-y-4">
                                <Skeleton className="h-32 rounded-lg" />
                                <Skeleton className="h-32 rounded-lg" />
                                <Skeleton className="h-32 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Seeding State
    if (allArticles.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8 text-center">
                    <h1 className="text-2xl font-bold">Welcome to AKHTARBERAK</h1>
                    <p className="text-muted-foreground">Database is empty. Seed sample articles to view the design.</p>
                    <Button onClick={() => seed().then(() => window.location.reload())}>
                        Seed Database
                    </Button>
                </div>
            </div>
        )
    }

    const featured = allArticles.filter(a => a.featured);
    const latest = allArticles.filter(a => !a.featured);
    const trending = allArticles.slice(0, 5);

    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <Header />

            <main className="container py-10 space-y-16">

                {/* Featured Section */}
                <FeaturedNews articles={allArticles} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Content - Latest News */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
                            <Separator className="flex-1 ml-6" />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            {latest.map((article) => (
                                <NewsCard key={article._id} article={article} />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Trending */}
                    <aside className="lg:col-span-4 space-y-6">
                        <Card>
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUpIcon className="w-5 h-5 text-primary" />
                                    Trending Now
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 grid gap-0">
                                {trending.map((article, i) => (
                                    <div key={article._id} className="flex items-start gap-4 py-3 border-b last:border-0 last:pb-0">
                                        <span className="text-2xl font-bold text-muted-foreground/40 w-4">{i + 1}</span>
                                        <div className="space-y-1">
                                            <h4 className="font-medium text-sm leading-tight hover:text-primary cursor-pointer line-clamp-2">
                                                {article.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{article.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </aside>

                </div>
            </main>
        </div>
    );
}