import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    externalResolver: false,
    bodyParser: true,
  },
};

const DATA_PATH = path.join(process.cwd(), 'data', 'tutorials.json');

type TutorialType = 'academic' | 'non-academic';

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
  type: TutorialType;
}

function readTutorials(): Tutorial[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  try {
    const parsed = JSON.parse(data);
    const tutorials = Array.isArray(parsed?.tutorials) ? parsed.tutorials : Array.isArray(parsed) ? parsed : [];
    return tutorials.map(normalizeTutorial);
  } catch {
    return [];
  }
}

function writeTutorials(tutorials: Tutorial[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify({ tutorials: tutorials.map(normalizeTutorial) }, null, 2));
}

function normalizeTutorial(raw: Partial<Tutorial>): Tutorial {
  return {
    id: raw.id || Date.now().toString(),
    course: raw.course || 'TBA',
    date: raw.date || '',
    time: raw.time || '',
    taName: raw.taName || 'TBA',
    location: raw.location || 'TBA',
    zoomLink: raw.zoomLink,
    willRecord: Boolean(raw.willRecord),
    willPostNotes: Boolean(raw.willPostNotes),
    additionalResources: Array.isArray(raw.additionalResources)
      ? raw.additionalResources
      : typeof raw.additionalResources === 'string'
        ? raw.additionalResources.split(',').map(r => r.trim()).filter(Boolean)
        : [],
    type: raw.type === 'non-academic' ? 'non-academic' : 'academic',
  } satisfies Tutorial;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const tutorials = readTutorials();
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(200).json({ tutorials });
  }

  if (req.method === 'POST') {
    const tutorials = readTutorials();
    const newTutorial: Tutorial = normalizeTutorial({ ...req.body, id: Date.now().toString() });
    tutorials.push(newTutorial);
    writeTutorials(tutorials);
    return res.status(201).json({ tutorial: newTutorial });
  }

  if (req.method === 'PUT') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    let tutorials = readTutorials();
    tutorials = tutorials.map(t => t.id === id ? normalizeTutorial({ ...t, ...req.body, id }) : t);
    writeTutorials(tutorials);
    const updated = tutorials.find(t => t.id === id);
    return res.status(200).json({ tutorial: updated });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    let tutorials = readTutorials();
    tutorials = tutorials.filter(t => t.id !== id);
    writeTutorials(tutorials);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 