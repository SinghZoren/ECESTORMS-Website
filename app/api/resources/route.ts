import { NextResponse } from 'next/server';
import { listObjects, uploadFileToS3, deleteFileFromS3 } from '@/app/utils/s3';

// GET /api/resources?courseCode=XXX
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get('courseCode');
    if (!courseCode) {
      return NextResponse.json({ error: 'Course code is required' }, { status: 400 });
    }
    const resources = await listObjects(`${courseCode}/`);
    return NextResponse.json({ resources });
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