export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'tutorials.json');

interface Tutorial {
  id: string;
  course: string;
  date: string;
  time: string;
  taName: string;
  location: string;
  zoomLink?: string;
  willRecord: boolean;
  willPostNotes: boolean;
  additionalResources?: string[];
  type: 'academic' | 'non-academic';
}

function readTutorials(): Tutorial[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data).map((t: unknown) => {
    const tutorial = t as Partial<Tutorial>;
    return { ...tutorial, type: tutorial.type || 'academic' } as Tutorial;
  });
}

function writeTutorials(tutorials: Tutorial[]) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(tutorials, null, 2));
}

async function handler(req: Request) {
  try {
    const method = req.method;
    if (method === 'GET') {
      const tutorials = readTutorials();
      return new Response(JSON.stringify({ tutorials }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (method === 'POST') {
      const tutorials = readTutorials();
      const body = await req.json();
      const newTutorial: Tutorial = { ...body, id: Date.now().toString(), type: body.type || 'academic' };
      tutorials.push(newTutorial);
      writeTutorials(tutorials);
      return new Response(JSON.stringify({ tutorial: newTutorial }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

    if (method === 'PUT') {
      const body = await req.json();
      const { id } = body;
      if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
      let tutorials = readTutorials();
      tutorials = tutorials.map(t => t.id === id ? { ...t, ...body, type: body.type || t.type || 'academic' } : t);
      writeTutorials(tutorials);
      return new Response(JSON.stringify({ tutorial: body }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (method === 'DELETE') {
      const body = await req.json();
      const { id } = body;
      if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
      let tutorials = readTutorials();
      tutorials = tutorials.filter(t => t.id !== id);
      writeTutorials(tutorials);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }; 