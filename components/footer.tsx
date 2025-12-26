import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Newsroom</p>
                <nav className="flex items-center gap-4">
                    <Link href="/about" className="hover:text-foreground transition-colors">
                        About
                    </Link>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                        Privacy
                    </Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                        Terms
                    </Link>
                </nav>
            </div>
        </footer>
    );
}

export { SiteFooter as Footer };
