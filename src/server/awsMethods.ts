import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export default async function useAWSBucket(fileKey: string, method: "DELETE" | "PUT" | "GET") {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
  };

  try {
    if (method === "DELETE") {
      const command = new DeleteObjectCommand(params);
      const deleteURL = await getSignedUrl(s3, command, { expiresIn: 60 });
      return { signedURL: deleteURL };
    } else if (method === "PUT") {
      const command = new PutObjectCommand(params);
      const putURL = await getSignedUrl(s3, command, { expiresIn: 60 });
      return { signedURL: putURL };
    } else {
      const command = new GetObjectCommand(params);
      const getURL = await getSignedUrl(s3, command, { expiresIn: 60 });
      return { signedURL: getURL };
    }
  } catch (error) {
    console.error('Error fetching presigned URL for method ' + method + ":", error);
    console.log('Error fetching presigned URL for method' + method);
    return { error: error };
  }
}