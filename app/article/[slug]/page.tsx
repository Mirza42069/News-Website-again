"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { VoteButtons } from "@/components/vote-buttons";
import { AISummarizeButton } from "@/components/ai-summarize";
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
    const [aiSummary, setAiSummary] = React.useState<string | null>(null);

    const article = useQuery(api.news.getBySlug, { slug });
    const allArticles = useQuery(api.news.list);

    // Loading
    if (article === undefined) {
        return (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-6 w-2/3" />
                <div className="space-y-4 pt-8">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        );
    }

    // Not Found
    if (article === null) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
                <div className="text-center space-y-6 max-w-md">
                    <div className="mx-auto w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center">
                        <SparklesIcon className="h-8 w-8 text-violet-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold">Article Not Found</h1>
                        <p className="text-muted-foreground">
                            The article you're looking for doesn't exist or has been removed.
                        </p>
                    </div>
                    <Button asChild className="bg-violet-500 hover:bg-violet-600 text-white">
                        <Link href="/">
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Generate pseudo-random vote count
    const baseVotes = article._id.charCodeAt(0) % 100 + 50;

    // Content to display (either original or AI summary)
    const displayContent = aiSummary || article.content;

    return (
        <div className="animate-fade-in">
            {/* Back Button */}
            <Button
                variant="ghost"
                size="sm"
                asChild
                className="mb-8 text-muted-foreground hover:text-violet-500"
            >
                <Link href="/">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back
                </Link>
            </Button>

            <div className="flex gap-6">
                {/* Vote Sidebar */}
                <div className="hidden md:block sticky top-24 self-start">
                    <VoteButtons initialVotes={baseVotes} />
                </div>

                <article className="flex-1 max-w-3xl space-y-8">
                    {/* Header */}
                    <header className="space-y-6">
                        {/* Category & Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <Badge variant="secondary" asChild className="font-normal bg-violet-500/10 text-violet-500 hover:bg-violet-500/20">
                                <Link href={`/category/${article.category.toLowerCase()}`}>
                                    {article.category}
                                </Link>
                            </Badge>
                            <span className="w-1 h-1 rounded-full bg-violet-500/30" />
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                <span>{formatDate(article.publishedAt)}</span>
                            </div>
                            {article.readTime && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-violet-500/30" />
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <ClockIcon className="h-3.5 w-3.5" />
                                        <span>{article.readTime} min read</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-balance">
                            {article.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {article.excerpt}
                        </p>

                        {/* AI Summarize Button */}
                        <div className="flex items-center gap-3">
                            <AISummarizeButton
                                content={article.content}
                                title={article.title}
                                onSummaryChange={setAiSummary}
                                isActive={aiSummary !== null}
                            />
                            <span className="text-xs text-muted-foreground">
                                {aiSummary ? "Viewing AI summary" : "Get a quick AI-powered summary"}
                            </span>
                        </div>
                    </header>

                    {/* Author & Actions */}
                    <div className="flex items-center justify-between py-6 border-y border-violet-500/10">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={article.authorImage} />
                                <AvatarFallback className="bg-violet-500/10 text-violet-500">
                                    {article.author?.charAt(0) || <UserIcon className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm">{article.author}</p>
                                <p className="text-xs text-muted-foreground">Author</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Mobile votes */}
                            <div className="md:hidden mr-2">
                                <VoteButtons initialVotes={baseVotes} orientation="horizontal" size="sm" />
                            </div>
                            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-violet-500">
                                <ShareIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-violet-500">
                                <BookmarkIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Featured Image - hide when showing summary */}
                    {article.imageUrl && !aiSummary && (
                        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}

                    {/* AI Summary Badge */}
                    {aiSummary && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                            <SparklesIcon className="h-4 w-4 text-violet-500" />
                            <span className="text-sm text-violet-500 font-medium">AI-Generated Summary</span>
                            <span className="text-xs text-muted-foreground ml-auto">Mockup Demo</span>
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        {displayContent.split("\n\n").map((paragraph, i) => {
                            if (paragraph.startsWith("## ")) {
                                return (
                                    <h2
                                        key={i}
                                        className="text-xl font-bold mt-10 mb-4 text-foreground"
                                    >
                                        {paragraph.replace("## ", "")}
                                    </h2>
                                );
                            }
                            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                                return (
                                    <h3
                                        key={i}
                                        className="text-lg font-semibold mt-6 mb-3 text-foreground"
                                    >
                                        {paragraph.replace(/\*\*/g, "")}
                                    </h3>
                                );
                            }
                            if (paragraph.startsWith("- ")) {
                                const items = paragraph
                                    .split("\n")
                                    .filter((l: string) => l.startsWith("- "));
                                return (
                                    <ul
                                        key={i}
                                        className="space-y-2 my-6 pl-4 border-l-2 border-violet-500"
                                    >
                                        {items.map((item: string, j: number) => (
                                            <li
                                                key={j}
                                                className="text-muted-foreground pl-3"
                                            >
                                                {item.replace("- ", "")}
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }
                            if (paragraph.startsWith("---")) {
                                return <hr key={i} className="my-6 border-violet-500/20" />;
                            }
                            if (paragraph.startsWith("*") && paragraph.endsWith("*")) {
                                return (
                                    <p key={i} className="text-sm text-muted-foreground italic mb-4">
                                        {paragraph.replace(/\*/g, "")}
                                    </p>
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
            </div>
        </div>
    );
}
