"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { LanguagesIcon, Loader2Icon, UndoIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TranslateButtonProps {
    content: string;
    onTranslate: (translatedContent: string | null) => void;
    isTranslated: boolean;
}

export function TranslateButton({ content, onTranslate, isTranslated }: TranslateButtonProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentLang, setCurrentLang] = React.useState<"original" | "id" | "en">("original");

    const handleTranslate = async (targetLang: "id" | "en") => {
        if (isLoading) return;
        
        setIsLoading(true);
        try {
            const response = await fetch("/api/ai/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: content, targetLanguage: targetLang }),
            });

            if (!response.ok) {
                throw new Error("Translation failed");
            }

            const data = await response.json();
            onTranslate(data.translatedText);
            setCurrentLang(targetLang);
            toast.success(`Translated to ${targetLang === "id" ? "Indonesian" : "English"}`);
        } catch (error) {
            toast.error("Translation failed. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        onTranslate(null);
        setCurrentLang("original");
        toast.success("Showing original content");
    };

    if (isTranslated) {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2 border-amber-500/50 text-amber-500 bg-amber-500/10"
            >
                <UndoIcon className="h-4 w-4" />
                Show Original
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="gap-2 border-amber-500/50 text-amber-500 bg-amber-500/10"
                >
                    {isLoading ? (
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                        <LanguagesIcon className="h-4 w-4" />
                    )}
                    Translate
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleTranslate("id")}>
                    🇮🇩 Indonesian (Bahasa)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTranslate("en")}>
                    🇺🇸 English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
