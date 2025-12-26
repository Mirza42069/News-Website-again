"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NewsCard } from "@/components/news-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeftIcon,
    CalendarIcon,
    ClockIcon,
    ShareIcon,
    BookmarkIcon,
    UserIcon,
    SparklesIcon,
} from "lucide-react";

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;

    const article = useQuery(api.news.getBySlug, { slug });
    const allArticles = useQuery(api.news.list);

    // Loading
    if (article === undefined) {
        return (
            <div className="min-h-screen bg-background gradient-mesh noise">
                <Header />
                <main className="container max-w-screen-lg pt-32 pb-16 space-y-6">
                    <Skeleton className="h-8 w-24 glass-card" />
                    <Skeleton className="h-16 w-full glass-card" />
                    <Skeleton className="h-6 w-48 glass-card" />
                    <Skeleton className="aspect-[21/9] w-full rounded-3xl glass-card" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full glass-card" />
                        <Skeleton className="h-4 w-full glass-card" />
                        <Skeleton className="h-4 w-3/4 glass-card" />
                    </div>
                </main>
            </div>
        );
    }

    // Not Found
    if (article === null) {
        return (
            <div className="min-h-screen bg-background gradient-mesh noise">
                <Header />
                <main className="container max-w-screen-lg pt-32 pb-16 flex items-center justify-center min-h-[60vh]">
                    <div className="glass-card rounded-3xl p-12 max-w-lg text-center space-y-6 gradient-border">
                        <div className="relative mx-auto w-20 h-20">
                            <div className="w-20 h-20 rounded-2xl gradient-glow flex items-center justify-center glow">
                                <SparklesIcon className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-2xl font-bold">Article Not Found</h1>
                            <p className="text-muted-foreground">
                                The article you're looking for doesn't exist or has been removed.
                            </p>
                        </div>
                        <Button
                            asChild
                            className="gradient-glow text-white font-semibold border-0 shadow-lg"
                        >
                            <Link href="/">
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    const relatedArticles = allArticles
        ?.filter((a) => a.category === article.category && a._id !== article._id)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-background gradient-mesh noise">
            <Header />

            {/* Hero Gradient Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[400px] -left-[300px] w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px] pulse-glow" />
                <div className="absolute top-[20%] -right-[200px] w-[600px] h-[600px] rounded-full bg-accent/8 blur-[100px]" />
            </div>

            <main className="relative container max-w-screen-lg pt-32 pb-16">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="mb-8 glass-card hover:bg-white/10 border-white/5"
                >
                    <Link href="/">
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to News
                    </Link>
                </Button>

                <article className="space-y-8">
                    {/* Category & Meta */}
                    <div className="flex flex-wrap items-center gap-4">
                        <Badge
                            asChild
                            className="gradient-glow border-0 text-white font-medium px-4 py-1.5 shadow-lg hover:scale-105 transition-transform"
                        >
                            <Link href={`/category/${article.category.toLowerCase()}`}>
                                {article.category}
                            </Link>
                        </Badge>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        {article.readTime && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <ClockIcon className="h-4 w-4" />
                                <span>{article.readTime} min read</span>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        {article.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {article.excerpt}
                    </p>

                    {/* Author & Actions */}
                    <div className="flex items-center justify-between py-6 border-y border-white/10">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                                <AvatarImage src={article.authorImage} />
                                <AvatarFallback className="gradient-glow text-white font-bold">
                                    {article.author?.charAt(0) || <UserIcon className="h-5 w-5" />}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{article.author}</p>
                                <p className="text-sm text-muted-foreground">Author</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="glass-card hover:bg-white/10 border-white/5"
                            >
                                <ShareIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="glass-card hover:bg-white/10 border-white/5"
                            >
                                <BookmarkIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative aspect-[21/9] overflow-hidden rounded-3xl glass-card gradient-border">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        {article.content.split("\n\n").map((paragraph, i) => {
                            if (paragraph.startsWith("## ")) {
                                return (
                                    <h2
                                        key={i}
                                        className="text-2xl font-bold mt-12 mb-6 gradient-text"
                                    >
                                        {paragraph.replace("## ", "")}
                                    </h2>
                                );
                            }
                            if (paragraph.startsWith("- ")) {
                                const items = paragraph
                                    .split("\n")
                                    .filter((l: string) => l.startsWith("- "));
                                return (
                                    <ul
                                        key={i}
                                        className="list-none space-y-3 my-6 pl-4 border-l-2 border-primary/30"
                                    >
                                        {items.map((item: string, j: number) => (
                                            <li
                                                key={j}
                                                className="text-muted-foreground pl-4 hover:text-foreground transition-colors"
                                            >
                                                {item.replace("- ", "")}
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }
                            return (
                                <p
                                    key={i}
                                    className="text-muted-foreground leading-relaxed mb-6"
                                >
                                    {paragraph}
                                </p>
                            );
                        })}
                    </div>
                </article>

                {/* Related Articles */}
                {relatedArticles && relatedArticles.length > 0 && (
                    <section className="mt-20 pt-12 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-3 h-8 rounded-full gradient-glow" />
                            <h2 className="text-2xl font-bold">Related Articles</h2>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {relatedArticles.map((related) => (
                                <NewsCard key={related._id} article={related} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
