import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Track that a user read an article
export const trackRead = mutation({
    args: {
        userId: v.string(),
        articleSlug: v.string(),
        category: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if already tracked
        const existing = await ctx.db
            .query("readHistory")
            .withIndex("by_user_article", (q) => 
                q.eq("userId", args.userId).eq("articleSlug", args.articleSlug)
            )
            .first();
        
        if (existing) {
            // Update the read time
            await ctx.db.patch(existing._id, { readAt: Date.now() });
            return existing._id;
        }
        
        // Create new read record
        return await ctx.db.insert("readHistory", {
            userId: args.userId,
            articleSlug: args.articleSlug,
            category: args.category,
            readAt: Date.now(),
        });
    },
});

// Get user's reading history
export const getHistory = query({
    args: { userId: v.string(), limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 20;
        return await ctx.db
            .query("readHistory")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(limit);
    },
});

// Get user's preferred categories based on reading history
export const getPreferredCategories = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const history = await ctx.db
            .query("readHistory")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
        
        // Count category occurrences
        const categoryCounts: Record<string, number> = {};
        for (const read of history) {
            categoryCounts[read.category] = (categoryCounts[read.category] || 0) + 1;
        }
        
        // Sort by count and return top categories
        return Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([category]) => category);
    },
});
