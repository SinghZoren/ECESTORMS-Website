import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  description?: string;
}

interface UpdateCalendarRequest {
  events: CalendarEvent[];
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as UpdateCalendarRequest;

    // Validate events array exists
    if (!data.events || !Array.isArray(data.events)) {
      return NextResponse.json({ error: 'Invalid events data' }, { status: 400 });
    }

    // Validate each event has required properties
    const isValidEvent = (event: Partial<CalendarEvent>): event is CalendarEvent => {
      return (
        typeof event.id === 'string' &&
        typeof event.title === 'string' &&
        typeof event.start === 'string' &&
        typeof event.end === 'string' &&
        typeof event.allDay === 'boolean'
      );
    };

    if (!data.events.every(isValidEvent)) {
      return NextResponse.json({ error: 'Invalid event format' }, { status: 400 });
    }

    // Write to file
    const filePath = path.join(process.cwd(), 'app/data/calendar.json');
    await fs.writeFile(
      filePath,
      JSON.stringify({ events: data.events }, null, 2),
      'utf8'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating calendar:', error);
    return NextResponse.json(
      { error: 'Failed to update calendar' },
      { status: 500 }
    );
  }
} 