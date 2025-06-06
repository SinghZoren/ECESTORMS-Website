import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const { sponsors } = await request.json();
    if (!Array.isArray(sponsors)) {
      return NextResponse.json({ error: 'Invalid sponsors data' }, { status: 400 });
    }
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'data/sponsors.json',
      Body: JSON.stringify(sponsors, null, 2),
      ContentType: 'application/json',
    }));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating sponsors:', error);
    return NextResponse.json(
      { error: 'Failed to update sponsors', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 