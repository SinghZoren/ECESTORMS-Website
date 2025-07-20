import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    // Check if bucket name is configured
    if (!BUCKET_NAME) {
      console.error('AWS_BUCKET_NAME environment variable is not set');
      return NextResponse.json(
        { resources: [], error: 'AWS configuration missing' },
        { status: 500 }
      );
    }

    const key = 'data/resources.json';
    let resources = [];
    
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
      if (data.resources && Array.isArray(data.resources)) {
        resources = data.resources;
      } else if (Array.isArray(data)) {
        resources = data;
      } else {
        console.warn('Unexpected resources data structure:', data);
        resources = [];
      }
    } catch (error) {
      console.error('Error fetching from S3, using empty resources:', error);
      // Return empty resources array if file doesn't exist or is corrupted
      resources = [];
    }
    
    return NextResponse.json({ resources });
  } catch (error) {
    console.error('Error in getResources:', error);
    return NextResponse.json(
      { resources: [], error: 'Failed to fetch resources data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 