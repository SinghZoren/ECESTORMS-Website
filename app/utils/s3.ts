import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || '';
console.log('All environment variables:', process.env);


export interface S3Resource {
  id: string;
  name: string;
  type: 'file' | 'folder';
  courseCode: string;
  parentId: string | null;
  fileUrl?: string;
  children?: S3Resource[];
}

export async function uploadFileToS3(file: File, key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: new Uint8Array(await file.arrayBuffer()),
    ContentType: file.type,
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

export async function deleteFileFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

export async function listObjects(prefix: string): Promise<S3Resource[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  const resources: S3Resource[] = [];

  if (response.Contents) {
    for (const item of response.Contents) {
      if (!item.Key) continue;

      const parts = item.Key.split('/');
      const name = parts[parts.length - 1];

      if (name === '.placeholder' && parts.length > 1) {
        // This is a folder marker
        const folderName = parts[parts.length - 2];
        resources.push({
          id: folderName,
          name: folderName,
          type: 'folder',
          courseCode: parts[0],
          parentId: parts.length > 2 ? parts[parts.length - 3] : null,
        });
      } else if (name !== '.placeholder') {
        // Regular file
        resources.push({
          id: name,
          name,
          type: 'file',
          courseCode: parts[0],
          parentId: parts.length > 2 ? parts[parts.length - 2] : null,
          fileUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${item.Key}`,
        });
      }
    }
  }

  return resources;
}

export async function getSignedUrlForUpload(key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
} 