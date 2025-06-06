import { NextResponse } from 'next/server';
import { ListObjectsV2Command, _Object } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

export async function GET() {
  try {
    // List all objects in the data directory
    const { Contents } = await s3.send(new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: 'data/',
    }));

    const files = Contents ? Contents.map((file: _Object) => ({
      Key: file.Key,
      Size: file.Size,
      LastModified: file.LastModified,
    })) : [];

    return NextResponse.json({
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
      files,
      message: 'S3 setup appears to be correct.',
    });
  } catch (error) {
    console.error('S3 setup verification failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to verify S3 setup',
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION,
      },
      { status: 500 }
    );
  }
} 