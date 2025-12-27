"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { XIcon, ChevronLeftIcon, ChevronRightIcon, ZoomInIcon } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
    alt?: string;
}

export function ImageGallery({ images, alt = "Article image" }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    if (!images || images.length === 0) return null;

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsFullscreen(false);
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
    };

    React.useEffect(() => {
        if (isFullscreen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isFullscreen]);

    // Single image
    if (images.length === 1) {
        return (
            <>
                <div
                    className="relative aspect-[16/9] overflow-hidden rounded-lg cursor-zoom-in group"
                    onClick={() => setIsFullscreen(true)}
                >
                    <Image
                        src={images[0]}
                        alt={alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <ZoomInIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                </div>

                {/* Fullscreen Modal */}
                {isFullscreen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/10"
                            onClick={() => setIsFullscreen(false)}
                        >
                            <XIcon className="h-6 w-6" />
                        </Button>
                        <div className="relative max-h-[90vh] max-w-[90vw] w-full h-full">
                            <Image
                                src={images[0]}
                                alt={alt}
                                fill
                                sizes="90vw"
                                className="object-contain"
                                onClick={(e) => e.stopPropagation()}
                                priority
                            />
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Multiple images - Gallery
    return (
        <>
            <div className="space-y-3">
                {/* Main Image */}
                <div
                    className="relative aspect-[16/9] overflow-hidden rounded-lg cursor-zoom-in group"
                    onClick={() => setIsFullscreen(true)}
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`${alt} ${currentIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                        className="object-cover transition-all duration-300"
                        priority={currentIndex === 0}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                    {/* Navigation Arrows */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </Button>

                    {/* Image Counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden transition-all ${idx === currentIndex
                                ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-background"
                                : "opacity-60 hover:opacity-100"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
                    onClick={() => setIsFullscreen(false)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <XIcon className="h-6 w-6" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    >
                        <ChevronLeftIcon className="h-8 w-8" />
                    </Button>

                    <div className="relative max-h-[85vh] max-w-[85vw] w-full h-full">
                        <Image
                            src={images[currentIndex]}
                            alt={`${alt} ${currentIndex + 1}`}
                            fill
                            sizes="85vw"
                            className="object-contain"
                            onClick={(e) => e.stopPropagation()}
                            priority
                        />
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                        onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    >
                        <ChevronRightIcon className="h-8 w-8" />
                    </Button>

                    {/* Thumbnails in fullscreen */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                className={`relative w-12 h-8 rounded overflow-hidden transition-all ${idx === currentIndex
                                    ? "ring-2 ring-violet-500"
                                    : "opacity-50 hover:opacity-100"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

