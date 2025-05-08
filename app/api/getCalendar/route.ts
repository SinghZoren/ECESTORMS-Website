import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

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