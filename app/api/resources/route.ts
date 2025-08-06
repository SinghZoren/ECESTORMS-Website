import { NextResponse } from 'next/server';
import { listObjects, uploadFileToS3, deleteFileFromS3 } from '@/app/utils/s3';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

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
  } catch {
    console.log('No existing folder links file found');
  }
  
  return { links: [] };
}

// GET /api/resources?courseCode=XXX
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get('courseCode');
    if (!courseCode) {
      return NextResponse.json({ error: 'Course code is required' }, { status: 400 });
    }
    
    // Get base resources
    const resources = await listObjects(`${courseCode}/`);
    
    // Get folder links and merge them
    const folderLinksData = await getFolderLinks();
    const resourcesWithLinks = resources.map(resource => {
      if (resource.type === 'folder') {
        const folderLink = folderLinksData.links.find(
          link => link.courseCode === courseCode && link.folderId === resource.id
        );
        if (folderLink) {
          return { ...resource, linkUrl: folderLink.linkUrl };
        }
      }
      return resource;
    });
    
    return NextResponse.json({ resources: resourcesWithLinks });
  } catch (error) {
    console.error('Error in GET /api/resources:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch resources',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/resources
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const courseCode = formData.get('courseCode') as string;
    const parentId = formData.get('parentId') as string | null;
    const file = formData.get('file') as File;
    if (!courseCode || !file) {
      return NextResponse.json({ error: 'Course code and file are required' }, { status: 400 });
    }
    const key = parentId
      ? `${courseCode}/${parentId}/${file.name}`
      : `${courseCode}/${file.name}`;
    const fileUrl = await uploadFileToS3(file, key);
    return NextResponse.json({
      id: file.name,
      name: file.name,
      type: 'file',
      courseCode,
      parentId,
      fileUrl
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

async function deleteFolderRecursively(courseCode: string, parentId: string | null, resourceId: string) {
  const key = parentId ? `${courseCode}/${parentId}/${resourceId}` : `${courseCode}/${resourceId}`;
  const folderPrefix = `${key}/`;
  const folderContents = await listObjects(folderPrefix);
  for (const item of folderContents) {
    if (item.type === 'file' && item.fileUrl) {
      const itemKey = item.fileUrl.split('.com/')[1];
      await deleteFileFromS3(itemKey);
    } else if (item.type === 'folder') {
      await deleteFolderRecursively(courseCode, resourceId, item.id);
    }
  }
  await deleteFileFromS3(key);
}

// DELETE /api/resources
export async function DELETE(request: Request) {
  try {
    const { type, courseCode, parentId, resourceId } = await request.json();
    if (!resourceId || !courseCode) {
      return NextResponse.json({ error: 'Resource ID and course code are required' }, { status: 400 });
    }
    
    // If deleting a folder, recursively delete all objects with that prefix
    if (type === 'folder') {
      await deleteFolderRecursively(courseCode, parentId, resourceId);
      
      // Also remove any folder link for this folder
      try {
        const folderLinksData = await getFolderLinks();
        folderLinksData.links = folderLinksData.links.filter(
          link => !(link.courseCode === courseCode && link.folderId === resourceId)
        );
        
        // Save updated folder links
        const { PutObjectCommand } = await import('@aws-sdk/client-s3');
        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: 'data/folderLinks.json',
          Body: JSON.stringify(folderLinksData, null, 2),
          ContentType: 'application/json',
        });
        await s3Client.send(command);
      } catch (linkError) {
        console.error('Error removing folder link:', linkError);
        // Don't fail the deletion if link removal fails
      }
    } else {
      const key = parentId ? `${courseCode}/${parentId}/${resourceId}` : `${courseCode}/${resourceId}`;
      await deleteFileFromS3(key);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete resource'
    }, { status: 500 });
  }
} 