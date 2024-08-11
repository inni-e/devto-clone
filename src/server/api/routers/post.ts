import { z } from "zod";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import useAWSBucket from "~/server/awsMethods";

import { type Post } from "@prisma/client";
import { type User } from "@prisma/client";
import { type Tag } from "@prisma/client";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

type PostWithUser = Post & {
  createdBy: User,
  tags: Tag[],
}

async function attachImageURLs(posts: PostWithUser[]) {
  const postsWithURLs = posts.map(async (post) => {
    // console.log(`Processing post with imageKey: ${post.imageKey}`);
    if (!post.imageKey) {
      return {
        ...post,
        imageUrl: null,
      };
    }

    const getObjectParams = {
      Bucket: process.env.AWS_BUCKET_NAME ?? "",
      Key: post.imageKey,
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return {
      ...post,
      imageUrl: url,
    };
  });
  return Promise.all(postsWithURLs);
}

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ 
      name: z.string().min(1), 
      content: z.string().min(1), 
      tags: z.array(z.string()),
      imageKey: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          content: input.content,
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
          imageKey: input.imageKey,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    const posts = await ctx.db.post.findMany({
      where: {
        OR: [
          { hidden: false },
          { createdById: userId },
        ],
      },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
      include: {
        createdBy: true,
        tags: true,
      }
    });
    const postsWithURLs = await attachImageURLs(posts);
    return postsWithURLs;
  }),

  getPostById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { id: postId } = input;

      const post = await ctx.db.post.findUnique({
        where: { id: postId },
        include: {
          createdBy: true,
          tags: true,
        }
      });

      if (!post) {
        throw new Error('Post not found');
      }
      if (post.hidden && ctx.session && ctx.session.user.id !== post.createdById) {
        throw new Error('You are unauthorised to see this post, it is hidden');
      }

      // TODO: Turn this into a reusable helper
      if (!post.imageKey) {
        return {
          ...post,
          imageUrl: null,
        };
      }

      const getObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME ?? "",
        Key: post.imageKey ?? "",
      }
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return {
        ...post,
        imageUrl: url,
      }
      // End TODO
    }),

  getPostsByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      const postsByUser = await ctx.db.post.findMany({
        where: {
          OR: [
            {
              AND: [
                { hidden: false },
                { createdById: input.id },
              ]
            },
            {
              AND: [
                { hidden: true },
                { createdById: input.id },
                { createdById: userId }
              ]
            },
          ],
        },
        include: {
          createdBy: true, // TODO: select fields IMPORTANT!!!
          tags: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      const postsWithUrls = attachImageURLs(postsByUser);
      return postsWithUrls;
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

      await ctx.db.tag.deleteMany({
        where: {
          posts: {
            none: {}, // Tags with no associated posts
          },
        },
      });

      return { success: true };
    }),

  updatePost: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1),
      content: z.string().min(1),
      tags: z.array(z.string()),
      originalImageKey: z.string().optional(),
      imageName: z.string().optional(),
      createdById: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;
      if (userId !== input.createdById) {
        throw new Error("Not authenticated to edit post");
      }

      // Find existing tags or create them if they don't exist
      const tagRecords = await Promise.all(
        input.tags.map((tag) =>
          ctx.db.tag.upsert({
            where: { name: tag },
            update: {},
            create: { name: tag },
          })
        )
      );

      // Do the aws stuff first
      // If the user has an imageKey set already, it must be in AWS bucket -> need to delete it first
      if (input.originalImageKey) {
        const { signedURL: deleteURL } = await useAWSBucket(input.originalImageKey, "DELETE");
        if (deleteURL) {
          const response = await fetch(deleteURL, {
            method: 'DELETE',
          });

          if (response.ok) {
            console.log('File deleted successfully!');
          } else {
            console.log('Deletion failed');
          }
        }
      }

      // If the user provided a new imageName to update, add it to aws bucket
      if (input.imageName) {
        const newImageKey = `${Date.now()}-${input.imageName}`;
        const { signedURL: putURL } = await useAWSBucket(newImageKey, "PUT");
        if (!putURL) {
          throw new Error("Signed URL for new profile image was not uploaded correctly");
        }

        await ctx.db.post.update({
          where: { id: input.id },
          data: {
            name: input.name,
            content: input.content,
            tags: {
              set: tagRecords.map((tag) => ({ id: tag.id })),
            },
            imageKey: newImageKey,
          },
        });
        return { url: putURL };
      }

      // Should only reach here if no image provided
      await ctx.db.post.update({
        where: { id: input.id },
        data: {
          name: input.name,
          content: input.content,
          tags: {
            set: tagRecords.map((tag) => ({ id: tag.id })),
          },
        },
      });
      return { url: null };
    }),

  togglePostHidden: protectedProcedure
    .input(z.object({
      id: z.number(),
      hiddenState: z.boolean(),
      createdById: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;
      if (userId !== input.createdById) {
        throw new Error("Not authenticated to hide post");
      }

      await ctx.db.post.update({
        where: { id: input.id },
        data: {
          hidden: input.hiddenState
        },
      });
    }),

  searchPosts: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        select: {
          id: true,
          name: true,
          content: true,
          createdAt: true,
          createdBy: true,
          tags: true,
        },
        where: {
          name: {
            contains: input.query,
            mode: "insensitive", // Case-insensitive search
          },
        },
        take: 20,
        orderBy: [{ createdAt: "desc" }],
      });
      return posts;
    }),

  getPostsByTag: publicProcedure
    .input(z.object({ tagName: z.string() }))
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          tags: {
            some: {
              name: input.tagName,
            },
          },
        },
        select: {
          id: true,
          name: true,
          content: true,
          createdAt: true,
          createdBy: true,
          tags: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return posts;
    }),
});