import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function GET() {
  try {
    const backupData: any = {};
    const files = [
      'data/team.json',
      'data/positions.json', 
      'data/pastEvents.json',
      'data/shopItems.json',
      'data/sponsors.json',
      'data/calendar.json',
      'data/officeHours.json',
      'data/tutorials.json'
    ];

    for (const file of files) {
      try {
        const { Body } = await s3.send(new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: file,
        }));
        
        if (Body) {
          const content = await Body.transformToString();
          const fileName = file.replace('data/', '').replace('.json', '');
          backupData[fileName] = JSON.parse(content);
        }
      } catch (error) {
        console.warn(`File ${file} not found, skipping...`);
        backupData[file.replace('data/', '').replace('.json', '')] = null;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: backupData
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { error: 'Failed to create backup', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 