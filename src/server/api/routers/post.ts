import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), content: z.string().min(1), imageUrl: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          content: input.content,
          imageUrl: input.imageUrl,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
      include: {
        createdBy: true,
      }
    });

    return posts;
  }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return post ?? null;
  }),

  getPostById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      // Fetch the post by ID from your data source (e.g., database)
      const post = await ctx.db.post.findUnique({
        where: { id },
        include: {
          createdBy: true,
        }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      return post;
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Check if the post exists
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
      });
      if (!post) {
        throw new Error('Post not found');
      }
      // Check if the user is authorized to delete the post
      if (post.createdById !== ctx.session.user.id) {
        throw new Error('Not authorized to delete this post');
      }
      // Delete the post
      await ctx.db.post.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});