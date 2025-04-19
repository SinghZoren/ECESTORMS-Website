'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { bebasNeue } from '../fonts';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  description?: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Load events from localStorage
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
      setEvents(parsedEvents);
    }
  }, []);

  const handleDateSelect = (selectInfo: { start: Date; end: Date; allDay: boolean }) => {
    // Read-only for non-admin users
  };

  const handleEventClick = (clickInfo: { event: { id: string } }) => {
    // Read-only for non-admin users
  };

  const upcomingEvents = events
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#4A154B] pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className={`${bebasNeue.className} text-4xl md:text-5xl text-white mb-8 text-center`}>
          ECESTORMS Calendar
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView="dayGridMonth"
              editable={false}
              selectable={false}
              selectMirror={true}
              dayMaxEvents={true}
              events={events}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="auto"
            />
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className={`${bebasNeue.className} text-2xl text-[#4A154B] mb-4`}>
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border-l-4 border-[#931cf5] pl-4">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-gray-600">
                      {format(new Date(event.start), 'MMM d, yyyy h:mm a')}
                    </p>
                    {event.description && (
                      <p className="text-gray-500 mt-1">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 