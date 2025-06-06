import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    const key = 'data/sponsors.json';
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    if (!Body) {
      throw new Error('No data received from S3');
    }
    const json = await Body.transformToString();
    let sponsors;
    try {
      sponsors = JSON.parse(json);
      if (!Array.isArray(sponsors)) sponsors = [];
    } catch {
      sponsors = [];
    }
    return NextResponse.json({ sponsors });
  } catch (error) {
    console.error('Error reading sponsors:', error);
    return NextResponse.json(
      { sponsors: [], error: 'Failed to fetch sponsors', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 