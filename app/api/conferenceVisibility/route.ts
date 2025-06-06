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
const CONFIG_KEY = 'data/conference.json';

export async function POST(request: NextRequest) {
  try {
    const { conferenceVisible } = await request.json();
    const config = { conferenceVisible };
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: CONFIG_KEY,
      Body: JSON.stringify(config),
      ContentType: 'application/json',
    }));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating conference config:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
} 