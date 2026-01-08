import { internalMutation } from "./_generated/server";

// Fix article content to replace ### with ##
export const fixArticleHeaders = internalMutation({
    args: {},
    handler: async (ctx) => {
        const articles = await ctx.db.query("articles").collect();
        let fixedCount = 0;
        
        for (const article of articles) {
            if (article.content && article.content.includes("###")) {
                const fixedContent = article.content.replace(/### /g, "## ");
                await ctx.db.patch(article._id, { content: fixedContent });
                fixedCount++;
            }
        }
        
        return `Fixed ${fixedCount} articles with ### headers`;
    },
});
