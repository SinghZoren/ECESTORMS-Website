import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });
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

export async function POST(request: Request) {
  try {
    const data = await request.json() as UpdateCalendarRequest;

    // Validate events array exists
    if (!data.events || !Array.isArray(data.events)) {
      return NextResponse.json({ error: 'Invalid events data' }, { status: 400 });
    }

    // Validate each event has required properties
    const isValidEvent = (event: Partial<CalendarEvent>): event is CalendarEvent => {
      return (
        typeof event.id === 'string' &&
        typeof event.title === 'string' &&
        typeof event.start === 'string' &&
        typeof event.end === 'string' &&
        typeof event.allDay === 'boolean'
      );
    };

    if (!data.events.every(isValidEvent)) {
      return NextResponse.json({ error: 'Invalid event format' }, { status: 400 });
    }

    // Store in S3
    const key = 'data/calendar.json';
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify({ calendar: data.events }, null, 2),
      ContentType: 'application/json',
    }));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating calendar:', error);
    return NextResponse.json(
      { error: 'Failed to update calendar', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 