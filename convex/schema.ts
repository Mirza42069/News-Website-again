import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    articles: defineTable({
        title: v.string(),
        slug: v.string(),
        excerpt: v.string(),
        content: v.string(),
        category: v.string(),
        imageUrl: v.string(),
        author: v.string(),
        authorImage: v.optional(v.string()),
        featured: v.boolean(),
        publishedAt: v.number(),
        readTime: v.optional(v.number()),
    })
        .index("by_slug", ["slug"])
        .index("by_category", ["category"])
        .index("by_featured", ["featured"])
        .index("by_published", ["publishedAt"])
        .index("by_author", ["author"]),

    comments: defineTable({
        articleSlug: v.string(),
        authorName: v.string(),
        authorEmail: v.optional(v.string()),
        content: v.string(),
        createdAt: v.number(),
        parentId: v.optional(v.id("comments")),
    })
        .index("by_article", ["articleSlug"])
        .index("by_date", ["createdAt"])
        .index("by_parent", ["parentId"]),

    // Track user reading history for personalized recommendations
    readHistory: defineTable({
        userId: v.string(),
        articleSlug: v.string(),
        category: v.string(),
        readAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_article", ["userId", "articleSlug"]),
});

