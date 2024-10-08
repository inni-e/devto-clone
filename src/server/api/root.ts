import { postRouter } from "~/server/api/routers/post";
import { awsRouter } from "~/server/api/routers/aws";
import { userRouter } from "~/server/api/routers/user";
import { commentRouter } from "~/server/api/routers/comment";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  aws: awsRouter,
  user: userRouter,
  comment: commentRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
