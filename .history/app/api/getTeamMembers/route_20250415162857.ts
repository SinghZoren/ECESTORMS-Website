import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the file content
    const filePath = path.join(process.cwd(), 'app/data/teamMembers.ts');
    const content = await fs.readFile(filePath, 'utf8');
    
    // Extract the team members data using regex
    const teamMembersMatch = content.match(/defaultTeamMembers\s*=\s*(\[[\s\S]*?\]);/);
    
    if (!teamMembersMatch || !teamMembersMatch[1]) {
      throw new Error('Failed to extract team members data');
    }
    
    // Replace export keywords and convert to JSON
    const dataStr = teamMembersMatch[1].replace(/export\s+/g, '');
    
    // Evaluate the string (safer than using eval directly)
    const teamMembers = Function(`'use strict'; return ${dataStr}`)();
    
    return NextResponse.json({ teamMembers }, { status: 200 });
  } catch (error) {
    console.error('Error reading team members:', error);
    return NextResponse.json(
      { error: 'Failed to read team members data' },
      { status: 500 }
    );
  }
} 