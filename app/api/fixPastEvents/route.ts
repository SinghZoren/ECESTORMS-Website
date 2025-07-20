import { NextResponse } from 'next/server';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    const key = 'data/pastEvents.json';
    let events = [];
    let needsUpdate = false;
    
    try {
      // Try to get existing data
      const { Body } = await s3.send(new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));
      
      if (Body) {
        const json = await Body.transformToString();
        const data = JSON.parse(json);
        
        // Check if data has wrong structure and fix it
        if (data.pastEvents && Array.isArray(data.pastEvents)) {
          // Old structure: { pastEvents: [...] } -> Fix to: { events: [...] }
          events = data.pastEvents;
          needsUpdate = true;
        } else if (Array.isArray(data)) {
          // Direct array: [...] -> Fix to: { events: [...] }
          events = data;
          needsUpdate = true;
        } else if (data.events && Array.isArray(data.events)) {
          // Correct structure: { events: [...] }
          events = data.events;
        } else {
          // Unknown structure -> reset to empty
          events = [];
          needsUpdate = true;
        }
      }
    } catch (error) {
      // File doesn't exist or is corrupted -> create with empty structure
      console.log('File missing or corrupted, creating new one');
      events = [];
      needsUpdate = true;
    }
    
    // Update the file if needed
    if (needsUpdate) {
      const correctData = { events };
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(correctData, null, 2),
        ContentType: 'application/json',
      }));
      
      return NextResponse.json({
        success: true,
        message: 'Past events data structure fixed',
        eventsCount: events.length,
        wasFixed: true
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Past events data structure is already correct',
        eventsCount: events.length,
        wasFixed: false
      });
    }
  } catch (error) {
    console.error('Error fixing past events:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fix past events data', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 