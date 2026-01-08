"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { SearchIcon, PlusIcon, HeartIcon, LayoutDashboardIcon, NewspaperIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const CATEGORIES = [
    { label: "World", href: "/category/world" },
    { label: "Tech", href: "/category/technology" },
    { label: "Business", href: "/category/business" },
    { label: "Science", href: "/category/science" },
];

export function SiteHeader() {
    const router = useRouter();
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    const closeSearch = () => {
        setSearchOpen(false);
        setSearchQuery("");
    };

    React.useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchOpen]);

    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeSearch();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-violet-500/10">
                <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            onClick={searchOpen ? closeSearch : undefined}
                            className="font-semibold text-lg tracking-tight hover:text-violet-500 transition-colors"
                        >
                            newsroom<span className="text-violet-500">.</span>
                        </Link>
                        <Link
                            href="/donate"
                            className="text-muted-foreground/40 hover:text-pink-500 transition-colors mt-0.5"
                            title="Support us"
                        >
                            <HeartIcon className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hidden sm:flex text-muted-foreground hover:text-violet-500 gap-1.5"
                        >
                            <Link href="/search">
                                <NewspaperIcon className="h-4 w-4" />
                                <span>All News</span>
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-violet-500"
                            onClick={() => setSearchOpen(true)}
                        >
                            <SearchIcon className="h-4 w-4" />
                        </Button>
                        <ThemeToggle />

                        <Button
                            asChild
                            size="icon-sm"
                            className="bg-violet-500 hover:bg-violet-600 text-white"
                        >
                            <Link href="/create">
                                <PlusIcon className="h-4 w-4" />
                            </Link>
                        </Button>

                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-violet-500/30 text-violet-500 hover:bg-violet-500/10"
                                >
                                    Sign In
                                </Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                asChild
                                className="text-muted-foreground hover:text-violet-500"
                            >
                                <Link href="/dashboard">
                                    <LayoutDashboardIcon className="h-4 w-4" />
                                </Link>
                            </Button>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-8 w-8"
                                    }
                                }}
                            />
                        </SignedIn>

                        <MobileNav categories={CATEGORIES} />
                    </div>
                </div>
            </header>

            {/* Search Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm animate-fade-in" onClick={closeSearch}>
                    <div className="mx-auto max-w-xl pt-32 px-6" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSearch}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full bg-transparent text-3xl font-light outline-none border-b-2 border-violet-500/30 pb-4 focus:border-violet-500 transition-colors placeholder:text-muted-foreground/50"
                            />
                        </form>
                        <p className="text-sm text-muted-foreground mt-4">
                            Press Enter to search · Esc to close
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export { SiteHeader as Header };
