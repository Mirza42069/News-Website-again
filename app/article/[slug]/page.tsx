"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { VoteButtons } from "@/components/vote-buttons";
import { AISummarizeButton } from "@/components/ai-summarize";
import { Comments } from "@/components/comments";
import { ReadingProgress } from "@/components/reading-progress";
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

// Get category-specific color (same as news-card)
function getCategoryColor(category: string): { text: string; border: string; bg: string } {
    const colors: Record<string, { text: string; border: string; bg: string }> = {
        Technology: { text: "text-violet-500", border: "border-violet-500/30", bg: "bg-violet-500/10" },
        Business: { text: "text-accent-amber", border: "border-amber-500/30", bg: "bg-amber-500/10" },
        Science: { text: "text-accent-cyan", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
        World: { text: "text-blue-400", border: "border-blue-400/30", bg: "bg-blue-400/10" },
        Sports: { text: "text-green-500", border: "border-green-500/30", bg: "bg-green-500/10" },
        Health: { text: "text-accent-pink", border: "border-pink-500/30", bg: "bg-pink-500/10" },
        Entertainment: { text: "text-rose-400", border: "border-rose-400/30", bg: "bg-rose-400/10" },
    };
    return colors[category] || { text: "text-violet-500", border: "border-violet-500/30", bg: "bg-violet-500/10" };
}

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
    const galleryImages = article.imageUrl ? [sanitizedHeroImage] : [];
    const categoryColor = getCategoryColor(article.category);

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <Button variant="ghost" size="sm" asChild className="mb-8 text-muted-foreground hover:text-violet-500">
                <Link href="/"><ArrowLeftIcon className="mr-2 h-4 w-4" />Back</Link>
            </Button>

            <div className="flex gap-6 justify-center">
                <div className="hidden md:block sticky top-24 self-start">
                    <VoteButtons initialVotes={baseVotes} />
                </div>

                <article className="flex-1 max-w-3xl space-y-8">
                    <header className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <Badge variant="secondary" asChild className={`font-normal ${categoryColor.bg} ${categoryColor.text} hover:opacity-80`}>
                                <Link href={`/category/${article.category.toLowerCase()}`}>{article.category}</Link>
                            </Badge>
                            <span className={`w-1 h-1 rounded-full ${categoryColor.bg}`} />
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                <span>{formatDate(article.publishedAt)}</span>
                            </div>
                            {article.readTime && (
                                <>
                                    <span className={`w-1 h-1 rounded-full ${categoryColor.bg}`} />
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
                                <Link 
                                    href={`/author/${article.author?.toLowerCase().replace(/\s+/g, "-") || "unknown"}`}
                                    className="font-medium text-sm hover:text-violet-500 transition-colors"
                                >
                                    {article.author}
                                </Link>
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
                            <span className="text-xs text-muted-foreground ml-auto">Powered by Gemini</span>
                        </div>
                    )}

                    <div className="prose-clean max-w-none">
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

                    {/* Comments Section */}
                    <Comments articleSlug={slug} />
                </article>
            </div>
        </div>
    );
}
