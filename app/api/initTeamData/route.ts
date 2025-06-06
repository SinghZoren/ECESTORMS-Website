import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';
import { defaultTeamMembers } from '../../data/teamMembers';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    // Initialize team data with default values
    const teamData = {
      teamMembers: defaultTeamMembers,
      teamPhotoUrl: null
    };

    // Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'data/team.json',
      Body: JSON.stringify(teamData, null, 2),
      ContentType: 'application/json',
    }));

    return NextResponse.json({ 
      success: true,
      message: 'Team data initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing team data:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize team data',
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: BUCKET_NAME,
        region: process.env.AWS_REGION,
      },
      { status: 500 }
    );
  }
} 