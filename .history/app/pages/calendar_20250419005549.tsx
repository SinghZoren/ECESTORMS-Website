'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { bebasNeue } from '../fonts';
import { EventSourceInput, EventContentArg } from '@fullcalendar/core';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  description: string;
  location: string;
  time: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/getCalendar');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const upcomingEvents = events
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  const eventContent = (eventInfo: EventContentArg) => {
    return (
      <div className="group relative">
        <div>{eventInfo.event.title}</div>
        <div className="hidden group-hover:block fixed z-[9999] bg-white p-4 rounded-lg shadow-xl border border-gray-200 min-w-[300px] max-w-[400px]" 
             style={{
               left: `${eventInfo.el.getBoundingClientRect().left}px`,
               top: `${eventInfo.el.getBoundingClientRect().bottom + window.scrollY + 5}px`
             }}>
          {/* Arrow pointer */}
          <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 bg-white border-t border-l border-gray-200"></div>
          
          <div className="relative">
            <h3 className="font-bold text-lg mb-2">{eventInfo.event.title}</h3>
            <p className="text-gray-600 mb-1">{eventInfo.event.extendedProps.time}</p>
            <p className="text-gray-600 mb-2">📍 {eventInfo.event.extendedProps.location}</p>
            <p className="text-gray-700">{eventInfo.event.extendedProps.description}</p>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#4A154B] pt-24 text-white text-center">
        Loading calendar...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#4A154B] pt-24 text-white text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4A154B] pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className={`${bebasNeue.className} text-4xl md:text-5xl text-white mb-8 text-center`}>
          ECESTORMS Calendar
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              editable={false}
              selectable={false}
              dayMaxEvents={true}
              events={events as EventSourceInput}
              eventContent={eventContent}
              height="auto"
              slotMinTime="08:00:00"
              slotMaxTime="21:00:00"
              eventDisplay="block"
              displayEventEnd={true}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
              }}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className={`${bebasNeue.className} text-2xl text-[#4A154B] mb-4`}>
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border-l-4 border-[#931cf5] pl-4">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-gray-600">{event.time}</p>
                    <p className="text-gray-600">📍 {event.location}</p>
                    <p className="text-gray-500 mt-1">{event.description}</p>
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