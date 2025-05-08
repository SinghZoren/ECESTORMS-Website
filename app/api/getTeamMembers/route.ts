import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { defaultTeamMembers } from '../../data/teamMembers';

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });
const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

export async function GET() {
  try {
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
    } catch (err) {
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