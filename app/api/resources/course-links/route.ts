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

interface CourseLink {
  courseCode: string;
  linkUrl: string;
}

interface CourseLinksData {
  links: CourseLink[];
}

// Helper function to get existing course links
async function getCourseLinks(): Promise<CourseLinksData> {
  if (!BUCKET_NAME) {
    return { links: [] };
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'data/courseLinks.json',
    });
    
    const response = await s3Client.send(command);
    const bodyContent = await response.Body?.transformToString();
    
    if (bodyContent) {
      return JSON.parse(bodyContent);
    }
  } catch (error) {
    console.log('No existing course links file found, starting fresh');
  }
  
  return { links: [] };
}

// Helper function to save course links
async function saveCourseLinks(data: CourseLinksData): Promise<void> {
  if (!BUCKET_NAME) {
    throw new Error('AWS_BUCKET_NAME not configured');
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: 'data/courseLinks.json',
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json',
  });
  
  await s3Client.send(command);
}

// GET - Retrieve course links
export async function GET() {
  try {
    if (!BUCKET_NAME) {
      return NextResponse.json({ error: 'AWS_BUCKET_NAME not configured' }, { status: 500 });
    }

    const courseLinksData = await getCourseLinks();
    return NextResponse.json(courseLinksData);
  } catch (error) {
    console.error('Error fetching course links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course links' },
      { status: 500 }
    );
  }
}

// POST - Update course link
export async function POST(request: Request) {
  try {
    if (!BUCKET_NAME) {
      return NextResponse.json({ error: 'AWS_BUCKET_NAME not configured' }, { status: 500 });
    }

    const { courseCode, linkUrl } = await request.json();

    if (!courseCode || !linkUrl) {
      return NextResponse.json(
        { error: 'Course code and link URL are required' },
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

    const courseLinksData = await getCourseLinks();
    
    // Remove any existing link for this course
    courseLinksData.links = courseLinksData.links.filter(
      link => link.courseCode !== courseCode
    );
    
    // Add the new link
    courseLinksData.links.push({ courseCode, linkUrl });
    
    await saveCourseLinks(courseLinksData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating course link:', error);
    return NextResponse.json(
      { error: 'Failed to update course link' },
      { status: 500 }
    );
  }
}

// DELETE - Remove course link
export async function DELETE(request: Request) {
  try {
    if (!BUCKET_NAME) {
      return NextResponse.json({ error: 'AWS_BUCKET_NAME not configured' }, { status: 500 });
    }

    const { courseCode } = await request.json();

    if (!courseCode) {
      return NextResponse.json(
        { error: 'Course code is required' },
        { status: 400 }
      );
    }

    const courseLinksData = await getCourseLinks();
    
    // Remove the link for this course
    courseLinksData.links = courseLinksData.links.filter(
      link => link.courseCode !== courseCode
    );
    
    await saveCourseLinks(courseLinksData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing course link:', error);
    return NextResponse.json(
      { error: 'Failed to remove course link' },
      { status: 500 }
    );
  }
}