import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
const CONFIG_KEY = 'data/conference.json';

export async function GET() {
  try {
    let config;
    try {
      const { Body } = await s3.send(new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: CONFIG_KEY,
      }));
      if (!Body) throw new Error('No data received from S3');
      const json = await Body.transformToString();
      config = JSON.parse(json);
    } catch (err) {
      // If not found, initialize with default
      config = { conferenceVisible: true };
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: CONFIG_KEY,
        Body: JSON.stringify(config),
        ContentType: 'application/json',
      }));
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading conference config:', error);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
} 