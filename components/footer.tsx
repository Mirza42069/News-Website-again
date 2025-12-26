import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
    return (
        <footer className="border-t border-border/50 mt-auto">
            <div className="mx-auto flex flex-col sm:flex-row h-auto sm:h-14 w-full max-w-5xl items-center justify-between gap-4 px-6 py-4 sm:py-0 text-sm text-muted-foreground">
                <p className="text-center sm:text-left">
                    © {new Date().getFullYear()} newsroom<span className="text-accent">.</span> All rights reserved.
                </p>
                <nav className="flex items-center gap-4">
                    <Link
                        href="/about"
                        className="hover:text-foreground transition-colors"
                    >
                        About
                    </Link>
                    <Separator orientation="vertical" className="h-3" />
                    <Link
                        href="/privacy"
                        className="hover:text-foreground transition-colors"
                    >
                        Privacy
                    </Link>
                    <Separator orientation="vertical" className="h-3" />
                    <Link
                        href="/terms"
                        className="hover:text-foreground transition-colors"
                    >
                        Terms
                    </Link>
                </nav>
            </div>
        </footer>
    );
}

export { SiteFooter as Footer };
