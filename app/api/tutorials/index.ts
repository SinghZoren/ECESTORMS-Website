import { NextApiRequest, NextApiResponse } from 'next';
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
}

function readTutorials(): Tutorial[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeTutorials(tutorials: Tutorial[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(tutorials, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const tutorials = readTutorials();
    return res.status(200).json({ tutorials });
  }

  if (req.method === 'POST') {
    const tutorials = readTutorials();
    const newTutorial: Tutorial = { ...req.body, id: Date.now().toString() };
    tutorials.push(newTutorial);
    writeTutorials(tutorials);
    return res.status(201).json({ tutorial: newTutorial });
  }

  if (req.method === 'PUT') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    let tutorials = readTutorials();
    tutorials = tutorials.map(t => t.id === id ? { ...t, ...req.body } : t);
    writeTutorials(tutorials);
    return res.status(200).json({ tutorial: req.body });
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