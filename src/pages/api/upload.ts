import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new IncomingForm({
    // Remove uploadDir to use the default temp directory
    keepExtensions: true,
  });

  try {
    // Parse the form data
    form.parse(req, async (err, _fields, files) => {
      if (err) {
        console.error("Error parsing form", err);
        res.status(500).json({ error: 'Error parsing the file' });
        return;
      }

      // Extract file from parsed data
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file || !file.filepath) {
        res.status(400).json({ error: 'File not found' });
        return;
      }

      // Read file stream
      const fileStream = fs.createReadStream(file.filepath);
      const key = `cover/${file.originalFilename ?? path.basename(file.filepath)}`;

      // Upload parameters
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ContentType: file.mimetype ?? "application/octet-stream",
        // ACL: 'public-read' as const // FIXME: Photos are able to be publicly readable -> OK in this use scenario
      };

      // Upload file to S3
      try {
        await s3.send(new PutObjectCommand(uploadParams));
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
        return res.status(200).json({ url: fileUrl });
      } catch (uploadError) {
        console.error("Error uploading file", uploadError);
        return res.status(500).json({ error: 'Error uploading the file' });
      }
    });
  } catch (parseError) {
    console.error("Unexpected error", parseError);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}