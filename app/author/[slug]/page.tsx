"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ArrowLeftIcon,
    MailIcon,
    TwitterIcon,
    LinkedinIcon,
    GlobeIcon,
    CalendarIcon,
    BookOpenIcon,
    EyeIcon,
    HeartIcon,
} from "lucide-react";
import { sanitizeImageUrl } from "@/lib/image-utils";

// Mock author data - in production this would come from a database
const MOCK_AUTHORS: Record<string, {
    name: string;
    bio: string;
    avatar: string;
    role: string;
    joinedDate: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
}> = {
    "sarah-johnson": {
        name: "Sarah Johnson",
        bio: "Tech journalist with 10+ years of experience covering AI, startups, and digital innovation. Previously at TechCrunch and Wired. Based in San Francisco.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        role: "Senior Tech Editor",
        joinedDate: "March 2021",
        twitter: "sarahjtech",
        linkedin: "sarahjohnson",
        website: "sarahjohnson.com",
    },
    "michael-chen": {
        name: "Michael Chen",
        bio: "Business and finance reporter focusing on markets, economics, and corporate strategy. MBA from Stanford, former analyst at Goldman Sachs.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        role: "Business Correspondent",
        joinedDate: "January 2022",
        twitter: "mchenfinance",
        linkedin: "michaelchen",
    },
    "emily-davis": {
        name: "Emily Davis",
        bio: "Science writer passionate about space exploration, climate science, and emerging technologies. PhD in Astrophysics from MIT.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
        role: "Science Editor",
        joinedDate: "June 2020",
        twitter: "emilydavisscience",
        website: "emilydavis.science",
    },
};

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function AuthorPage() {
    const params = useParams();
    const slug = params.slug as string;
    const allArticles = useQuery(api.news.list);

    // Get author data - first try to match from mock data, then from articles
    const authorSlug = slug.toLowerCase().replace(/\s+/g, "-");
    const mockAuthor = MOCK_AUTHORS[authorSlug];

    // Find articles by this author (match by slug pattern or actual author name)
    const authorArticles = React.useMemo(() => {
        if (!allArticles) return [];
        
        // Try to find by author name matching the slug
        const authorName = slug.split("-").map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ");

        return allArticles.filter(article => 
            article.author?.toLowerCase().includes(authorName.toLowerCase()) ||
            article.author?.toLowerCase().replace(/\s+/g, "-") === authorSlug
        );
    }, [allArticles, slug, authorSlug]);

    // Generate mock stats
    const stats = {
        articles: authorArticles.length || Math.floor(Math.random() * 50) + 10,
        views: Math.floor(Math.random() * 100000) + 10000,
        likes: Math.floor(Math.random() * 5000) + 500,
    };

    // Create author info from mock data or generate from slug
    const author = mockAuthor || {
        name: slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        bio: "Experienced journalist covering breaking news and in-depth features. Passionate about bringing important stories to light.",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${slug}`,
        role: "Staff Writer",
        joinedDate: "2023",
    };

    if (allArticles === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <Button variant="ghost" size="sm" asChild className="mb-8 text-muted-foreground hover:text-violet-500">
                <Link href="/"><ArrowLeftIcon className="mr-2 h-4 w-4" />Back</Link>
            </Button>

            {/* Author Profile Card */}
            <Card className="mb-10 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-violet-500/20 via-pink-500/20 to-amber-500/20" />
                <CardContent className="pt-0 -mt-16">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                            <AvatarImage src={author.avatar} alt={author.name} />
                            <AvatarFallback className="text-2xl bg-violet-500/10 text-violet-500">
                                {author.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 pt-4 sm:pt-8">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold">{author.name}</h1>
                                <Badge variant="outline" className="w-fit border-violet-500/30 text-violet-500">
                                    {author.role}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{author.bio}</p>

                            {/* Social Links */}
                            <div className="flex flex-wrap gap-2">
                                {mockAuthor?.twitter && (
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <TwitterIcon className="h-4 w-4" />
                                        @{mockAuthor.twitter}
                                    </Button>
                                )}
                                {mockAuthor?.linkedin && (
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <LinkedinIcon className="h-4 w-4" />
                                        LinkedIn
                                    </Button>
                                )}
                                {mockAuthor?.website && (
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <GlobeIcon className="h-4 w-4" />
                                        Website
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" className="gap-2">
                                    <MailIcon className="h-4 w-4" />
                                    Contact
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-violet-500">
                                <BookOpenIcon className="h-5 w-5" />
                                {stats.articles}
                            </div>
                            <div className="text-sm text-muted-foreground">Articles</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-cyan-400">
                                <EyeIcon className="h-5 w-5" />
                                {(stats.views / 1000).toFixed(1)}K
                            </div>
                            <div className="text-sm text-muted-foreground">Views</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-pink-400">
                                <HeartIcon className="h-5 w-5" />
                                {(stats.likes / 1000).toFixed(1)}K
                            </div>
                            <div className="text-sm text-muted-foreground">Likes</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Articles by Author */}
            <div>
                <h2 className="text-xl font-bold mb-6">
                    Articles by {author.name}
                    <span className="text-muted-foreground font-normal text-base ml-2">
                        ({authorArticles.length || "No"} articles found)
                    </span>
                </h2>

                {authorArticles.length > 0 ? (
                    <div className="space-y-6">
                        {authorArticles.map((article) => (
                            <Link
                                key={article._id}
                                href={`/article/${article.slug}`}
                                className="group flex gap-4 p-4 rounded-lg border border-transparent hover:border-violet-500/20 hover:bg-violet-500/5 transition-colors"
                            >
                                <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={sanitizeImageUrl(article.imageUrl)}
                                        alt={article.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Badge variant="outline" className="mb-2 text-xs">
                                        {article.category}
                                    </Badge>
                                    <h3 className="font-semibold group-hover:text-violet-500 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                        <CalendarIcon className="h-3 w-3" />
                                        {formatDate(article.publishedAt)}
                                        <span>·</span>
                                        <span>{article.readTime} min read</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground mb-4">
                            No articles found for this author yet.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            📝 This is a <span className="text-violet-500 font-medium">mockup page</span> with sample data for demonstration.
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
