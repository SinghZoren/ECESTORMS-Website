import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    const key = 'data/conference.json';
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    
    if (!Body) {
      throw new Error('No data received from S3');
    }

    const json = await Body.transformToString();
    const { conference } = JSON.parse(json);
    return NextResponse.json({ conference });
  } catch (error) {
    console.error('Error fetching conference data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conference data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 