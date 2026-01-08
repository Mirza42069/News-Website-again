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
        .index("by_published", ["publishedAt"]),

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
});
