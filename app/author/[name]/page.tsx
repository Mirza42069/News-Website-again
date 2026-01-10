"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, UserIcon, NewspaperIcon } from "lucide-react";
import { sanitizeImageUrl } from "@/lib/image-utils";

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function AuthorPage() {
    const params = useParams();
    const authorName = decodeURIComponent(params.name as string);
    
    const articles = useQuery(api.news.getByAuthor, { author: authorName });

    if (articles === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <Button variant="ghost" size="sm" asChild className="mb-8 text-muted-foreground hover:text-violet-500">
                    <Link href="/"><ArrowLeftIcon className="mr-2 h-4 w-4" />Back</Link>
                </Button>
                <div className="text-center py-20">
                    <UserIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Author Not Found</h1>
                    <p className="text-muted-foreground">No articles found for this author.</p>
                </div>
            </div>
        );
    }

    const authorImage = articles[0]?.authorImage;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <Button variant="ghost" size="sm" asChild className="mb-8 text-muted-foreground hover:text-violet-500">
                <Link href="/"><ArrowLeftIcon className="mr-2 h-4 w-4" />Back</Link>
            </Button>

            {/* Author Header */}
            <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden">
                    {authorImage ? (
                        <Image
                            src={sanitizeImageUrl(authorImage)}
                            alt={authorName}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <UserIcon className="h-12 w-12 text-violet-500" />
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{authorName}</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <NewspaperIcon className="h-4 w-4" />
                        {articles.length} article{articles.length !== 1 ? "s" : ""} published
                    </p>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Articles by {authorName}</h2>
                <div className="grid gap-6">
                    {articles.map((article) => (
                        <Link
                            key={article._id}
                            href={`/article/${article.slug}`}
                            className="group flex gap-4 p-4 rounded-lg border border-border/50 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all"
                        >
                            <div className="relative w-32 h-24 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                    src={sanitizeImageUrl(article.imageUrl)}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                    <span className="text-violet-500 font-medium">{article.category}</span>
                                    <span>·</span>
                                    <span>{formatDate(article.publishedAt)}</span>
                                </div>
                                <h3 className="font-semibold group-hover:text-violet-500 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {article.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
