"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { NewsCard } from "@/components/news-card";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;

    const article = useQuery(api.news.getBySlug, { slug });
    const allArticles = useQuery(api.news.list);

    if (article === undefined) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="flex items-center justify-center h-[60vh]">
                    <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                </main>
            </div>
        );
    }

    if (article === null) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-3xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
                    <Link href="/" className="text-muted-foreground hover:underline">
                        ← Back to Home
                    </Link>
                </main>
            </div>
        );
    }

    const relatedArticles = allArticles
        ?.filter((a) => a.category === article.category && a._id !== article._id)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back
                </Link>

                {/* Category & Date */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <Link href={`/category/${article.category.toLowerCase()}`} className="uppercase tracking-wider hover:underline">
                        {article.category}
                    </Link>
                    <span>•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                    {article.readTime && (
                        <>
                            <span>•</span>
                            <span>{article.readTime} min read</span>
                        </>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                    {article.title}
                </h1>

                {/* Author */}
                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
                    {article.authorImage && (
                        <img
                            src={article.authorImage}
                            alt={article.author}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    )}
                    <span className="font-medium">{article.author}</span>
                </div>

                {/* Hero Image */}
                <div className="aspect-[16/9] overflow-hidden bg-muted mb-8">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <article className="prose prose-lg max-w-none">
                    {article.content.split('\n\n').map((paragraph, i) => {
                        if (paragraph.startsWith('## ')) {
                            return (
                                <h2 key={i} className="text-xl font-bold mt-8 mb-4">
                                    {paragraph.replace('## ', '')}
                                </h2>
                            );
                        }
                        if (paragraph.startsWith('- ')) {
                            const items = paragraph.split('\n').filter((l: string) => l.startsWith('- '));
                            return (
                                <ul key={i} className="list-disc list-inside space-y-1 my-4 text-muted-foreground">
                                    {items.map((item: string, j: number) => (
                                        <li key={j}>{item.replace('- ', '')}</li>
                                    ))}
                                </ul>
                            );
                        }
                        return (
                            <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                                {paragraph}
                            </p>
                        );
                    })}
                </article>

                {/* Related Articles */}
                {relatedArticles && relatedArticles.length > 0 && (
                    <section className="mt-16 pt-8 border-t border-border">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
                            Related Articles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((related) => (
                                <NewsCard key={related._id} article={related} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
