import { z } from 'zod/v4';
import { router, publicProcedure } from '../init';

// In-memory store for demo (would be database in production)
const votesStore = new Map<string, { upvotes: Set<string>; downvotes: Set<string> }>();
const bookmarksStore = new Map<string, Set<string>>();

export const interactionsRouter = router({
    // Get vote status for an article
    getVotes: publicProcedure
        .input(z.object({ articleId: z.string() }))
        .query(({ input }) => {
            const votes = votesStore.get(input.articleId) || { upvotes: new Set(), downvotes: new Set() };
            return {
                upvotes: votes.upvotes.size,
                downvotes: votes.downvotes.size,
                score: votes.upvotes.size - votes.downvotes.size,
            };
        }),

    // Vote on an article
    vote: publicProcedure
        .input(z.object({
            articleId: z.string(),
            oderId: z.string(),
            type: z.enum(['up', 'down', 'none']),
        }))
        .mutation(({ input }) => {
            if (!votesStore.has(input.articleId)) {
                votesStore.set(input.articleId, { upvotes: new Set(), downvotes: new Set() });
            }
            const votes = votesStore.get(input.articleId)!;

            // Remove existing vote
            votes.upvotes.delete(input.oderId);
            votes.downvotes.delete(input.oderId);

            // Add new vote
            if (input.type === 'up') {
                votes.upvotes.add(input.oderId);
            } else if (input.type === 'down') {
                votes.downvotes.add(input.oderId);
            }

            return {
                success: true,
                score: votes.upvotes.size - votes.downvotes.size,
            };
        }),

    // Get bookmarks for a user
    getBookmarks: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(({ input }) => {
            const bookmarks = bookmarksStore.get(input.userId) || new Set();
            return Array.from(bookmarks);
        }),

    // Toggle bookmark
    toggleBookmark: publicProcedure
        .input(z.object({
            userId: z.string(),
            articleId: z.string(),
        }))
        .mutation(({ input }) => {
            if (!bookmarksStore.has(input.userId)) {
                bookmarksStore.set(input.userId, new Set());
            }
            const bookmarks = bookmarksStore.get(input.userId)!;

            if (bookmarks.has(input.articleId)) {
                bookmarks.delete(input.articleId);
                return { bookmarked: false };
            } else {
                bookmarks.add(input.articleId);
                return { bookmarked: true };
            }
        }),

    // Check if article is bookmarked
    isBookmarked: publicProcedure
        .input(z.object({
            userId: z.string(),
            articleId: z.string(),
        }))
        .query(({ input }) => {
            const bookmarks = bookmarksStore.get(input.userId) || new Set();
            return bookmarks.has(input.articleId);
        }),
});
