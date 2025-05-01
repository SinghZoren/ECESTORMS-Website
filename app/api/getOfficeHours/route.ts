import { NextResponse } from 'next/server';
import officeHoursData from '../../data/officeHours.json';

export async function GET() {
  try {
    return NextResponse.json({
      hours: officeHoursData.hours,
      location: officeHoursData.location
    });
  } catch (error: unknown) {
    console.error('Error reading office hours:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to read office hours', details: errorMessage },
      { status: 500 }
    );
  }
} 