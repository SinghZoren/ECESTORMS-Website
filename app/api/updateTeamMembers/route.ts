import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const { teamMembers, teamPhotoUrl } = await request.json();
    console.log('API DEBUG: Saving teamMembers:', teamMembers);
    console.log('API DEBUG: Saving teamPhotoUrl:', teamPhotoUrl);
    if (!teamMembers || !Array.isArray(teamMembers)) {
      return NextResponse.json({ error: 'Invalid team members data' }, { status: 400 });
    }
    // Store as JSON in S3
    const data = JSON.stringify({ teamMembers, teamPhotoUrl });
    const key = 'data/team.json';
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: data,
      ContentType: 'application/json',
    }));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating team members:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to update team members data', details: errorMessage },
      { status: 500 }
    );
  }
} 