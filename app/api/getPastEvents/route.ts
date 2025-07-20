import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    const key = 'data/pastEvents.json';
    let events = [];
    
    try {
      const { Body } = await s3.send(new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));
      
      if (!Body) {
        throw new Error('No data received from S3');
      }

      const json = await Body.transformToString();
      const data = JSON.parse(json);
      
      // Handle different possible data structures
      if (data.events && Array.isArray(data.events)) {
        events = data.events;
      } else if (data.pastEvents && Array.isArray(data.pastEvents)) {
        events = data.pastEvents; // Handle old structure
      } else if (Array.isArray(data)) {
        events = data; // Handle direct array
      } else {
        console.warn('Unexpected pastEvents data structure:', data);
        events = [];
      }
    } catch (error: unknown) {
      console.error('Error fetching from S3, using empty events array:', error);
      // Return empty events array if file doesn't exist or is corrupted
      events = [];
    }
    
    return NextResponse.json({ events });
  } catch (error: unknown) {
    console.error('Error in getPastEvents:', error);
    // Always return valid structure even on error
    return NextResponse.json({ events: [] });
  }
} 