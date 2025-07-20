import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const { positions } = await request.json();
    
    if (!positions || !Array.isArray(positions)) {
      return NextResponse.json({ error: 'Invalid positions data' }, { status: 400 });
    }

    // Validate position structure
    for (const position of positions) {
      if (!position.id || !position.title || !position.section) {
        return NextResponse.json({ 
          error: 'Invalid position structure. Each position must have id, title, and section' 
        }, { status: 400 });
      }
    }

    const data = JSON.stringify({ positions });
    const key = 'data/positions.json';
    
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: data,
      ContentType: 'application/json',
    }));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating positions:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update positions', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 