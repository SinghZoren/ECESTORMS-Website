import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { teamMembers } = await request.json();
    
    if (!teamMembers || !Array.isArray(teamMembers)) {
      return NextResponse.json(
        { error: 'Invalid team members data' },
        { status: 400 }
      );
    }
    
    // Read the file content first
    const filePath = path.join(process.cwd(), 'app/data/teamMembers.ts');
    const content = await fs.readFile(filePath, 'utf8');
    
    // Create new file content with updated team members
    const updatedContent = content.replace(
      /export const defaultTeamMembers: TeamMember\[\] = \[[\s\S]*?\];/,
      `export const defaultTeamMembers: TeamMember[] = ${JSON.stringify(teamMembers, null, 2)};`
    );
    
    // Write the updated content back to the file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating team members:', error);
    return NextResponse.json(
      { error: 'Failed to update team members data' },
      { status: 500 }
    );
  }
} 