"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    GlobeIcon,
    CpuIcon,
    TrendingUpIcon,
    FlaskConicalIcon,
    TrophyIcon,
    HeartPulseIcon,
    ClapperboardIcon,
    LayoutGridIcon
} from "lucide-react";

const categories = [
    { name: "All", slug: "", icon: LayoutGridIcon },
    { name: "Technology", slug: "technology", icon: CpuIcon },
    { name: "World", slug: "world", icon: GlobeIcon },
    { name: "Business", slug: "business", icon: TrendingUpIcon },
    { name: "Science", slug: "science", icon: FlaskConicalIcon },
    { name: "Sports", slug: "sports", icon: TrophyIcon },
    { name: "Health", slug: "health", icon: HeartPulseIcon },
    { name: "Entertainment", slug: "entertainment", icon: ClapperboardIcon },
];

interface CategoryNavProps {
    activeCategory?: string;
}

export function CategoryNav({ activeCategory }: CategoryNavProps) {
    const pathname = usePathname();

    return (
        <nav className="w-full overflow-x-auto scrollbar-hide py-3 -mx-4 px-4">
            <div className="flex items-center gap-2 min-w-max">
                {categories.map((category) => {
                    const isActive = activeCategory
                        ? activeCategory.toLowerCase() === category.slug
                        : pathname === "/" && category.slug === "";
                    const Icon = category.icon;

                    return (
                        <Link
                            key={category.slug}
                            href={category.slug ? `/category/${category.slug}` : "/"}
                        >
                            <Button
                                variant={isActive ? "default" : "ghost"}
                                size="sm"
                                className={`flex items-center gap-2 rounded-full px-4 transition-all ${isActive
                                        ? "shadow-lg shadow-primary/25"
                                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">{category.name}</span>
                            </Button>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
