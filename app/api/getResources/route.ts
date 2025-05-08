import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });
const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

export async function GET() {
  try {
    const key = 'data/resources.json';
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    
    if (!Body) {
      throw new Error('No data received from S3');
    }

    const json = await Body.transformToString();
    const { resources } = JSON.parse(json);
    return NextResponse.json({ resources });
  } catch (error) {
    console.error('Error fetching resources data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 