import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get comments for an article
export const getByArticle = query({
    args: { articleSlug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("comments")
            .withIndex("by_article", (q) => q.eq("articleSlug", args.articleSlug))
            .order("desc")
            .collect();
    },
});

// Add a new comment
export const add = mutation({
    args: {
        articleSlug: v.string(),
        authorName: v.string(),
        authorEmail: v.optional(v.string()),
        content: v.string(),
        parentId: v.optional(v.id("comments")),
    },
    handler: async (ctx, args) => {
        const commentId = await ctx.db.insert("comments", {
            articleSlug: args.articleSlug,
            authorName: args.authorName,
            authorEmail: args.authorEmail,
            content: args.content,
            parentId: args.parentId,
            createdAt: Date.now(),
        });
        return commentId;
    },
});

// Delete a comment (for moderation)
export const remove = mutation({
    args: { commentId: v.id("comments") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.commentId);
    },
});
