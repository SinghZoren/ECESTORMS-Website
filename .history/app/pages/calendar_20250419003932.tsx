'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { bebasNeue } from '../fonts';
import { DateSelectArg, EventClickArg, EventSourceInput } from '@fullcalendar/core';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  description?: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAdmin] = useState(true);
  const [message, setMessage] = useState('');
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

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDateSelect = async (selectInfo: DateSelectArg) => {
    if (!isAdmin) return;
    
    const title = prompt('Please enter a title for your event');
    if (!title) return;

    const description = prompt('Please enter a description (optional)');

    const newEvent: CalendarEvent = {
      id: String(Date.now()),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      description: description || undefined
    };

    try {
      const updatedEvents = [...events, newEvent];
      
      // Update API
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

      // Update local state
      setEvents(updatedEvents);
      showMessage('Event added successfully!');
      
      // Force calendar to unselect the date
      selectInfo.view.calendar.unselect();
    } catch (error) {
      console.error('Error saving event:', error);
      showMessage('Failed to save event. Please try again.');
    }
  };

  const handleEventClick = async (clickInfo: EventClickArg) => {
    if (!isAdmin) return;
    
    if (confirm('Would you like to delete this event?')) {
      try {
        const updatedEvents = events.filter(event => event.id !== clickInfo.event.id);
        
        // Update API
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

        // Update local state
        setEvents(updatedEvents);
        showMessage('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        showMessage('Failed to delete event. Please try again.');
      }
    }
  };

  const upcomingEvents = events
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

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
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {message}
          </div>
        )}
        
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
              editable={isAdmin}
              selectable={isAdmin}
              selectMirror={true}
              dayMaxEvents={true}
              events={events as EventSourceInput}
              select={handleDateSelect}
              eventClick={handleEventClick}
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