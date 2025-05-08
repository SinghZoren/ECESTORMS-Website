import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const { pastEvents } = await request.json();
    if (!pastEvents || !Array.isArray(pastEvents)) {
      return NextResponse.json({ error: 'Invalid past events data' }, { status: 400 });
    }

    const data = JSON.stringify({ pastEvents });
    const key = 'data/pastEvents.json';
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: data,
      ContentType: 'application/json',
    }));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating past events:', error);
    return NextResponse.json(
      { error: 'Failed to update past events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 