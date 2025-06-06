import { NextResponse } from 'next/server';
import { GetObjectCommand, S3ServiceException } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    const key = 'data/teamPhoto.json';
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    
    if (!Body) {
      throw new Error('No data received from S3');
    }

    const json = await Body.transformToString();
    const { teamPhotoUrl } = JSON.parse(json);
    return NextResponse.json({ teamPhotoUrl: teamPhotoUrl || null });
  } catch (error) {
    console.error('Error fetching team photo from S3:', error);
    if (error instanceof S3ServiceException && error.name === 'NoSuchKey') {
      return NextResponse.json({ teamPhotoUrl: null }, { status: 404 });
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch team photo data', details: errorMessage },
      { status: 500 }
    );
  }
} 