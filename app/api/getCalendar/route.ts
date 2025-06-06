import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    const key = 'data/calendar.json';
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    
    if (!Body) {
      throw new Error('No data received from S3');
    }

    const json = await Body.transformToString();
    let calendar;
    try {
      const parsed = JSON.parse(json);
      calendar = Array.isArray(parsed.calendar) ? parsed.calendar : [];
    } catch {
      calendar = [];
    }
    // Always return an array for events
    return NextResponse.json({ events: calendar });
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json(
      { events: [], error: 'Failed to fetch calendar data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 