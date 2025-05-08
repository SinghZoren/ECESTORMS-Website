import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });
const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const { teamMembers, teamPhotoUrl } = await request.json();
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