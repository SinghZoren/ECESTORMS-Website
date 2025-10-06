import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface Tutorial {
  id: string;
  course: string;
  date: string;
  time: string;
  taName: string;
  location: string;
  zoomLink?: string;
  willRecord: boolean;
  willPostNotes: boolean;
  additionalResources?: string[];
  type: 'academic' | 'non-academic';
}

const BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;
const KEY = 'data/tutorials.json';

function normalizeTutorial(raw: Partial<Tutorial>): Tutorial {
  return {
    id: raw.id || Date.now().toString(),
    course: raw.course || 'TBA',
    date: raw.date || '',
    time: raw.time || '',
    taName: raw.taName || 'TBA',
    location: raw.location || 'TBA',
    zoomLink: raw.zoomLink,
    willRecord: Boolean(raw.willRecord),
    willPostNotes: Boolean(raw.willPostNotes),
    additionalResources: Array.isArray(raw.additionalResources)
      ? raw.additionalResources
      : typeof raw.additionalResources === 'string'
        ? raw.additionalResources.split(',').map(r => r.trim()).filter(Boolean)
        : [],
    type: raw.type && raw.type.toLowerCase() === 'non-academic' ? 'non-academic' : 'academic',
  } satisfies Tutorial;
}

async function readTutorials(): Promise<Tutorial[]> {
  try {
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: KEY,
    }));
    if (!Body) return [];
    const json = await Body.transformToString();
    const parsed = JSON.parse(json);
    const tutorialsData = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.tutorials)
        ? parsed.tutorials
        : [];
    return tutorialsData.map(t => normalizeTutorial(t));
  } catch {
    return [];
  }
}

async function writeTutorials(tutorials: Tutorial[]) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: KEY,
    Body: JSON.stringify({ tutorials: tutorials.map(t => normalizeTutorial(t)) }, null, 2),
    ContentType: 'application/json',
  }));
}

export async function GET() {
  try {
    const tutorials = await readTutorials();
    const response = NextResponse.json({ tutorials });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('Error reading tutorials:', error);
    return NextResponse.json({ tutorials: [], error: 'Failed to fetch tutorials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tutorials = await readTutorials();
    const newTutorial = normalizeTutorial({ ...body, id: Date.now().toString() });
    tutorials.push(newTutorial);
    await writeTutorials(tutorials);
    return NextResponse.json({ tutorial: newTutorial }, { status: 201 });
  } catch (error) {
    console.error('Error adding tutorial:', error);
    return NextResponse.json({ error: 'Failed to add tutorial' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    let tutorials = await readTutorials();
    tutorials = tutorials.map((t: Tutorial) => (t.id === id ? normalizeTutorial({ ...t, ...body, id }) : t));
    await writeTutorials(tutorials);
    const updated = tutorials.find(t => t.id === id);
    return NextResponse.json({ tutorial: updated });
  } catch (error) {
    console.error('Error updating tutorial:', error);
    return NextResponse.json({ error: 'Failed to update tutorial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    let tutorials = await readTutorials();
    tutorials = tutorials.filter((t: Tutorial) => t.id !== id);
    await writeTutorials(tutorials);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return NextResponse.json({ error: 'Failed to delete tutorial' }, { status: 500 });
  }
} 