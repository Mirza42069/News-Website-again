"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { SearchIcon, PlusIcon, HeartIcon, LayoutDashboardIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const CATEGORIES = [
    { label: "World", href: "/category/world" },
    { label: "Tech", href: "/category/technology" },
    { label: "Business", href: "/category/business" },
    { label: "Science", href: "/category/science" },
];

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-violet-500/10">
            <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="font-semibold text-lg tracking-tight hover:text-violet-500 transition-colors"
                    >
                        newsroom<span className="text-violet-500">.</span>
                    </Link>
                    <Link
                        href="/donate"
                        className="text-muted-foreground/40 hover:text-pink-500 transition-colors"
                        title="Support us"
                    >
                        <HeartIcon className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {CATEGORIES.map((c) => (
                        <Link
                            key={c.href}
                            href={c.href}
                            className="text-sm text-muted-foreground hover:text-violet-500 transition-colors"
                        >
                            {c.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hidden sm:flex text-muted-foreground hover:text-violet-500"
                    >
                        <SearchIcon className="h-4 w-4" />
                    </Button>
                    <ThemeToggle />

                    {/* Create Button */}
                    <Button
                        asChild
                        size="sm"
                        className="bg-violet-500 hover:bg-violet-600 text-white gap-1.5"
                    >
                        <Link href="/create">
                            <PlusIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Create</span>
                        </Link>
                    </Button>

                    {/* Auth */}
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
    );
}

export { SiteHeader as Header };
