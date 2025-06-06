import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';
import { defaultTeamMembers } from '../../data/teamMembers';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    // Initialize all data files
    const initialData = {
      team: {
        teamMembers: defaultTeamMembers,
        teamPhotoUrl: null
      },
      shop: {
        items: []
      },
      pastEvents: {
        pastEvents: []
      },
      officeHours: {
        officeHours: []
      },
      calendar: {
        calendar: []
      }
    };

    // Upload each file
    await Promise.all([
      s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'data/team.json',
        Body: JSON.stringify(initialData.team),
        ContentType: 'application/json',
      })),
      s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'data/shop.json',
        Body: JSON.stringify(initialData.shop),
        ContentType: 'application/json',
      })),
      s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'data/pastEvents.json',
        Body: JSON.stringify(initialData.pastEvents),
        ContentType: 'application/json',
      })),
      s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'data/officeHours.json',
        Body: JSON.stringify(initialData.officeHours),
        ContentType: 'application/json',
      })),
      s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'data/calendar.json',
        Body: JSON.stringify(initialData.calendar),
        ContentType: 'application/json',
      }))
    ]);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error initializing all data:', error);
    return NextResponse.json(
      { error: 'Failed to initialize all data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 