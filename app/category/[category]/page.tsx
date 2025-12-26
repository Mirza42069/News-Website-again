"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeftIcon,
    CpuIcon,
    GlobeIcon,
    TrendingUpIcon,
    FlaskConicalIcon,
    TrophyIcon,
    HeartPulseIcon,
    ClapperboardIcon,
    NewspaperIcon,
    SparklesIcon,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
    technology: CpuIcon,
    world: GlobeIcon,
    business: TrendingUpIcon,
    science: FlaskConicalIcon,
    sports: TrophyIcon,
    health: HeartPulseIcon,
    entertainment: ClapperboardIcon,
};

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = (params.category as string).toLowerCase();
    const categoryName =
        categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

    const articles = useQuery(api.news.getByCategory, { category: categoryName });

    const Icon = categoryIcons[categorySlug] || NewspaperIcon;

    // Loading
    if (articles === undefined) {
        return (
            <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-5 w-24" />
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-lg" />
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

            {/* Category Header */}
            <header className="mb-12">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-violet-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{categoryName}</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            {articles.length} article{articles.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </header>

            {/* Articles Grid or Empty State */}
            {articles.length === 0 ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="mx-auto w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center">
                            <SparklesIcon className="h-8 w-8 text-violet-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">No Articles Yet</h2>
                            <p className="text-muted-foreground">
                                There are no articles in the {categoryName} category yet. Check back soon!
                            </p>
                        </div>
                        <Button asChild className="bg-violet-500 hover:bg-violet-600 text-white">
                            <Link href="/">Browse All Articles</Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <NewsCard key={article._id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
}
