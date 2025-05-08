import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

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

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
const KEY = 'data/tutorials.json';

async function readTutorials(): Promise<Tutorial[]> {
  try {
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: KEY,
    }));
    if (!Body) return [];
    const json = await Body.transformToString();
    const parsed = JSON.parse(json);
    return Array.isArray(parsed.tutorials) ? parsed.tutorials as Tutorial[] : [];
  } catch {
    return [];
  }
}

async function writeTutorials(tutorials: Tutorial[]) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: KEY,
    Body: JSON.stringify({ tutorials }, null, 2),
    ContentType: 'application/json',
  }));
}

export async function GET() {
  try {
    const tutorials = await readTutorials();
    return NextResponse.json({ tutorials });
  } catch (error) {
    console.error('Error reading tutorials:', error);
    return NextResponse.json({ tutorials: [], error: 'Failed to fetch tutorials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tutorials = await readTutorials();
    const newTutorial: Tutorial = { ...body, id: Date.now().toString(), type: body.type || 'academic' };
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
    tutorials = tutorials.map((t: unknown) => {
      const tut = t as Tutorial;
      return tut.id === id ? { ...tut, ...body, type: body.type || tut.type || 'academic' } : tut;
    });
    await writeTutorials(tutorials);
    return NextResponse.json({ tutorial: body });
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
    tutorials = tutorials.filter((t: unknown) => {
      const tut = t as Tutorial;
      return tut.id !== id;
    });
    await writeTutorials(tutorials);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return NextResponse.json({ error: 'Failed to delete tutorial' }, { status: 500 });
  }
} 