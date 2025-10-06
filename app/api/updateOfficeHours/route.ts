import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hours, location } = body;
    
    if (!hours || typeof hours !== 'object' || Array.isArray(hours)) {
      return NextResponse.json({ error: 'Invalid office hours data' }, { status: 400 });
    }

    const data = JSON.stringify({ 
      officeHours: hours,
      location: location || ''
    });
    
    const key = 'data/officeHours.json';
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: data,
      ContentType: 'application/json',
    }));

    return NextResponse.json({ success: true, hours, location });
  } catch (error: unknown) {
    console.error('Error updating office hours:', error);
    return NextResponse.json(
      { error: 'Failed to update office hours', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 