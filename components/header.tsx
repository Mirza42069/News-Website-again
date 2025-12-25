"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SearchIcon, MenuIcon, BellIcon } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">AKHTARBERAK</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
                            Home
                        </Link>
                        <Link href="/category/technology" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Technology
                        </Link>
                        <Link href="/category/world" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            World
                        </Link>
                        <Link href="/category/business" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Business
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <div className="relative">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search news..."
                                className="h-9 w-full rounded-md border border-input bg-transparent pl-8 outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:w-[200px] lg:w-[300px]"
                            />
                        </div>
                    </div>
                    <nav className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <BellIcon className="h-4 w-4" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            Subscribe
                        </Button>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <MenuIcon className="h-5 w-5" />
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
