'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  description: string;
  location: string;
  time: string;  // For displaying specific time like "2:00 PM - 4:00 PM"
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (events: Event[]) => void;
}

export default function CalendarModal({ isOpen, onClose, onSave }: CalendarModalProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Handle escape key for event modal
  const handleEventModalClose = useCallback(() => {
    if (isEventModalOpen) {
      setIsEventModalOpen(false);
      setSelectedEvent(null);
    }
  }, [isEventModalOpen]);

  useEscapeKey(handleEventModalClose);

  // Handle escape key for main modal
  useEscapeKey(() => {
    if (isOpen && !isEventModalOpen) {
      onClose();
    }
  });

  // Load events from API on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/getCalendar');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };
    
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  const handleDateSelect = (selectInfo: { startStr: string; endStr: string; allDay: boolean }) => {
    setSelectedEvent({
      id: Date.now().toString(),
      title: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      description: '',
      location: '',
      time: ''
    });
    setIsEventModalOpen(true);
  };

  const handleEventClick = (clickInfo: { event: { id: string } }) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsEventModalOpen(true);
    }
  };

  const handleSaveEvent = (eventData: { title: string; description: string; location: string; time: string }) => {
    if (selectedEvent) {
      const updatedEvent: Event = {
        ...selectedEvent,
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        time: eventData.time
      };

      // Update events array with new/updated event
      const newEvents = events.map(e => e.id === selectedEvent.id ? updatedEvent : e);
      if (!events.some(e => e.id === selectedEvent.id)) {
        newEvents.push(updatedEvent);
      }

      setEvents(newEvents);
      setIsEventModalOpen(false);
      setSelectedEvent(null);

      // Save to API immediately when an event is added/updated
      saveEventsToAPI(newEvents);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent?.id) {
      const newEvents = events.filter(e => e.id !== selectedEvent.id);
      setEvents(newEvents);
      setIsEventModalOpen(false);
      setSelectedEvent(null);

      // Save to API immediately when an event is deleted
      saveEventsToAPI(newEvents);
    }
  };

  const saveEventsToAPI = async (eventsToSave: Event[]) => {
    try {
      const response = await fetch('/api/updateCalendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSave }),
      });

      if (!response.ok) {
        throw new Error('Failed to save events');
      }
    } catch (error) {
      console.error('Error saving events:', error);
      alert('Failed to save events. Please try again.');
    }
  };

  const handleSave = () => {
    // Just close the modal since events are saved immediately
    onSave(events);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Manage Calendar Events</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={`mb-4 ${isEventModalOpen ? 'pointer-events-none' : ''}`}>
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
              right: 'dayGridMonth',
            }}
            height="auto"
          />
        </div>

        <div className={`flex justify-end space-x-4 ${isEventModalOpen ? 'pointer-events-none' : ''}`}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#931cf5] text-white rounded-md hover:bg-[#7a16d4]"
          >
            Save Changes
          </button>
        </div>

        {/* Event Modal */}
        {isEventModalOpen && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full m-4 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {selectedEvent.id ? 'Edit Event' : 'New Event'}
                </h3>
                <button
                  onClick={() => {
                    setIsEventModalOpen(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSaveEvent({
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  location: formData.get('location') as string,
                  time: formData.get('time') as string,
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
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                      type="text"
                      name="time"
                      defaultValue={selectedEvent.time}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={selectedEvent.location}
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
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
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
                        setIsEventModalOpen(false);
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