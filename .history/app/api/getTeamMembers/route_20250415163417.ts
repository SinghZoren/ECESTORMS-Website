import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the file content
    const filePath = path.join(process.cwd(), 'app/data/teamMembers.ts');
    const content = await fs.readFile(filePath, 'utf8');
    
    // Extract the team members data using a more robust regex
    const teamMembersMatch = content.match(/export\s+const\s+defaultTeamMembers\s*=\s*(\[\s*{[\s\S]*?\}\s*\]);/);
    
    if (!teamMembersMatch || !teamMembersMatch[1]) {
      // Log the content for debugging
      console.log('Content of the file:', content.substring(0, 500) + '...');
      throw new Error('Failed to extract team members data');
    }
    
    // Replace export keywords and convert to JSON
    const dataStr = teamMembersMatch[1].replace(/export\s+/g, '');
    
    // Parse the string as JSON
    try {
      // Use a safer approach by first stringifying the evaluated object
      const teamMembersObj = Function(`'use strict'; return ${dataStr}`)();
      const teamMembers = JSON.parse(JSON.stringify(teamMembersObj));
      
      return NextResponse.json({ teamMembers }, { status: 200 });
    } catch (parseError) {
      console.error('Error parsing team members data:', parseError);
      throw new Error('Failed to parse team members data');
    }
  } catch (error) {
    console.error('Error reading team members:', error);
    return NextResponse.json(
      { error: 'Failed to read team members data', details: error.message },
      { status: 500 }
    );
  }
} 