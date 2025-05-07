import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app/data/shopItems.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading shop items data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shop items data' },
      { status: 500 }
    );
  }
} 