import { router } from './init';
import { interactionsRouter } from './routers/interactions';

export const appRouter = router({
    interactions: interactionsRouter,
});

export type AppRouter = typeof appRouter;
