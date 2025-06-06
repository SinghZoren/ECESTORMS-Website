import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const defaultTutorials = {
  tutorials: []
};

export async function GET() {
  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'data/tutorials.json',
      Body: JSON.stringify(defaultTutorials, null, 2),
      ContentType: 'application/json',
    }));
    return NextResponse.json({ success: true, message: 'Tutorials data initialized successfully' });
  } catch (error) {
    console.error('Error initializing tutorials data:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize tutorials data',
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: BUCKET_NAME,
        region: process.env.AWS_REGION,
      },
      { status: 500 }
    );
  }
} 