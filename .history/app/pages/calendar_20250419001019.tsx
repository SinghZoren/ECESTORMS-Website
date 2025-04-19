'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { bebasNeue } from '../fonts';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const handleDateSelect = (selectInfo: { start: Date; end: Date; allDay: boolean }) => {
    const title = prompt('Please enter a title for your event');
    if (title) {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          title,
          start: selectInfo.start,
          end: selectInfo.end,
          allDay: selectInfo.allDay,
        },
      ]);
    }
  };

  const handleEventClick = (clickInfo: { event: { id: string } }) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== clickInfo.event.id));
    }
  };

  const upcomingEvents = events
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#4A154B] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className={`${bebasNeue.className} text-4xl md:text-5xl text-white mb-8 text-center`}>
          ECESTORMS Calendar
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              events={events}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay',
              }}
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