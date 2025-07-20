import { NextResponse } from 'next/server';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Default positions
const defaultPositions = {
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
};

export async function GET() {
  try {
    // Check if positions.json already exists
    try {
      await s3.send(new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'data/positions.json',
      }));
      
      return NextResponse.json({ 
        success: true, 
        message: 'Positions file already exists - no action needed',
        alreadyExists: true
      });
    } catch (error) {
      // File doesn't exist, create it
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'data/positions.json',
        Body: JSON.stringify(defaultPositions, null, 2),
        ContentType: 'application/json',
      }));
      
      return NextResponse.json({ 
        success: true, 
        message: 'Positions file created successfully - existing data preserved',
        created: true
      });
    }
  } catch (error) {
    console.error('Error initializing positions only:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize positions',
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: BUCKET_NAME,
        region: process.env.AWS_REGION,
      },
      { status: 500 }
    );
  }
} 