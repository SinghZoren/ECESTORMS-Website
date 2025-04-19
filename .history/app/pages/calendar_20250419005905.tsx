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
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: CalendarEvent | null;
  }>({ x: 0, y: 0, content: null });

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
    const eventData = eventInfo.event.extendedProps as CalendarEvent;

    return (
      <div
        className="relative z-10"
        onMouseEnter={(e) => {
          setTooltip({
            x: e.clientX,
            y: e.clientY,
            content: {
              id: eventInfo.event.id,
              title: eventInfo.event.title,
              start: eventInfo.event.startStr,
              end: eventInfo.event.endStr,
              allDay: eventInfo.event.allDay,
              description: eventData.description,
              location: eventData.location,
              time: eventData.time,
            },
          });
        }}
        onMouseMove={(e) => {
          setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
        }}
        onMouseLeave={() => {
          setTooltip({ x: 0, y: 0, content: null });
        }}
      >
        <div className="text-sm font-medium">{eventInfo.event.title}</div>
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
    <div className="min-h-screen bg-[#4A154B] pt-24 relative">
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
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
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
                meridiem: 'short',
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

      {/* Hover Tooltip */}
      {tooltip.content && (
        <div
          className="fixed z-[9999] bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-[250px] pointer-events-none transition-all"
          style={{
            top: tooltip.y + 20,
            left: tooltip.x,
          }}
        >
          <div className="font-bold text-lg mb-1">{tooltip.content.title}</div>
          <p className="text-gray-600">{tooltip.content.time}</p>
          <p className="text-gray-600">📍 {tooltip.content.location}</p>
          <p className="text-gray-700">{tooltip.content.description}</p>
        </div>
      )}
    </div>
  );
}
