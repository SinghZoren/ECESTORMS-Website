'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { bebasNeue } from '../fonts';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';

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
  const [isAdmin] = useState(false); // For now, hardcoded to false. Will be updated with actual admin check later

  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents).map((event: Event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error parsing stored events:', error);
      }
    }
  }, []);

  const handleDateSelect = async (selectInfo: DateSelectArg) => {
    if (!isAdmin) return;
    
    const title = prompt('Please enter a title for your event');
    if (!title) return;

    const description = prompt('Please enter a description (optional)');

    const newEvent: Event = {
      id: String(Date.now()),
      title,
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
      description: description || undefined
    };

    // Update state first for immediate feedback
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    try {
      // Save to localStorage
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));

      // Optional: Save to API
      const response = await fetch('/api/updateCalendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: updatedEvents }),
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      // Revert state if save failed
      setEvents(events);
      alert('Failed to save event. Please try again.');
    }
  };

  const handleEventClick = async (clickInfo: EventClickArg) => {
    if (!isAdmin) return;
    
    if (confirm('Would you like to delete this event?')) {
      const updatedEvents = events.filter(event => event.id !== clickInfo.event.id);
      
      try {
        // Update state first for immediate feedback
        setEvents(updatedEvents);
        
        // Save to localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));

        // Optional: Save to API
        const response = await fetch('/api/updateCalendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ events: updatedEvents }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        // Revert state if delete failed
        setEvents(events);
        alert('Failed to delete event. Please try again.');
      }
    }
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
              editable={isAdmin}
              selectable={isAdmin}
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