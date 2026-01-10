"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <SunIcon className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9" 
            onClick={toggleTheme}
            title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
            <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
