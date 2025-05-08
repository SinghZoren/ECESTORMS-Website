import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });
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
    const results = await Promise.all(
      Object.entries(defaultData).map(async ([key, data]) => {
        try {
          await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `data/${key}.json`,
            Body: JSON.stringify(data, null, 2),
            ContentType: 'application/json',
          }));
          return { key, success: true };
        } catch (error) {
          console.error(`Error initializing ${key} data:`, error);
          return { key, success: false, error };
        }
      })
    );

    // Check if all initializations were successful
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      throw new Error(`Failed to initialize: ${failed.map(f => f.key).join(', ')}`);
    }

    return NextResponse.json({ 
      success: true,
      message: 'All data files initialized successfully',
      initialized: Object.keys(defaultData)
    });
  } catch (error) {
    console.error('Error initializing data:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize data',
        details: error instanceof Error ? error.message : 'Unknown error',
        bucket: BUCKET_NAME,
        region: process.env.NEXT_PUBLIC_AWS_REGION,
      },
      { status: 500 }
    );
  }
} 