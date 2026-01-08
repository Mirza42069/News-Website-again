"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { VoteButtons } from "@/components/vote-buttons";
import { AISummarizeButton } from "@/components/ai-summarize";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ArrowLeftIcon,
    CalendarIcon,
    ClockIcon,
    BookmarkIcon,
    UserIcon,
    SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";
import { sanitizeImageUrl } from "@/lib/image-utils";

// Dynamic imports for heavy components - reduces initial bundle
const ShareModal = dynamic(() => import("@/components/share-modal").then(mod => ({ default: mod.ShareModal })), {
    loading: () => <div className="w-8 h-8" />,
    ssr: false,
});

const ImageGallery = dynamic(() => import("@/components/image-gallery").then(mod => ({ default: mod.ImageGallery })), {
    loading: () => <div className="aspect-[16/9] bg-muted/50 rounded-lg animate-pulse" />,
});

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

const mockGalleryImages = [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800",
];

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const [aiSummary, setAiSummary] = React.useState<string | null>(null);
    const [bookmarked, setBookmarked] = React.useState(false);

    const article = useQuery(api.news.getBySlug, { slug });

    // Loading
    if (article === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-muted-foreground">Loading...</div>
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
                        <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
                    </div>
                    <Button asChild className="bg-violet-500 hover:bg-violet-600 text-white">
                        <Link href="/"><ArrowLeftIcon className="mr-2 h-4 w-4" />Back to Home</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const baseVotes = article._id.charCodeAt(0) % 100 + 50;
    const displayContent = aiSummary || article.content;
    const sanitizedHeroImage = sanitizeImageUrl(article.imageUrl);
    const galleryImages = article.imageUrl ? [sanitizedHeroImage, ...mockGalleryImages.map(sanitizeImageUrl)] : mockGalleryImages.map(sanitizeImageUrl);

    return (
        <div className="animate-fade-in">
            <Button variant="ghost" size="sm" asChild className="mb-8 text-muted-foreground hover:text-violet-500">
                <Link href="/"><ArrowLeftIcon className="mr-2 h-4 w-4" />Back</Link>
            </Button>

            <div className="flex gap-6">
                <div className="hidden md:block sticky top-24 self-start">
                    <VoteButtons initialVotes={baseVotes} />
                </div>

                <article className="flex-1 max-w-3xl space-y-8">
                    <header className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <Badge variant="secondary" asChild className="font-normal bg-violet-500/10 text-violet-500 hover:bg-violet-500/20">
                                <Link href={`/category/${article.category.toLowerCase()}`}>{article.category}</Link>
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

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">{article.title}</h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">{article.excerpt}</p>

                        <div className="flex items-center gap-3">
                            <AISummarizeButton content={article.content} title={article.title} onSummaryChange={setAiSummary} isActive={aiSummary !== null} />
                            <span className="text-xs text-muted-foreground">{aiSummary ? "Viewing AI summary" : "Get a quick AI-powered summary"}</span>
                        </div>
                    </header>

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
                            <div className="md:hidden mr-2">
                                <VoteButtons initialVotes={baseVotes} orientation="horizontal" size="sm" />
                            </div>
                            <ShareModal title={article.title} />
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className={bookmarked ? "text-violet-500" : "text-muted-foreground hover:text-violet-500"}
                                onClick={() => setBookmarked(!bookmarked)}
                            >
                                <BookmarkIcon className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
                            </Button>
                        </div>
                    </div>

                    {!aiSummary && <ImageGallery images={galleryImages} alt={article.title} />}

                    {aiSummary && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                            <SparklesIcon className="h-4 w-4 text-violet-500" />
                            <span className="text-sm text-violet-500 font-medium">AI-Generated Summary</span>
                            <span className="text-xs text-muted-foreground ml-auto">Mockup Demo</span>
                        </div>
                    )}

                    <div className="prose-serif max-w-none">
                        {displayContent.split("\n\n").map((paragraph, i) => {
                            if (paragraph.startsWith("## ")) {
                                return <h2 key={i}>{paragraph.replace("## ", "")}</h2>;
                            }
                            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                                return <h3 key={i}>{paragraph.replace(/\*\*/g, "")}</h3>;
                            }
                            if (paragraph.startsWith("- ")) {
                                const items = paragraph.split("\n").filter((l: string) => l.startsWith("- "));
                                return (
                                    <ul key={i}>
                                        {items.map((item: string, j: number) => <li key={j}>{item.replace("- ", "")}</li>)}
                                    </ul>
                                );
                            }
                            if (paragraph.startsWith("---")) return <hr key={i} className="my-10 border-violet-500/20" />;
                            if (paragraph.startsWith("*") && paragraph.endsWith("*")) {
                                return <p key={i} className="text-sm italic opacity-70 mb-4">{paragraph.replace(/\*/g, "")}</p>;
                            }
                            return <p key={i}>{paragraph}</p>;
                        })}
                    </div>
                </article>
            </div>
        </div>
    );
}
