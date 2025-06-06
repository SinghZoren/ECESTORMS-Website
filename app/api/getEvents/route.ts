import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    const key = 'data/events.json';
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    
    if (!Body) {
      throw new Error('No data received from S3');
    }

    const json = await Body.transformToString();
    const { events } = JSON.parse(json);
    return NextResponse.json({ events });
  } catch (error: unknown) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events data' }, { status: 500 });
  }
} 