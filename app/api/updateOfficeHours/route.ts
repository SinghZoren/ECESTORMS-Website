import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const officeHours = await request.json();
    if (!officeHours || typeof officeHours !== 'object' || Array.isArray(officeHours)) {
      return NextResponse.json({ error: 'Invalid office hours data' }, { status: 400 });
    }

    const data = JSON.stringify({ officeHours });
    const key = 'data/officeHours.json';
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: data,
      ContentType: 'application/json',
    }));

    return NextResponse.json(officeHours);
  } catch (error: unknown) {
    console.error('Error updating office hours:', error);
    return NextResponse.json(
      { error: 'Failed to update office hours', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 