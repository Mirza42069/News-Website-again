"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const categories = [
    { name: "All", slug: "" },
    { name: "Technology", slug: "technology" },
    { name: "World", slug: "world" },
    { name: "Business", slug: "business" },
    { name: "Science", slug: "science" },
    { name: "Sports", slug: "sports" },
    { name: "Health", slug: "health" },
    { name: "Entertainment", slug: "entertainment" },
];

interface CategoryNavProps {
    activeCategory?: string;
}

export function CategoryNav({ activeCategory }: CategoryNavProps) {
    const pathname = usePathname();

    return (
        <nav className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 min-w-max">
                {categories.map((category) => {
                    const isActive = activeCategory
                        ? activeCategory.toLowerCase() === category.slug
                        : pathname === "/" && category.slug === "";

                    return (
                        <Link
                            key={category.slug}
                            href={category.slug ? `/category/${category.slug}` : "/"}
                        >
                            <Button
                                variant={isActive ? "default" : "ghost"}
                                size="sm"
                                className={`h-8 ${isActive ? "bg-accent text-accent-foreground" : "hover:text-accent"}`}
                            >
                                {category.name}
                            </Button>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
