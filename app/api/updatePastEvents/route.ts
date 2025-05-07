import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { events } = await request.json();
    
    // Create the JSON content
    const jsonContent = {
      events: events
    };

    // Write to the file
    const filePath = path.join(process.cwd(), 'app/data/pastEvents.json');
    fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating past events:', error);
    return NextResponse.json(
      { error: 'Failed to update past events' },
      { status: 500 }
    );
  }
} 