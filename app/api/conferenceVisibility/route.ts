import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'app/data/config.json');

export async function GET() {
  try {
    if (!fs.existsSync(configPath)) {
      // Create default config if it doesn't exist
      const defaultConfig = { conferenceVisible: true };
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      return NextResponse.json(defaultConfig);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { conferenceVisible } = await request.json();
    
    const config = { conferenceVisible };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
} 