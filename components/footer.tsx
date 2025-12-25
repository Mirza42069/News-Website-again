import Link from "next/link";

export function Footer() {
    const categories = [
        "Technology",
        "World",
        "Business",
        "Science",
        "Sports",
        "Health",
        "Entertainment",
    ];

    return (
        <footer className="bg-secondary/50 border-t border-border mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-xl">D</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-xl tracking-tight">The Daily Pulse</h2>
                                <p className="text-xs text-muted-foreground">Breaking News & Stories</p>
                            </div>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-md">
                            Your trusted source for breaking news, in-depth analysis, and the stories that matter most.
                            Delivering quality journalism since 2024.
                        </p>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {categories.slice(0, 5).map((cat) => (
                                <li key={cat}>
                                    <Link
                                        href={`/category/${cat.toLowerCase()}`}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* More */}
                    <div>
                        <h3 className="font-semibold mb-4">More</h3>
                        <ul className="space-y-2">
                            {categories.slice(5).map((cat) => (
                                <li key={cat}>
                                    <Link
                                        href={`/category/${cat.toLowerCase()}`}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2024 The Daily Pulse. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
