import { z } from "zod";
import { S3Client } from '@aws-sdk/client-s3';

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
//   },
// });

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      // Fetch the post by ID from your data source (e.g., database)
      const user = await ctx.db.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    }),
});