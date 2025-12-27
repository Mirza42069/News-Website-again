"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { LinkIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
    title: string;
    url?: string;
}

export function ShareModal({ title, url }: ShareModalProps) {
    const [copied, setCopied] = React.useState(false);
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast("Copied!", {
            duration: 1500,
            style: {
                background: "#0a0a0a",
                color: "white",
                border: "1px solid #222",
                padding: "8px 16px",
                fontSize: "14px",
                minWidth: "auto",
                width: "fit-content",
            },
        });
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            className={copied ? "text-green-500" : "text-muted-foreground hover:text-violet-500"}
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy Link"}
        >
            {copied ? <CheckIcon className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        </Button>
    );
}

