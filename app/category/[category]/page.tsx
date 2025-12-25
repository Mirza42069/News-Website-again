"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { NewsCard } from "@/components/news-card";
import { ArrowLeftIcon } from "lucide-react";

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = (params.category as string).toLowerCase();
    const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

    const articles = useQuery(api.news.getByCategory, { category: categoryName });

    if (articles === undefined) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="flex items-center justify-center h-[60vh]">
                    <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back
                </Link>

                {/* Category Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">{categoryName}</h1>
                    <p className="text-muted-foreground mt-1">
                        {articles.length} article{articles.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Articles Grid */}
                {articles.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No articles in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <NewsCard key={article._id} article={article} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
