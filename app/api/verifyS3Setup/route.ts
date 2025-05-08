import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });
const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

export async function GET() {
  try {
    // List all objects in the data directory
    const { Contents } = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'data/',
    }));

    const files = Contents?.map(file => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
    })) || [];

    return NextResponse.json({
      bucket: BUCKET_NAME,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      files,
    });
  } catch (error) {
    console.error('Error verifying S3 setup:', error);
    return NextResponse.json(
      {
        error: 'Failed to verify S3 setup',
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: BUCKET_NAME,
        region: process.env.NEXT_PUBLIC_AWS_REGION,
      },
      { status: 500 }
    );
  }
} 