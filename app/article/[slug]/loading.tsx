export default function ArticleLoading() {
    return (
        <div className="animate-fade-in">
            {/* Back button skeleton */}
            <div className="h-8 w-16 bg-muted/50 rounded mb-8" />

            <div className="flex gap-6">
                {/* Vote buttons skeleton */}
                <div className="hidden md:flex flex-col gap-2">
                    <div className="w-10 h-10 bg-muted/50 rounded" />
                    <div className="w-10 h-6 bg-muted/50 rounded" />
                    <div className="w-10 h-10 bg-muted/50 rounded" />
                </div>

                <article className="flex-1 max-w-3xl space-y-6">
                    {/* Header skeleton */}
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="h-6 w-20 bg-violet-500/20 rounded" />
                            <div className="h-6 w-32 bg-muted/50 rounded" />
                        </div>
                        <div className="h-12 w-full bg-muted/50 rounded" />
                        <div className="h-12 w-3/4 bg-muted/50 rounded" />
                        <div className="h-6 w-2/3 bg-muted/30 rounded" />
                    </div>

                    {/* Author bar skeleton */}
                    <div className="flex items-center justify-between py-6 border-y border-violet-500/10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-muted/50 rounded-full" />
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-muted/50 rounded" />
                                <div className="h-3 w-16 bg-muted/30 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Image skeleton */}
                    <div className="aspect-[16/9] bg-muted/50 rounded-lg" />

                    {/* Content skeleton */}
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-muted/30 rounded" />
                        <div className="h-4 w-full bg-muted/30 rounded" />
                        <div className="h-4 w-3/4 bg-muted/30 rounded" />
                        <div className="h-4 w-full bg-muted/30 rounded" />
                        <div className="h-4 w-5/6 bg-muted/30 rounded" />
                    </div>
                </article>
            </div>
        </div>
    );
}
