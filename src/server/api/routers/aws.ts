import { z } from "zod";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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
} from "~/server/api/trpc";

export const awsRouter = createTRPCRouter({
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