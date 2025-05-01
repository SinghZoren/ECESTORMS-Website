import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const memberId = formData.get('memberId') as string;
    
    if (!file || !memberId) {
      return NextResponse.json(
        { error: 'File or member ID is missing' },
        { status: 400 }
      );
    }

    // Create a safe filename using the member ID and original extension
    const fileExtension = path.extname(file.name);
    const safeFileName = `${memberId}${fileExtension}`;
    
    // Ensure the directory exists
    const uploadDir = path.join(process.cwd(), 'public/images/team');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Create the file path
    const filePath = path.join(uploadDir, safeFileName);
    
    // Save the file
    const fileArrayBuffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(fileArrayBuffer));
    
    // Return the URL path to be used in the app
    const imageUrl = `/images/team/${safeFileName}`;
    
    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error uploading image:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to upload image', details: errorMessage },
      { status: 500 }
    );
  }
} 