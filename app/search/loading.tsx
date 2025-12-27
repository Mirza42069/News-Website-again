export default function SearchLoading() {
    return (
        <div className="animate-fade-in">
            {/* Back button skeleton */}
            <div className="h-8 w-16 bg-muted/50 rounded mb-8" />

            {/* Search header skeleton */}
            <div className="mb-8 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted/50 rounded" />
                    <div className="h-4 w-24 bg-muted/50 rounded" />
                </div>
                <div className="h-8 w-48 bg-muted/50 rounded" />
                <div className="h-4 w-32 bg-muted/30 rounded" />
            </div>

            {/* Results skeleton */}
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-lg border border-muted/30">
                        <div className="w-24 h-16 bg-muted/50 rounded flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-16 bg-muted/30 rounded" />
                                <div className="h-4 w-20 bg-muted/30 rounded" />
                            </div>
                            <div className="h-5 w-full bg-muted/50 rounded" />
                            <div className="h-4 w-3/4 bg-muted/30 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
