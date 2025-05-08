import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { defaultTeamMembers } from '../../data/teamMembers';

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

// Default data structures for each file
const defaultData = {
  calendar: {
    calendar: []
  },
  resources: {
    resources: []
  },
  conference: {
    conference: {
      visible: false,
      registrationOpen: false,
      registrationLink: '',
      date: '',
      location: '',
      description: ''
    }
  },
  officeHours: {
    hours: {},
    location: 'ENG 101'
  },
  pastEvents: {
    events: []
  },
  shopItems: {
    items: []
  }
};

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