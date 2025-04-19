import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app/data/sponsors.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const sponsors = JSON.parse(fileContent);

    return NextResponse.json({ sponsors });
  } catch (error) {
    console.error('Error reading sponsors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
} 