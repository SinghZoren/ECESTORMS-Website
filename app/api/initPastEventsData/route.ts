import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';
import { defaultPastEvents } from '@/app/data/pastEvents';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'data/pastEvents.json',
      Body: JSON.stringify(defaultPastEvents, null, 2),
      ContentType: 'application/json',
    }));
    return NextResponse.json({ success: true, message: 'Past events data initialized successfully' });
  } catch (error) {
    console.error('Error initializing past events data:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize past events data',
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: BUCKET_NAME,
        region: process.env.AWS_REGION,
      },
      { status: 500 }
    );
  }
} 