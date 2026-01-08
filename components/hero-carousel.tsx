"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { sanitizeImageUrl } from "@/lib/image-utils";
import type { Doc } from "@/convex/_generated/dataModel";

interface HeroCarouselProps {
    articles: Doc<"articles">[];
}

export function HeroCarousel({ articles }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

    const heroArticles = articles.slice(0, 4); // Show up to 4 featured articles

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? heroArticles.length - 1 : prev - 1));
    };

    const goToNext = React.useCallback(() => {
        setCurrentIndex((prev) => (prev === heroArticles.length - 1 ? 0 : prev + 1));
    }, [heroArticles.length]);

    // Auto-play every 5 seconds
    React.useEffect(() => {
        if (!isAutoPlaying || heroArticles.length <= 1) return;

        const interval = setInterval(goToNext, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, goToNext, heroArticles.length]);

    if (heroArticles.length === 0) return null;

    const currentArticle = heroArticles[currentIndex];

    return (
        <section 
            className="relative w-full aspect-[16/7] rounded-xl overflow-hidden group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Background Images */}
            {heroArticles.map((article, idx) => (
                <div
                    key={article._id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        idx === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <Image
                        src={sanitizeImageUrl(article.imageUrl)}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                    />
                </div>
            ))}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content */}
            <Link
                href={`/article/${currentArticle.slug}`}
                className="absolute bottom-0 left-0 right-0 p-8 text-white"
            >
                <h1 className="text-2xl md:text-4xl font-bold mb-3 max-w-2xl leading-tight transition-all duration-500">
                    {currentArticle.title}
                </h1>
                <p className="text-white/80 text-sm md:text-base max-w-xl line-clamp-3">
                    {currentArticle.excerpt}
                </p>
            </Link>

            {/* Navigation Arrows */}
            {heroArticles.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.preventDefault(); goToPrevious(); }}
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.preventDefault(); goToNext(); }}
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </Button>
                </>
            )}

            {/* Dots Indicator */}
            {heroArticles.length > 1 && (
                <div className="absolute bottom-4 right-8 flex gap-2">
                    {heroArticles.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                            className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentIndex 
                                    ? "bg-white w-6" 
                                    : "bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
