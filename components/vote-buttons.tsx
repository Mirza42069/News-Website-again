"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

interface VoteButtonsProps {
    initialVotes?: number;
    orientation?: "vertical" | "horizontal";
    size?: "sm" | "default";
    preVoted?: "up" | "down";
}

export function VoteButtons({
    initialVotes = 0,
    orientation = "vertical",
    size = "default",
    preVoted
}: VoteButtonsProps) {
    const [votes, setVotes] = React.useState(initialVotes);
    const [userVote, setUserVote] = React.useState<"up" | "down" | null>(preVoted || null);

    const handleUpvote = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (userVote === "up") {
            setVotes(votes - 1);
            setUserVote(null);
        } else {
            setVotes(userVote === "down" ? votes + 2 : votes + 1);
            setUserVote("up");
        }
    };

    const handleDownvote = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (userVote === "down") {
            setVotes(votes + 1);
            setUserVote(null);
        } else {
            setVotes(userVote === "up" ? votes - 2 : votes - 1);
            setUserVote("down");
        }
    };

    const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
    const buttonSize = size === "sm" ? "icon-xs" : "icon-sm";

    if (orientation === "horizontal") {
        return (
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size={buttonSize}
                    onClick={handleUpvote}
                    className={userVote === "up" ? "text-violet-500 bg-violet-500/10" : "text-muted-foreground hover:text-violet-500"}
                >
                    <ChevronUpIcon className={iconSize} />
                </Button>
                <span className={`text-sm font-medium min-w-[3ch] text-center ${votes > 0 && userVote === "up" ? "text-violet-500" :
                        votes < 0 || userVote === "down" ? "text-red-500" :
                            "text-muted-foreground"
                    }`}>
                    {votes}
                </span>
                <Button
                    variant="ghost"
                    size={buttonSize}
                    onClick={handleDownvote}
                    className={userVote === "down" ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-red-500"}
                >
                    <ChevronDownIcon className={iconSize} />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-0.5">
            <Button
                variant="ghost"
                size={buttonSize}
                onClick={handleUpvote}
                className={userVote === "up" ? "text-violet-500 bg-violet-500/10" : "text-muted-foreground hover:text-violet-500"}
            >
                <ChevronUpIcon className={iconSize} />
            </Button>
            <span className={`text-sm font-medium ${votes > 0 && userVote === "up" ? "text-violet-500" :
                    votes < 0 || userVote === "down" ? "text-red-500" :
                        "text-muted-foreground"
                }`}>
                {votes}
            </span>
            <Button
                variant="ghost"
                size={buttonSize}
                onClick={handleDownvote}
                className={userVote === "down" ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-red-500"}
            >
                <ChevronDownIcon className={iconSize} />
            </Button>
        </div>
    );
}
