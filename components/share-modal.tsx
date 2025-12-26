"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    ShareIcon,
    CopyIcon,
    CheckIcon,
    XIcon,
} from "lucide-react";

interface ShareModalProps {
    title: string;
    url?: string;
}

export function ShareModal({ title, url }: ShareModalProps) {
    const [copied, setCopied] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Simple inline share using native share API or copy
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled or error - fall back to copy
                setOpen(true);
            }
        } else {
            setOpen(true);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-violet-500"
                onClick={handleShare}
            >
                <ShareIcon className="h-4 w-4" />
            </Button>

            {/* Simple Copy Popup */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" onClick={() => setOpen(false)}>
                    <div
                        className="bg-card border border-border rounded-lg p-4 mx-4 w-full max-w-sm shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium">Share</h3>
                            <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)}>
                                <XIcon className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 px-3 py-2 text-sm bg-muted rounded-md border-0 outline-none"
                            />
                            <Button
                                size="sm"
                                onClick={handleCopy}
                                className={copied ? "bg-green-500 hover:bg-green-500" : "bg-violet-500 hover:bg-violet-600"}
                            >
                                {copied ? (
                                    <>
                                        <CheckIcon className="h-4 w-4 mr-1" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <CopyIcon className="h-4 w-4 mr-1" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
