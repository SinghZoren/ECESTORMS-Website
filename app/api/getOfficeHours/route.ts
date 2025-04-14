import { NextResponse } from 'next/server';
import officeHoursData from '../../data/officeHours.json';

export async function GET() {
  try {
    return NextResponse.json({
      hours: officeHoursData.hours,
      location: officeHoursData.location
    });
  } catch (error) {
    console.error('Error reading office hours:', error);
    return NextResponse.json(
      { error: 'Failed to read office hours' },
      { status: 500 }
    );
  }
} 