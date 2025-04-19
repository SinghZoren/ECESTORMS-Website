import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { content, isJson } = await request.json();
    
    // Get the absolute path to the office hours file
    const filePath = path.join(process.cwd(), 'app', 'data', isJson ? 'officeHours.json' : 'officeHours.ts');
    
    // Write the new content to the file
    await writeFile(filePath, content, 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating office hours:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to update office hours',
      details: errorMessage 
    }, { status: 500 });
  }
} 