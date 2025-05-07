import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    const jsonContent = { items };
    const filePath = path.join(process.cwd(), 'app/data/shopItems.json');
    fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating shop items:', error);
    return NextResponse.json(
      { error: 'Failed to update shop items' },
      { status: 500 }
    );
  }
} 