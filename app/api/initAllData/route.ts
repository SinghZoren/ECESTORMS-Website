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
      positions: {
        positions: [
          // Presidents
          { id: 'presidents_0', title: 'Co-President', section: 'presidents' },
          
          // Executive Advisors
          { id: 'executiveAdvisors_0', title: 'Executive Advisor', section: 'executiveAdvisors' },
          
          // VPs
          { id: 'vps_0', title: 'VP Academic', section: 'vps' },
          { id: 'vps_1', title: 'VP Student Life', section: 'vps' },
          { id: 'vps_2', title: 'VP Professional Development', section: 'vps' },
          { id: 'vps_3', title: 'VP Marketing', section: 'vps' },
          { id: 'vps_4', title: 'VP Operations', section: 'vps' },
          { id: 'vps_5', title: 'VP Finance & Sponsorship', section: 'vps' },
          
          // Directors
          { id: 'directors_0', title: 'Events Director', section: 'directors' },
          { id: 'directors_1', title: 'Marketing Director', section: 'directors' },
          { id: 'directors_2', title: 'Merchandise Director', section: 'directors' },
          { id: 'directors_3', title: 'Outreach Director', section: 'directors' },
          { id: 'directors_4', title: 'Corporate Relations Director', section: 'directors' },
          { id: 'directors_5', title: 'Webmaster', section: 'directors' },
          
          // Year Reps
          { id: 'yearReps_0', title: 'First Year Rep', section: 'yearReps' },
          { id: 'yearReps_1', title: 'Second Year Rep', section: 'yearReps' },
          { id: 'yearReps_2', title: 'Third Year Rep', section: 'yearReps' },
          { id: 'yearReps_3', title: 'Fourth Year Rep', section: 'yearReps' },
          { id: 'yearReps_4', title: 'Computer Representative', section: 'yearReps' },
          { id: 'yearReps_5', title: 'Electrical Representative', section: 'yearReps' },
        ]
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
        Key: 'data/positions.json',
        Body: JSON.stringify(initialData.positions),
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