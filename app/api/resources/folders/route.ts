import { NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const RESOURCES_DIR = join(process.cwd(), 'public', 'resources');

export async function POST(request: Request) {
  try {
    const { name, courseCode, parentId } = await request.json();

    if (!name || !courseCode) {
      return NextResponse.json({ error: 'Name and course code are required' }, { status: 400 });
    }

    // Create course directory if it doesn't exist
    const courseDir = join(RESOURCES_DIR, courseCode);
    if (!existsSync(courseDir)) {
      await mkdir(courseDir, { recursive: true });
    }

    // Determine the folder path
    let folderPath;
    if (parentId) {
      // For nested folders, join with parent folder name
      folderPath = join(courseDir, parentId, name);
    } else {
      // For root folders, create directly in course directory
      folderPath = join(courseDir, name);
    }

    // Check if folder already exists
    if (existsSync(folderPath)) {
      return NextResponse.json({ error: 'A folder with this name already exists' }, { status: 400 });
    }

    // Create the folder
    await mkdir(folderPath, { recursive: true });

    // Return the new folder info
    return NextResponse.json({
      id: name, // Use name as ID for consistency
      name,
      type: 'folder',
      courseCode,
      parentId,
      children: []
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create folder'
    }, { status: 500 });
  }
} 