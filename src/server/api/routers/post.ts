import { z } from "zod";
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), content: z.string().min(1), imageKey: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          content: input.content,
          imageKey: input.imageKey,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // TODO: attach the preSignedUrl to all of the get requests

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
      include: {
        createdBy: true,
      }
    });

    // TODO: Turn this into a reusable helper
    const postsWithUrls = posts.map(async (post) => {
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
    // End TODO

    // console.log(postsWithUrls);

    return Promise.all(postsWithUrls);
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

  getPresignedURLPut: protectedProcedure.input(
    z.object({
      fileKey: z.string(),
    })
  ).mutation(async ({ input }) => {
    const { fileKey } = input;

    // Define the parameters for the presigned URL
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
      // ContentType: fileType,
      // Expires: 60 * 5, // URL expires in 5 minutes
    };

    try {
      // Generate the presigned URL
      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(s3, command, { expiresIn: 60 });
      return { url };
    } catch (error) {
      console.error('Error generating presigned URL', error);
      throw new Error('Error generating presigned URL');
    }
  }),

  getPresignedURLDelete: protectedProcedure.input(
    z.object({
      fileKey: z.string(),
    })
  ).mutation(async ({ input }) => {
    const { fileKey } = input;

    // Define the parameters for the presigned URL
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
    };

    try {
      // Generate the presigned URL
      const command = new DeleteObjectCommand(params);
      const url = await getSignedUrl(s3, command, { expiresIn: 60 });
      return { url };
    } catch (error) {
      console.error('Error generating presigned URL', error);
      throw new Error('Error generating presigned URL');
    }
  }),
});