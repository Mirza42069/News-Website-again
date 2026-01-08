"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon, Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";

interface AISummarizeButtonProps {
    content: string;
    title: string;
    onSummaryChange: (summary: string | null) => void;
    isActive: boolean;
}

export function AISummarizeButton({ content, title, onSummaryChange, isActive }: AISummarizeButtonProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSummarize = async () => {
        if (isActive) {
            // Turn off summary mode
            onSummaryChange(null);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/ai/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, title }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate summary");
            }

            onSummaryChange(data.summary);
            toast.success("AI summary generated!");
        } catch (error) {
            console.error("Summarize error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to generate summary");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={handleSummarize}
            disabled={isLoading}
            className={isActive
                ? "gap-1.5 bg-violet-500 hover:bg-violet-600 text-white"
                : "gap-1.5 border-violet-500/30 text-violet-500 hover:bg-violet-500/10 hover:text-violet-500"
            }
        >
            {isLoading ? (
                <>
                    <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                    Summarizing...
                </>
            ) : isActive ? (
                <>
                    <XIcon className="h-3.5 w-3.5" />
                    Show Full Article
                </>
            ) : (
                <>
                    <SparklesIcon className="h-3.5 w-3.5" />
                    AI Summary
                </>
            )}
        </Button>
    );
}
