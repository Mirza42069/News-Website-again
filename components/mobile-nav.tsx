"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

interface Category {
    label: string;
    href: string;
}

interface MobileNavProps {
    categories: Category[];
}

export function MobileNav({ categories }: MobileNavProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                    <MenuIcon className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
                <SheetHeader>
                    <SheetTitle>
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="font-semibold tracking-tight"
                        >
                            Newsroom
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                    {categories.map((category) => (
                        <Link
                            key={category.href}
                            href={category.href}
                            onClick={() => setOpen(false)}
                            className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                            {category.label}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
