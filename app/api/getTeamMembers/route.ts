import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';
import { defaultTeamMembers } from '../../data/teamMembers';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    // Check if bucket name is configured
    if (!BUCKET_NAME) {
      console.warn('AWS_BUCKET_NAME not configured, using default team data');
      return NextResponse.json({ 
        teamMembers: defaultTeamMembers, 
        teamPhotoUrl: null 
      });
    }

    const key = 'data/team.json';
    let teamMembers, teamPhotoUrl;
    try {
      const { Body } = await s3.send(new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));
      if (!Body) throw new Error('No data received from S3');
      const json = await Body.transformToString();
      const parsed = JSON.parse(json);
      teamMembers = parsed.teamMembers;
      teamPhotoUrl = parsed.teamPhotoUrl || null;
    } catch (err: unknown) {
      console.error('Error fetching from S3, using default data:', err);
      // Fallback to local data if S3 file does not exist
      teamMembers = defaultTeamMembers;
      teamPhotoUrl = null;
    }
    return NextResponse.json({ teamMembers, teamPhotoUrl });
  } catch (error) {
    console.error('Error in getTeamMembers:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch team members',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 