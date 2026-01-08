"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { MessageCircleIcon, SendIcon, UserIcon } from "lucide-react";

interface CommentsProps {
    articleSlug: string;
}

export function Comments({ articleSlug }: CommentsProps) {
    const comments = useQuery(api.comments.getByArticle, { articleSlug });
    const addComment = useMutation(api.comments.add);
    
    // Form state
    const [name, setName] = React.useState("");
    const [content, setContent] = React.useState("");
    const [replyTo, setReplyTo] = React.useState<{ id: string; authorName: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Group comments into hierarchy
    const thread = React.useMemo(() => {
        if (!comments) return [];
        const map = new Map();
        const roots: any[] = [];
        
        // Initialize map
        comments.forEach(c => map.set(c._id, { ...c, replies: [] }));
        
        // Build tree
        comments.forEach(c => {
            if (c.parentId && map.has(c.parentId)) {
                map.get(c.parentId).replies.push(map.get(c._id));
            } else {
                roots.push(map.get(c._id));
            }
        });
        
        // Sort by date (newest first for roots, oldest first for replies)
        roots.sort((a, b) => b.createdAt - a.createdAt);
        return roots;
    }, [comments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !content.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment({
                articleSlug,
                authorName: name.trim(),
                content: content.trim(),
                parentId: replyTo?.id as any,
            });
            setContent("");
            setReplyTo(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const CommentItem = ({ comment, depth = 0 }: { comment: any, depth?: number }) => (
        <div className={`space-y-4 ${depth > 0 ? "ml-8 border-l-2 border-border pl-4" : ""}`}>
            <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-violet-500">
                        {comment.authorName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(comment.createdAt)}
                            </span>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs text-muted-foreground hover:text-violet-500"
                            onClick={() => setReplyTo({ id: comment._id, authorName: comment.authorName })}
                        >
                            Reply
                        </Button>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                        {comment.content}
                    </p>
                </div>
            </div>
            
            {/* Recursive replies */}
            {comment.replies?.length > 0 && (
                <div className="space-y-4 pt-2">
                    {comment.replies.map((reply: any) => (
                        <CommentItem key={reply._id} comment={reply} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <section className="border-t border-border pt-8 mt-12">
            <div className="flex items-center gap-2 mb-6">
                <MessageCircleIcon className="h-5 w-5 text-violet-500" />
                <h2 className="text-xl font-bold">
                    Comments {comments && comments.length > 0 && `(${comments.length})`}
                </h2>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                {replyTo && (
                    <div className="flex items-center justify-between text-sm text-violet-500 mb-2 bg-violet-500/10 px-3 py-1.5 rounded-md">
                        <span>Replying to {replyTo.authorName}</span>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-0 hover:bg-transparent text-violet-500/70 hover:text-violet-500"
                            onClick={() => setReplyTo(null)}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-3">
                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                        <textarea
                            placeholder={replyTo ? `Reply to ${replyTo.authorName}...` : "Write a comment..."}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !name.trim() || !content.trim()}
                                className="bg-violet-500 hover:bg-violet-600 text-white gap-2"
                            >
                                <SendIcon className="h-4 w-4" />
                                {isSubmitting ? "Posting..." : replyTo ? "Post Reply" : "Post Comment"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-8">
                {comments === undefined ? (
                    <p className="text-muted-foreground text-sm">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    thread.map((rootComment) => (
                        <CommentItem key={rootComment._id} comment={rootComment} />
                    ))
                )}
            </div>
        </section>
    );
}
