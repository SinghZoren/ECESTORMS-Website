'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [tooltipData, setTooltipData] = useState<{
    top: number;
    left: number;
    event: CalendarEvent | null;
  }>({ top: 0, left: 0, event: null });

  const calendarRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setTooltipData({ top: 0, left: 0, event: null });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleEventClick = (
    eventInfo: EventContentArg,
    mouseEvent: React.MouseEvent
  ) => {
    mouseEvent.stopPropagation();
    const domRect = (mouseEvent.target as HTMLElement).getBoundingClientRect();
    const extended = eventInfo.event.extendedProps as CalendarEvent;

    setTooltipData({
      top: domRect.top + window.scrollY + 30,
      left: domRect.left + window.scrollX,
      event: {
        id: eventInfo.event.id,
        title: eventInfo.event.title,
        start: eventInfo.event.startStr,
        end: eventInfo.event.endStr,
        allDay: eventInfo.event.allDay,
        description: extended.description,
        location: extended.location,
        time: extended.time,
      },
    });
  };

  const eventContent = (eventInfo: EventContentArg) => {
    return (
      <div
        className="cursor-pointer p-1.5 h-full flex items-center"
        onClick={(e) => handleEventClick(eventInfo, e)}
      >
        <div className="text-sm font-medium">{eventInfo.event.title}</div>
      </div>
    );
  };

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.start);
      const now = new Date();
      // Reset the time part of now to start of day for proper date comparison
      now.setHours(0, 0, 0, 0);
      return eventDate >= now;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  // Format date for display
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time parts for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
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
      <div className="w-[90vw] mx-auto px-4 md:px-8" ref={calendarRef}>
        <h1 className={`${bebasNeue.className} text-4xl md:text-5xl lg:text-6xl text-white mb-8 text-center`}>
          ECESTORMS Calendar
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white shadow-lg p-4 h-[72vh] [&_.fc-view-harness]:!h-[calc(70vh-80px)] [&_.fc-scrollgrid-sync-table]:!h-full [&_.fc-daygrid-body]:!h-full [&_.fc-daygrid-body-balanced]:!h-full [&_.fc-daygrid-body-unbalanced]:!h-full [&_.fc]:h-full">
            <style jsx global>{`
              .fc .fc-daygrid-day-frame {
                min-height: 100% !important;
                height: 100% !important;
              }
              .fc .fc-scrollgrid-sync-table {
                height: 100% !important;
              }
              .fc-theme-standard td {
                height: calc((70vh - 120px) / 6) !important;
              }
              .fc .fc-daygrid-day-events {
                min-height: unset !important;
              }
              .fc-direction-ltr .fc-daygrid-event.fc-event-end {
                margin-right: 4px;
              }
              .fc-direction-ltr .fc-daygrid-event.fc-event-start {
                margin-left: 4px;
              }
              .fc .fc-toolbar {
                margin-bottom: 1rem !important;
              }
              .fc .fc-toolbar-title {
                font-size: 1.5em;
              }
              .fc-header-toolbar {
                padding: 0.5rem;
              }
            `}</style>
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
              height="100%"
              aspectRatio={1.6}
              slotMinTime="08:00:00"
              slotMaxTime="21:00:00"
              eventDisplay="block"
              displayEventEnd={true}
              allDaySlot={false}
              slotEventOverlap={false}
              slotDuration="01:00:00"
              scrollTime="08:00:00"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short',
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }}
              eventClassNames="bg-[#931cf5] hover:bg-[#7a16d4] border-[#931cf5] !h-[30px] min-h-[30px] flex items-center"
              eventDidMount={(info) => {
                info.el.style.setProperty('--fc-event-bg-color', '#931cf5');
                info.el.style.setProperty('--fc-event-border-color', '#931cf5');
                info.el.style.setProperty('--fc-event-text-color', '#ffffff');
                info.el.style.setProperty('padding-top', '0px');
                info.el.style.setProperty('padding-bottom', '0px');
                info.el.style.setProperty('margin-bottom', '2px');
                info.el.style.setProperty('min-height', '30px');
                info.el.style.setProperty('display', 'flex');
                info.el.style.setProperty('align-items', 'center');
              }}
              views={{
                dayGridMonth: {
                  titleFormat: { year: 'numeric', month: 'long' },
                  dayMaxEventRows: 4,
                },
                timeGridWeek: {
                  titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                  slotMinWidth: 100,
                  allDaySlot: false
                },
                timeGridDay: {
                  titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                  allDaySlot: false
                }
              }}
            />
            <style jsx global>{`
              .fc .fc-toolbar-title {
                font-family: ${bebasNeue.style.fontFamily};
                font-size: 2rem !important;
                letter-spacing: 0.05em;
              }
              .fc .fc-button {
                font-family: ${bebasNeue.style.fontFamily};
                text-transform: uppercase;
                font-size: 0.9rem;
                letter-spacing: 0.05em;
              }
              .fc .fc-col-header-cell {
                font-family: ${bebasNeue.style.fontFamily};
                font-size: 1.1rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }
              .fc .fc-daygrid-day-number {
                font-family: ${bebasNeue.style.fontFamily};
                font-size: 1.1rem;
              }
              .fc .fc-timegrid-slot-label {
                font-family: ${bebasNeue.style.fontFamily};
                font-size: 1rem;
                letter-spacing: 0.05em;
              }
              .fc-theme-standard td, .fc-theme-standard th {
                border-color: rgba(147, 28, 245, 0.1);
              }
              .fc-theme-standard .fc-scrollgrid {
                border-color: rgba(147, 28, 245, 0.2);
              }
              .fc .fc-button {
                background-color: #931cf5;
                border-color: #931cf5;
              }
              .fc .fc-button:hover {
                background-color: #7b17cc;
                border-color: #7b17cc;
              }
              .fc .fc-button-primary:not(:disabled).fc-button-active,
              .fc .fc-button-primary:not(:disabled):active {
                background-color: #7b17cc;
                border-color: #7b17cc;
              }
            `}</style>
          </div>

          <div className="bg-white shadow-lg p-6 h-[72h] overflow-y-auto">
            <h2 className={`${bebasNeue.className} text-2xl lg:text-3xl text-[#4A154B] mb-4`}>
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border-l-4 border-[#931cf5] pl-4">
                    <p className="text-sm text-[#931cf5] font-medium mb-1">
                      {formatEventDate(event.start)}
                    </p>
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

      {tooltipData.event && (
        <div
          className="fixed z-[9999] bg-white p-4 shadow-lg border border-gray-200 w-[250px]"
          style={{
            top: tooltipData.top,
            left: tooltipData.left,
          }}
        >
          <div className="font-bold text-lg mb-1">{tooltipData.event.title}</div>
          <p className="text-gray-600">{tooltipData.event.time}</p>
          <p className="text-gray-600">📍 {tooltipData.event.location}</p>
          <p className="text-gray-700">{tooltipData.event.description}</p>
        </div>
      )}
    </div>
  );
}
