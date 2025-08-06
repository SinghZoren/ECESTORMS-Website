import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    // Check if bucket name is configured
    if (!BUCKET_NAME) {
      console.warn('AWS_BUCKET_NAME not configured, returning empty office hours');
      return NextResponse.json({ hours: {}, location: "" });
    }

    const key = 'data/officeHours.json';
    let officeHours = {};
    let location = '';
    
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
      if (data.officeHours && typeof data.officeHours === 'object' && !Array.isArray(data.officeHours)) {
        officeHours = data.officeHours;
      } else if (Array.isArray(data.officeHours)) {
        // If officeHours is an array (corrupted data), convert to empty object
        officeHours = {};
      } else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        // If data is a direct object (old format), use it as officeHours
        const { location: dataLocation, ...rest } = data;
        officeHours = rest;
        location = dataLocation || '';
      }
      
      if (data.location && typeof data.location === 'string') {
        location = data.location;
      }
      
    } catch (error) {
      console.error('Error fetching from S3, using empty office hours:', error);
      // Return empty structure if file doesn't exist or is corrupted
      officeHours = {};
      location = '';
    }
    
    // Always return valid structure (matching frontend expectations)
    return NextResponse.json({
      hours: officeHours || {},
      location: location || ''
    });
  } catch (error) {
    console.error('Error in getOfficeHours:', error);
    // Always return valid structure even on error (matching frontend expectations)
    return NextResponse.json({
      hours: {},
      location: ''
    });
  }
} 