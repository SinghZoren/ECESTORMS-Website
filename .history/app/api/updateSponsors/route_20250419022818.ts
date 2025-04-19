import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { sponsors } = await request.json();
    const filePath = path.join(process.cwd(), 'app/data/sponsors.json');
    
    await fs.writeFile(filePath, JSON.stringify(sponsors, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating sponsors:', error);
    return NextResponse.json(
      { error: 'Failed to update sponsors' },
      { status: 500 }
    );
  }
} 