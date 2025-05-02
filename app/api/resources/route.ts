import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink, rmdir, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const RESOURCES_DIR = join(process.cwd(), 'public', 'resources');

// Ensure resources directory exists
if (!existsSync(RESOURCES_DIR)) {
  await mkdir(RESOURCES_DIR, { recursive: true });
}

interface Resource {
  id: string;
  name: string;
  type: 'file' | 'folder';
  courseCode: string;
  parentId: string | null;
  fileUrl?: string;
  children?: Resource[];
}

async function getResources(dir: string, courseCode: string, parentId: string | null = null): Promise<Resource[]> {
  try {
    const items = await readdir(dir);
    const resources: Resource[] = [];

    for (const item of items) {
      const path = join(dir, item);
      const stats = await stat(path);
      const isDirectory = stats.isDirectory();

      // Create a clean name without timestamp for display
      const displayName = item.includes('-') ? item.split('-').slice(1).join('-') : item;

      const resource: Resource = {
        id: item, // Keep the full filename as ID
        name: displayName, // Use clean name for display
        type: isDirectory ? 'folder' : 'file',
        courseCode,
        parentId,
        fileUrl: isDirectory ? undefined : `/resources/${courseCode}/${parentId ? `${parentId}/` : ''}${item}`,
      };

      if (isDirectory) {
        resource.children = await getResources(path, courseCode, resource.id);
      }

      resources.push(resource);
    }

    return resources;
  } catch (error) {
    console.error('Error in getResources:', error);
    return [];
  }
}

// GET /api/resources?courseCode=XXX
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get('courseCode');

    if (!courseCode) {
      return NextResponse.json({ error: 'Course code is required' }, { status: 400 });
    }

    const courseDir = join(RESOURCES_DIR, courseCode);
    
    // Create course directory if it doesn't exist
    if (!existsSync(courseDir)) {
      await mkdir(courseDir, { recursive: true });
      return NextResponse.json({ resources: [] });
    }

    const resources = await getResources(courseDir, courseCode);
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

    const courseDir = join(RESOURCES_DIR, courseCode);
    if (!existsSync(courseDir)) {
      await mkdir(courseDir, { recursive: true });
    }

    // If parentId is provided, upload to the parent folder
    let uploadDir = courseDir;
    if (parentId) {
      const parentPath = join(courseDir, parentId);
      if (!existsSync(parentPath)) {
        return NextResponse.json({ error: 'Parent folder not found' }, { status: 404 });
      }
      uploadDir = parentPath;
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({
      id: fileName,
      name: file.name,
      type: 'file',
      courseCode,
      parentId,
      fileUrl: `/resources/${courseCode}/${parentId ? `${parentId}/` : ''}${fileName}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

// DELETE /api/resources
export async function DELETE(request: Request) {
  try {
    const { type, courseCode, parentId, resourceId } = await request.json();

    if (!resourceId || !courseCode) {
      return NextResponse.json({ error: 'Resource ID and course code are required' }, { status: 400 });
    }

    // Construct the resource path
    const courseDir = join(RESOURCES_DIR, courseCode);
    let resourcePath;
    
    if (parentId) {
      // For nested resources
      resourcePath = join(courseDir, parentId, resourceId);
    } else {
      // For root resources
      resourcePath = join(courseDir, resourceId);
    }

    console.log('Attempting to delete resource:', {
      type,
      courseCode,
      parentId,
      resourceId,
      fullPath: resourcePath
    });

    // Check if resource exists
    if (!existsSync(resourcePath)) {
      console.error('Resource not found at path:', resourcePath);
      return NextResponse.json({ 
        error: `Resource not found at path: ${resourcePath}`,
        details: {
          type,
          courseCode,
          parentId,
          resourceId,
          fullPath: resourcePath
        }
      }, { status: 404 });
    }

    // Delete the resource
    try {
      if (type === 'file') {
        await unlink(resourcePath);
      } else {
        await rmdir(resourcePath, { recursive: true });
      }
      console.log('Successfully deleted resource at:', resourcePath);
    } catch (deleteError) {
      console.error('Error during deletion:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete resource'
    }, { status: 500 });
  }
} 