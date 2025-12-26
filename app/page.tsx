"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NewspaperIcon } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
    const allArticles = useQuery(api.news.list);
    const seed = useMutation(api.news.seed);

    // Loading
    if (allArticles === undefined) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-32 w-full" />
                <div className="grid gap-6 sm:grid-cols-2">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
            </div>
        );
    }

    // Empty
    if (allArticles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <NewspaperIcon className="h-10 w-10 text-muted-foreground mb-4" />
                <h1 className="text-xl font-semibold mb-2">Welcome to Newsroom</h1>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    Add sample articles to get started.
                </p>
                <Button onClick={() => seed().then(() => window.location.reload())}>
                    Seed Articles
                </Button>
            </div>
        );
    }

    const featured = allArticles.find((a) => a.featured) || allArticles[0];
    const articles = allArticles.filter((a) => a._id !== featured._id).slice(0, 6);
    const trending = allArticles.slice(0, 4);

    return (
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
            {/* Main */}
            <div className="space-y-10">
                {/* Featured */}
                <article>
                    <Badge variant="secondary" className="mb-3">Featured</Badge>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
                        <Link href={`/article/${featured.slug}`} className="hover:underline">
                            {featured.title}
                        </Link>
                    </h1>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                        {featured.excerpt}
                    </p>
                    <Link
                        href={`/article/${featured.slug}`}
                        className="text-sm font-medium hover:underline"
                    >
                        Read more →
                    </Link>
                </article>

                <hr />

                {/* Articles */}
                <div className="grid gap-8 sm:grid-cols-2">
                    {articles.map((article) => (
                        <article key={article._id}>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                    {article.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <h2 className="font-medium mb-1">
                                <Link
                                    href={`/article/${article.slug}`}
                                    className="hover:underline line-clamp-2"
                                >
                                    {article.title}
                                </Link>
                            </h2>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {article.excerpt}
                            </p>
                        </article>
                    ))}
                </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
                <div>
                    <h3 className="text-sm font-semibold mb-4">Trending</h3>
                    <div className="space-y-3">
                        {trending.map((article, i) => (
                            <Link
                                key={article._id}
                                href={`/article/${article.slug}`}
                                className="flex gap-3 group"
                            >
                                <span className="text-muted-foreground text-sm font-medium w-4">
                                    {i + 1}
                                </span>
                                <span className="text-sm group-hover:underline line-clamp-2">
                                    {article.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <hr />

                <div>
                    <h3 className="text-sm font-semibold mb-2">Newsletter</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                        Weekly digest, no spam.
                    </p>
                    <Button size="sm" className="w-full">Subscribe</Button>
                </div>
            </aside>
        </div>
    );
}