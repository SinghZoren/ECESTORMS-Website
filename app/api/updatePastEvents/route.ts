import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json();
    if (!events || !Array.isArray(events)) {
      return NextResponse.json({ error: 'Invalid past events data' }, { status: 400 });
    }

    const data = JSON.stringify({ events });
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