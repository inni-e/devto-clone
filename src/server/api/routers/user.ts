import { z } from "zod";
import useAWSBucket from "~/server/awsMethods";

import {
  createTRPCRouter,
  protectedProcedure,
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

  updateUserInfo: protectedProcedure
    .input(z.object({ bio: z.string().min(1), imageName: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId, imageKey: originalImageKey } = ctx.session.user;
      if (!userId) {
        throw new Error("Not authenticated");
      }

      // Do the aws stuff first
      // If the user has an imageKey set already, it must be in AWS bucket -> need to delete it first
      if (originalImageKey) {
        const { signedURL: deleteURL } = await useAWSBucket(originalImageKey, "DELETE");
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

        await ctx.db.user.update({
          where: { id: userId },
          data: {
            bio: input.bio,
            imageKey: newImageKey,
          },
        });
        return { url: putURL };
      }

      // Should only reach here if no image provided
      await ctx.db.user.update({
        where: { id: userId },
        data: {
          bio: input.bio,
        },
      });
      return { url: null };
    })
});