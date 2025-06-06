import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const defaultCalendar = {
  calendar: []
};

export async function GET() {
  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'data/calendar.json',
      Body: JSON.stringify(defaultCalendar, null, 2),
      ContentType: 'application/json',
    }));
    return NextResponse.json({ success: true, message: 'Calendar data initialized successfully' });
  } catch (error) {
    console.error('Error initializing calendar data:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize calendar data',
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: BUCKET_NAME,
        region: process.env.AWS_REGION,
      },
      { status: 500 }
    );
  }
} 