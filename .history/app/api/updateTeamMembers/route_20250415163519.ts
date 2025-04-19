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
    
    // Create a new file content with the updated team members
    const updatedContent = `export interface TeamMember {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
  linkedinUrl?: string;
  section: 'presidents' | 'vps' | 'directors' | 'yearReps';
}

// Export team members data in a format that's easy to extract with regex
export const defaultTeamMembers: TeamMember[] = ${JSON.stringify(teamMembers, null, 2)};

// Current team members (reference to the default ones)
export const teamMembers = defaultTeamMembers;`;
    
    // Write the updated content back to the file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating team members:', error);
    return NextResponse.json(
      { error: 'Failed to update team members data', details: error.message },
      { status: 500 }
    );
  }
} 