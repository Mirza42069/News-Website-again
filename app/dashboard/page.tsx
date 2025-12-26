"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeftIcon,
    FileTextIcon,
    EyeIcon,
    ChevronUpIcon,
    MessageSquareIcon,
    BookmarkIcon,
    SettingsIcon,
    TrendingUpIcon,
    CalendarIcon,
    PlusIcon,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";

// Mock data for dashboard
const mockArticles = [
    { id: 1, title: "The Future of AI in Journalism", views: 1234, votes: 89, comments: 12, status: "published", date: "Dec 24, 2024" },
    { id: 2, title: "Understanding Web3 Technologies", views: 856, votes: 45, comments: 8, status: "published", date: "Dec 22, 2024" },
    { id: 3, title: "Climate Change Report 2024", views: 2341, votes: 156, comments: 34, status: "published", date: "Dec 20, 2024" },
    { id: 4, title: "Draft: Space Exploration Update", views: 0, votes: 0, comments: 0, status: "draft", date: "Dec 26, 2024" },
];

const mockStats = {
    totalViews: 4431,
    totalVotes: 290,
    totalArticles: 4,
    totalComments: 54,
};

const mockBookmarks = [
    { id: 1, title: "How to Build a Successful Startup", author: "Jane Smith" },
    { id: 2, title: "The Science of Productivity", author: "Mike Johnson" },
    { id: 3, title: "Global Economic Trends 2025", author: "Sarah Wilson" },
];

export default function DashboardPage() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="space-y-8 animate-fade-in">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

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

            <SignedOut>
                <Card className="border-violet-500/20">
                    <CardContent className="pt-12 pb-12">
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center">
                                <SettingsIcon className="h-8 w-8 text-violet-500" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold">Sign in to view Dashboard</h1>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    Access your articles, stats, and bookmarks by signing in.
                                </p>
                            </div>
                            <SignInButton mode="modal">
                                <Button className="bg-violet-500 hover:bg-violet-600 text-white">
                                    Sign In
                                </Button>
                            </SignInButton>
                        </div>
                    </CardContent>
                </Card>
            </SignedOut>

            <SignedIn>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback className="bg-violet-500/10 text-violet-500 text-xl">
                                {user?.firstName?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Welcome, {user?.firstName || "User"}!
                            </h1>
                            <p className="text-muted-foreground">
                                {user?.emailAddresses?.[0]?.emailAddress}
                            </p>
                        </div>
                    </div>
                    <Button asChild className="bg-violet-500 hover:bg-violet-600 text-white">
                        <Link href="/create">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            New Article
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="border-violet-500/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Views</p>
                                    <p className="text-2xl font-bold">{mockStats.totalViews.toLocaleString()}</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                    <EyeIcon className="h-5 w-5 text-violet-500" />
                                </div>
                            </div>
                            <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                                <TrendingUpIcon className="h-3 w-3" /> +12% this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-violet-500/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Votes</p>
                                    <p className="text-2xl font-bold">{mockStats.totalVotes}</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <ChevronUpIcon className="h-5 w-5 text-green-500" />
                                </div>
                            </div>
                            <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                                <TrendingUpIcon className="h-3 w-3" /> +8% this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-violet-500/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Articles</p>
                                    <p className="text-2xl font-bold">{mockStats.totalArticles}</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <FileTextIcon className="h-5 w-5 text-blue-500" />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                1 draft pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-violet-500/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Comments</p>
                                    <p className="text-2xl font-bold">{mockStats.totalComments}</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                    <MessageSquareIcon className="h-5 w-5 text-orange-500" />
                                </div>
                            </div>
                            <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                                <TrendingUpIcon className="h-3 w-3" /> 3 new today
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                    {/* Articles List */}
                    <Card className="border-violet-500/10">
                        <CardHeader>
                            <CardTitle className="text-lg">Your Articles</CardTitle>
                            <CardDescription>Manage and track your published content</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockArticles.map((article) => (
                                <div
                                    key={article.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-violet-500/30 transition-colors"
                                >
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium truncate">{article.title}</h3>
                                            <Badge
                                                variant={article.status === "published" ? "secondary" : "outline"}
                                                className={article.status === "draft" ? "border-yellow-500/30 text-yellow-600" : ""}
                                            >
                                                {article.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" />
                                                {article.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <EyeIcon className="h-3 w-3" />
                                                {article.views.toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ChevronUpIcon className="h-3 w-3" />
                                                {article.votes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquareIcon className="h-3 w-3" />
                                                {article.comments}
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-violet-500">
                                        Edit
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Bookmarks */}
                        <Card className="border-violet-500/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <BookmarkIcon className="h-4 w-4 text-violet-500" />
                                    Saved Articles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {mockBookmarks.map((bookmark) => (
                                    <div
                                        key={bookmark.id}
                                        className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <p className="font-medium text-sm line-clamp-2">{bookmark.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1">by {bookmark.author}</p>
                                    </div>
                                ))}
                                <Button variant="ghost" size="sm" className="w-full text-violet-500">
                                    View all bookmarks
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-violet-500/10 bg-violet-500/5">
                            <CardContent className="pt-6 space-y-3">
                                <h3 className="font-medium text-sm">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" size="sm" className="justify-start" asChild>
                                        <Link href="/create">
                                            <PlusIcon className="h-3 w-3 mr-2" />
                                            New Article
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" className="justify-start">
                                        <SettingsIcon className="h-3 w-3 mr-2" />
                                        Settings
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Demo Notice */}
                <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border/50 text-center">
                    <p className="text-sm text-muted-foreground">
                        📊 This is a <span className="text-violet-500 font-medium">mockup dashboard</span> with sample data for demonstration purposes.
                    </p>
                </div>
            </SignedIn>
        </div>
    );
}
