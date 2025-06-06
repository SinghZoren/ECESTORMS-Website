import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json();
    const calendar = Array.isArray(events) ? events : null;
    if (!calendar) {
      return NextResponse.json({ error: 'Invalid calendar data' }, { status: 400 });
    }

    const data = JSON.stringify({ calendar });
    const key = 'data/calendar.json';
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: data,
      ContentType: 'application/json',
    }));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating calendar:', error);
    return NextResponse.json(
      { error: 'Failed to update calendar', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 