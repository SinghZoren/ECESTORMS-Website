import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app/data/teamPhoto.json');
    const data = await fs.readFile(filePath, 'utf8');
    const { teamPhotoUrl } = JSON.parse(data);
    return NextResponse.json({ teamPhotoUrl: teamPhotoUrl || null });
  } catch {
    return NextResponse.json({ teamPhotoUrl: null });
  }
} 