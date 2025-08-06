import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';

interface FolderLink {
  courseCode: string;
  folderId: string;
  linkUrl: string;
}

interface FolderLinksData {
  links: FolderLink[];
}

// Helper function to get existing folder links
async function getFolderLinks(): Promise<FolderLinksData> {
  if (!BUCKET_NAME) {
    return { links: [] };
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'data/folderLinks.json',
    });
    
    const response = await s3Client.send(command);
    const bodyContent = await response.Body?.transformToString();
    
    if (bodyContent) {
      return JSON.parse(bodyContent);
    }
  } catch (error) {
    console.log('No existing folder links file found, starting fresh');
  }
  
  return { links: [] };
}

// Helper function to save folder links
async function saveFolderLinks(data: FolderLinksData): Promise<void> {
  if (!BUCKET_NAME) {
    throw new Error('AWS_BUCKET_NAME not configured');
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: 'data/folderLinks.json',
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json',
  });
  
  await s3Client.send(command);
}

// GET - Retrieve folder links
export async function GET() {
  try {
    if (!BUCKET_NAME) {
      return NextResponse.json({ error: 'AWS_BUCKET_NAME not configured' }, { status: 500 });
    }

    const folderLinksData = await getFolderLinks();
    return NextResponse.json(folderLinksData);
  } catch (error) {
    console.error('Error fetching folder links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folder links' },
      { status: 500 }
    );
  }
}

// POST - Update folder link
export async function POST(request: Request) {
  try {
    if (!BUCKET_NAME) {
      return NextResponse.json({ error: 'AWS_BUCKET_NAME not configured' }, { status: 500 });
    }

    const { courseCode, folderId, linkUrl } = await request.json();

    if (!courseCode || !folderId || !linkUrl) {
      return NextResponse.json(
        { error: 'Course code, folder ID, and link URL are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(linkUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const folderLinksData = await getFolderLinks();
    
    // Remove any existing link for this folder
    folderLinksData.links = folderLinksData.links.filter(
      link => !(link.courseCode === courseCode && link.folderId === folderId)
    );
    
    // Add the new link
    folderLinksData.links.push({ courseCode, folderId, linkUrl });
    
    await saveFolderLinks(folderLinksData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating folder link:', error);
    return NextResponse.json(
      { error: 'Failed to update folder link' },
      { status: 500 }
    );
  }
}

// DELETE - Remove folder link
export async function DELETE(request: Request) {
  try {
    if (!BUCKET_NAME) {
      return NextResponse.json({ error: 'AWS_BUCKET_NAME not configured' }, { status: 500 });
    }

    const { courseCode, folderId } = await request.json();

    if (!courseCode || !folderId) {
      return NextResponse.json(
        { error: 'Course code and folder ID are required' },
        { status: 400 }
      );
    }

    const folderLinksData = await getFolderLinks();
    
    // Remove the link for this folder
    folderLinksData.links = folderLinksData.links.filter(
      link => !(link.courseCode === courseCode && link.folderId === folderId)
    );
    
    await saveFolderLinks(folderLinksData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing folder link:', error);
    return NextResponse.json(
      { error: 'Failed to remove folder link' },
      { status: 500 }
    );
  }
}