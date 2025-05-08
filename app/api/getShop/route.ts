import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });
const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

export async function GET() {
  try {
    const key = 'data/shop.json';
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    const json = await Body.transformToString();
    const { shopItems } = JSON.parse(json);
    return NextResponse.json({ shopItems });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shop data' }, { status: 500 });
  }
} 