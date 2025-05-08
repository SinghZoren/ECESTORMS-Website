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

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  description?: string;
}

interface UpdateCalendarRequest {
  events: CalendarEvent[];
}

export async function POST(request: NextRequest) {
  try {
    const { calendar } = await request.json();
    if (!calendar || !Array.isArray(calendar)) {
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