import { NextResponse } from 'next/server';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Default data structures for each file
const defaultStructures = {
  'data/pastEvents.json': { events: [] },
  'data/shopItems.json': { items: [] },
  'data/officeHours.json': { officeHours: {}, location: '' },
  'data/calendar.json': { calendar: [] },
  'data/sponsors.json': [],
  'data/team.json': { teamMembers: [], teamPhotoUrl: null },
  'data/tutorials.json': { tutorials: [] },
  'data/positions.json': { positions: [] }
};

export async function GET() {
  try {
    const results = [];
    
    for (const [filePath, defaultStructure] of Object.entries(defaultStructures)) {
      try {
        let needsUpdate = false;
        let currentData = defaultStructure;
        
        try {
          // Try to get existing data
          const { Body } = await s3.send(new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filePath,
          }));
          
          if (Body) {
            const json = await Body.transformToString();
            const data = JSON.parse(json);
            
            // Check and fix structure based on file type
            switch (filePath) {
              case 'data/pastEvents.json':
                if (data.pastEvents && Array.isArray(data.pastEvents)) {
                  currentData = { events: data.pastEvents };
                  needsUpdate = true;
                } else if (Array.isArray(data)) {
                  currentData = { events: data };
                  needsUpdate = true;
                } else if (data.events && Array.isArray(data.events)) {
                  currentData = data;
                } else {
                  needsUpdate = true;
                }
                break;
                
              case 'data/shopItems.json':
                if (Array.isArray(data)) {
                  currentData = { items: data };
                  needsUpdate = true;
                } else if (data.items && Array.isArray(data.items)) {
                  currentData = data;
                } else {
                  needsUpdate = true;
                }
                break;
                
              case 'data/officeHours.json':
                if (data.officeHours !== undefined || data.location !== undefined) {
                  // Handle case where officeHours might be an array (corrupted data)
                  const officeHours = Array.isArray(data.officeHours) ? {} : (data.officeHours || {});
                  currentData = {
                    officeHours: officeHours,
                    location: data.location || ''
                  };
                  if (Array.isArray(data.officeHours)) {
                    needsUpdate = true;
                  }
                } else {
                  needsUpdate = true;
                }
                break;
                
              case 'data/calendar.json':
                if (Array.isArray(data)) {
                  currentData = { calendar: data };
                  needsUpdate = true;
                } else if (data.calendar && Array.isArray(data.calendar)) {
                  currentData = data;
                } else {
                  needsUpdate = true;
                }
                break;
                
              case 'data/sponsors.json':
                if (Array.isArray(data)) {
                  currentData = data;
                } else if (data.sponsors && Array.isArray(data.sponsors)) {
                  currentData = data.sponsors;
                  needsUpdate = true;
                } else {
                  needsUpdate = true;
                }
                break;
                
              case 'data/team.json':
                if (data.teamMembers !== undefined || data.teamPhotoUrl !== undefined) {
                  currentData = {
                    teamMembers: data.teamMembers || [],
                    teamPhotoUrl: data.teamPhotoUrl || null
                  };
                } else {
                  needsUpdate = true;
                }
                break;
                
              case 'data/tutorials.json':
                if (Array.isArray(data)) {
                  currentData = { tutorials: data };
                  needsUpdate = true;
                } else if (data.tutorials && Array.isArray(data.tutorials)) {
                  currentData = data;
                } else {
                  needsUpdate = true;
                }
                break;
                
              case 'data/positions.json':
                if (Array.isArray(data)) {
                  currentData = { positions: data };
                  needsUpdate = true;
                } else if (data.positions && Array.isArray(data.positions)) {
                  currentData = data;
                } else {
                  needsUpdate = true;
                }
                break;
            }
          }
        } catch (error) {
          // File doesn't exist or is corrupted
          needsUpdate = true;
        }
        
        // Update the file if needed
        if (needsUpdate) {
          await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filePath,
            Body: JSON.stringify(currentData, null, 2),
            ContentType: 'application/json',
          }));
          
          results.push({
            file: filePath,
            status: 'fixed',
            structure: currentData
          });
        } else {
          results.push({
            file: filePath,
            status: 'already_correct'
          });
        }
      } catch (error) {
        results.push({
          file: filePath,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Data structure check/fix completed',
      results,
      bucket: BUCKET_NAME
    });
  } catch (error) {
    console.error('Error fixing all data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fix data structures', 
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: BUCKET_NAME
      },
      { status: 500 }
    );
  }
} 