"use client";

import * as React from "react";

export function ReadingProgress() {
    const [progress, setProgress] = React.useState(0);
    const [barStyle, setBarStyle] = React.useState({ top: 0, height: 0 });

    React.useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const viewportHeight = window.innerHeight;
            
            // Find article content area and comments section
            const articleHeader = document.querySelector('article header');
            const articleContent = document.querySelector('.prose-clean');
            const commentsSection = document.querySelector('section.border-t');
            
            if (!articleHeader) return;
            
            // Get positions
            const headerTop = articleHeader.getBoundingClientRect().top + scrollTop;
            const commentsTop = commentsSection 
                ? commentsSection.getBoundingClientRect().top + scrollTop 
                : document.documentElement.scrollHeight;
            
            // Calculate the reading zone height
            const readingZoneHeight = commentsTop - headerTop;
            
            // Set the bar position and height
            setBarStyle({
                top: headerTop,
                height: readingZoneHeight,
            });
            
            // Calculate progress - 100% when bottom of article content is visible
            // Get the bottom of the article content (last paragraph before comments)
            const contentBottom = articleContent 
                ? articleContent.getBoundingClientRect().bottom + scrollTop
                : commentsTop;
            
            // When the content bottom enters the viewport, we should be at 100%
            const readStart = headerTop;
            const readEnd = contentBottom - viewportHeight;
            
            const readProgress = ((scrollTop - readStart) / (readEnd - readStart)) * 100;
            
            setProgress(Math.min(100, Math.max(0, readProgress)));
        };

        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress, { passive: true });
        
        // Initial calculation after a small delay to ensure DOM is ready
        setTimeout(updateProgress, 100);
        updateProgress();

        return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }, []);

    // Only render if we have valid dimensions
    if (barStyle.height === 0) return null;

    return (
        <>
            {/* Desktop: Long vertical progress bar alongside article */}
            <div 
                className="absolute left-0 w-1 hidden lg:block"
                style={{ 
                    top: `${barStyle.top}px`,
                    height: `${barStyle.height}px`,
                }}
            >
                {/* Background track */}
                <div className="absolute inset-0 bg-violet-500/10 rounded-full" />
                
                {/* Progress fill - grows from top */}
                <div
                    className="absolute top-0 left-0 right-0 bg-violet-500 rounded-full transition-all duration-100 ease-out"
                    style={{ height: `${progress}%` }}
                />
                
                {/* Percentage indicator - follows progress */}
                <div 
                    className="absolute left-3 text-xs text-violet-500 font-bold tabular-nums whitespace-nowrap"
                    style={{ 
                        top: `${Math.min(progress, 95)}%`,
                        transform: 'translateY(-50%)',
                    }}
                >
                    {Math.round(progress)}%
                </div>
            </div>

            {/* Mobile: thin bar at top */}
            <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-violet-500/10 lg:hidden">
                <div
                    className="h-full bg-violet-500 transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </>
    );
}
