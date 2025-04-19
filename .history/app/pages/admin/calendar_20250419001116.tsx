'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { bebasNeue } from '../../fonts';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  description?: string;
}

export default function AdminCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load events from localStorage on mount
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    // Save events to localStorage whenever they change
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const handleDateSelect = (selectInfo: { start: Date; end: Date; allDay: boolean }) => {
    setSelectedEvent({
      id: Date.now().toString(),
      title: '',
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
    });
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: { event: { id: string } }) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleSaveEvent = (eventData: Partial<Event>) => {
    if (selectedEvent) {
      const updatedEvent = { ...selectedEvent, ...eventData };
      if (selectedEvent.id) {
        setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
      } else {
        setEvents([...events, updatedEvent]);
      }
      setIsModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent?.id) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      setIsModalOpen(false);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#4A154B] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className={`${bebasNeue.className} text-4xl md:text-5xl text-white mb-8 text-center`}>
          Manage Calendar Events
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
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

        {/* Event Modal */}
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className={`${bebasNeue.className} text-2xl text-[#4A154B] mb-4`}>
                {selectedEvent.id ? 'Edit Event' : 'New Event'}
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSaveEvent({
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={selectedEvent.title}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      defaultValue={selectedEvent.description}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-[#931cf5] text-white px-4 py-2 rounded-md hover:bg-[#7a16d4]"
                    >
                      Save
                    </button>
                    {selectedEvent.id && (
                      <button
                        type="button"
                        onClick={handleDeleteEvent}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setSelectedEvent(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 