import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Default positions based on the existing positionTitles
const defaultPositions = [
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
];

export async function GET() {
  try {
    const key = 'data/positions.json';
    let positions;
    
    try {
      const { Body } = await s3.send(new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));
      
      if (!Body) {
        throw new Error('No data received from S3');
      }

      const json = await Body.transformToString();
      const parsed = JSON.parse(json);
      positions = parsed.positions || defaultPositions;
    } catch (err: unknown) {
      console.error('Error fetching positions from S3, using default data:', err);
      // Fallback to default positions if S3 file does not exist
      positions = defaultPositions;
    }

    return NextResponse.json({ positions });
  } catch (error) {
    console.error('Error in getPositions:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch positions',
        details: error instanceof Error ? error.message : 'Unknown error',
        positions: defaultPositions // Return defaults in case of error
      },
      { status: 500 }
    );
  }
} 