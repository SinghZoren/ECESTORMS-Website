import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/app/utils/s3Client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const memberId = formData.get('memberId') as string;
    
    if (!file || !memberId) {
      console.error('Missing file or memberId:', { file: !!file, memberId });
      return NextResponse.json(
        { error: 'File or member ID is missing' },
        { status: 400 }
      );
    }

    console.log('Uploading file:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      memberId,
      bucket: BUCKET_NAME,
      region: process.env.AWS_REGION
    });

    const fileExtension = file.name.split('.').pop();
    const key = `team/${memberId}.${fileExtension}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    try {
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: file.type,
      }));
    } catch (s3Error) {
      console.error('S3 Upload Error:', {
        error: s3Error,
        bucket: BUCKET_NAME,
        key,
        region: process.env.AWS_REGION
      });
      throw s3Error;
    }
    
    const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    console.log('Successfully uploaded image:', imageUrl);
    
    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error uploading image:', {
      error,
      bucket: BUCKET_NAME,
      region: process.env.AWS_REGION,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
    });
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to upload image', details: errorMessage },
      { status: 500 }
    );
  }
} 