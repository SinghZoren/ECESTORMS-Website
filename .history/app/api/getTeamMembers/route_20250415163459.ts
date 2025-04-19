import { NextResponse } from 'next/server';
import { defaultTeamMembers } from '../../data/teamMembers';

export async function GET() {
  try {
    // Return team members data directly from the imported module
    return NextResponse.json({ teamMembers: defaultTeamMembers }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving team members:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve team members data', details: error.message },
      { status: 500 }
    );
  }
} 