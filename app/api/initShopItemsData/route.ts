import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../../../utils/s3Client';
import { defaultShopItems } from '@/app/data/shopItems';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'data/shopItems.json',
      Body: JSON.stringify(defaultShopItems, null, 2),
      ContentType: 'application/json',
    }));
    return NextResponse.json({ success: true, message: 'Shop items data initialized successfully' });
  } catch (error) {
    console.error('Error initializing shop items data:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize shop items data',
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: BUCKET_NAME,
        region: process.env.AWS_REGION,
      },
      { status: 500 }
    );
  }
} 