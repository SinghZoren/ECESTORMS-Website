import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });
const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    const key = `events/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: file.type,
    }));
    const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading event image:', error);
    return NextResponse.json({ error: 'Failed to upload event image' }, { status: 500 });
  }
} 