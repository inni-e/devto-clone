import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(z.object({
      postId: z.number(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          content: input.content,
          userId: ctx.session.user.id,
          postId: input.postId,
        },
      });
    }),

  replyToComment: protectedProcedure
    .input(z.object({
      commentId: z.number(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          content: input.content,
          userId: ctx.session.user.id,
          parentId: input.commentId,
        },
      });
    }),

  getCommentsByPost: publicProcedure
    .input(z.object({
      postId: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { postId: input.postId, parentId: null },
        include: {
          replies: {
            include: {
              replies: true,
              user: true
            }
          },
          user: true
        },
      });
    }),

  getRecentCommentsByPost: publicProcedure
    .input(z.object({
      postId: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { postId: input.postId, parentId: null },
        orderBy: { createdAt: 'desc' },
        take: 2,
        include: {
          replies: {
            include: {
              replies: true,
              user: true
            }
          },
          user: true
        },
      });
    }),

  getRepliesByComment: publicProcedure
    .input(z.object({
      commentId: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { postId: null, parentId: input.commentId },
        include: {
          replies: {
            include: {
              replies: true,
              user: true
            }
          },
          user: true
        },
      });
    }),
});