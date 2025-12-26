"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { SearchIcon } from "lucide-react";

const CATEGORIES = [
    { label: "World", href: "/category/world" },
    { label: "Tech", href: "/category/technology" },
    { label: "Business", href: "/category/business" },
    { label: "Science", href: "/category/science" },
];

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4">
                {/* Mobile nav - left */}
                <MobileNav categories={CATEGORIES} />

                {/* Logo */}
                <Link href="/" className="mr-6 font-semibold tracking-tight">
                    Newsroom
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm">
                    {CATEGORIES.map((c) => (
                        <Link
                            key={c.href}
                            href={c.href}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {c.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <SearchIcon className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                    </Button>
                    <ThemeToggle />
                    <Separator orientation="vertical" className="mx-1 h-5 hidden sm:block" />
                    <Button size="sm" className="hidden sm:inline-flex h-8 text-xs">
                        Subscribe
                    </Button>
                </div>
            </div>
        </header>
    );
}

export { SiteHeader as Header };
