"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClockIcon, UserIcon } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

interface NewsCardProps {
    article: Doc<"articles">;
    variant?: "default" | "compact";
}

function formatTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
    if (variant === "compact") {
        return (
            <Link href={`/article/${article.slug}`} className="block group">
                <div className="flex items-start gap-4 py-4 border-b last:border-0 group-hover:bg-muted/50 transition-colors rounded-lg px-2 -mx-2">
                    {article.imageUrl && (
                        <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden bg-muted">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    )}
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                                {article.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(article.publishedAt)}
                            </span>
                        </div>
                        <h4 className="font-medium leading-tight group-hover:underline decoration-primary decoration-1 underline-offset-4 line-clamp-2">
                            {article.title}
                        </h4>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/article/${article.slug}`} className="block h-full">
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border/60">
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <Badge className="absolute top-2 left-2 shadow-sm" variant="secondary">
                        {article.category}
                    </Badge>
                </div>
                <CardHeader className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {formatTimeAgo(article.publishedAt)}
                        </div>
                        {article.readTime && <span>{article.readTime} min read</span>}
                    </div>
                    <CardTitle className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                    </p>
                </CardContent>
                <CardFooter className="p-4 mt-auto border-t bg-muted/5 pt-3 text-xs text-muted-foreground flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                        <AvatarImage src={article.authorImage} />
                        <AvatarFallback><UserIcon className="w-3 h-3" /></AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{article.author}</span>
                </CardFooter>
            </Card>
        </Link>
    );
}
