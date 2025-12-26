"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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

const categoryColors: Record<string, string> = {
    technology: "from-blue-500 to-cyan-500",
    world: "from-green-500 to-emerald-500",
    business: "from-purple-500 to-pink-500",
    science: "from-indigo-500 to-violet-500",
    sports: "from-orange-500 to-yellow-500",
    health: "from-red-500 to-rose-500",
    entertainment: "from-fuchsia-500 to-pink-500",
};

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = (params.category as string).toLowerCase();
    const categoryName =
        categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

    const articles = useQuery(api.news.getByCategory, { category: categoryName });

    const Icon = categoryIcons[categorySlug] || NewspaperIcon;
    const gradientColor = categoryColors[categorySlug] || "from-primary to-accent";

    // Loading
    if (articles === undefined) {
        return (
            <div className="min-h-screen bg-background gradient-mesh noise">
                <Header />
                <main className="container max-w-screen-xl pt-32 pb-16 space-y-8">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-2xl glass-card" />
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-40 glass-card" />
                            <Skeleton className="h-5 w-24 glass-card" />
                        </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="aspect-[4/3] rounded-2xl glass-card" />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background gradient-mesh noise">
            <Header />

            {/* Hero Gradient Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[400px] -left-[300px] w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px] pulse-glow" />
                <div className="absolute top-[30%] -right-[200px] w-[600px] h-[600px] rounded-full bg-accent/8 blur-[100px]" />
            </div>

            <main className="relative container max-w-screen-xl pt-32 pb-16">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="mb-8 glass-card hover:bg-white/10 border-white/5"
                >
                    <Link href="/">
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>

                {/* Category Header */}
                <div className="flex items-center gap-6 mb-12">
                    <div
                        className={`relative h-20 w-20 rounded-2xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg`}
                    >
                        <Icon className="h-10 w-10 text-white" />
                        <div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientColor} opacity-50 blur-xl`}
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">{categoryName}</h1>
                        <p className="text-muted-foreground text-lg mt-1">
                            {articles.length} article{articles.length !== 1 ? "s" : ""} in this
                            category
                        </p>
                    </div>
                </div>

                {/* Articles Grid or Empty State */}
                {articles.length === 0 ? (
                    <div className="glass-card rounded-3xl p-12 max-w-lg mx-auto text-center space-y-6 gradient-border">
                        <div className="relative mx-auto w-20 h-20">
                            <div className="w-20 h-20 rounded-2xl gradient-glow flex items-center justify-center glow">
                                <SparklesIcon className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold">No Articles Yet</h2>
                            <p className="text-muted-foreground">
                                There are no articles in the {categoryName} category yet. Check
                                back soon!
                            </p>
                        </div>
                        <Button
                            asChild
                            className="gradient-glow text-white font-semibold border-0 shadow-lg"
                        >
                            <Link href="/">Browse All Articles</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article, idx) => (
                            <NewsCard key={article._id} article={article} index={idx} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
