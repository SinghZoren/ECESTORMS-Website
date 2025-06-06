import { NextResponse } from 'next/server';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
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
    } catch {
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