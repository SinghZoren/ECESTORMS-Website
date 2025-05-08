import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });
const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

export async function POST(request: Request) {
  try {
    const { events } = await request.json();
    
    // Create the JSON content
    const jsonContent = {
      events: events
    };

    // Write to S3
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'data/pastEvents.json',
      Body: JSON.stringify(jsonContent, null, 2),
      ContentType: 'application/json',
    }));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating past events:', error);
    return NextResponse.json(
      { error: 'Failed to update past events' },
      { status: 500 }
    );
  }
} 