export default function CategoryLoading() {
    return (
        <div className="animate-fade-in">
            {/* Back button skeleton */}
            <div className="h-8 w-16 bg-muted/50 rounded mb-8" />

            {/* Category header skeleton */}
            <div className="mb-8 space-y-3">
                <div className="h-8 w-32 bg-violet-500/20 rounded" />
                <div className="h-5 w-48 bg-muted/30 rounded" />
            </div>

            {/* Articles grid skeleton */}
            <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="aspect-[16/10] bg-muted/50 rounded-lg" />
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-16 bg-muted/30 rounded" />
                            <div className="h-4 w-20 bg-muted/30 rounded" />
                        </div>
                        <div className="h-6 w-full bg-muted/50 rounded" />
                        <div className="h-4 w-3/4 bg-muted/30 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
