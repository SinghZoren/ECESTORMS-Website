import { NextResponse } from 'next/server';
import { getAWSConfigStatus } from '@/app/utils/envConfig';

export async function GET() {
  const status = getAWSConfigStatus();
  
  return NextResponse.json({
    ...status,
    timestamp: new Date().toISOString()
  });
}