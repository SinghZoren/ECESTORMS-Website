import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });
const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

export async function GET() {
  try {
    const key = 'data/pastEvents.json';
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    
    if (!Body) {
      throw new Error('No data received from S3');
    }

    const json = await Body.transformToString();
    const data = JSON.parse(json);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching past events data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch past events data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 