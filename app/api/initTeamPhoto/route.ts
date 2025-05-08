import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

export async function GET() {
  try {
    // Initialize team photo data with null URL
    const teamPhotoData = {
      teamPhotoUrl: null
    };

    // Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'data/teamPhoto.json',
      Body: JSON.stringify(teamPhotoData, null, 2),
      ContentType: 'application/json',
    }));

    return NextResponse.json({ 
      success: true,
      message: 'Team photo data initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing team photo data:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize team photo data',
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: BUCKET_NAME,
        region: process.env.NEXT_PUBLIC_AWS_REGION,
      },
      { status: 500 }
    );
  }
} 