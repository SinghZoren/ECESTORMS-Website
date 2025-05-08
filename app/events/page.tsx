"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Footer from '../components/Footer';
import { bebasNeue } from '../fonts';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  year: string;
  term: string;
}

interface EventsByYear {
  [year: string]: {
    [term: string]: Event[];
  };
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/getPastEvents');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.events || []);
        // Set default selected year to the most recent
        if (data.events && data.events.length > 0) {
          const years = Array.from(new Set(data.events.map((e: Event) => e.year))).sort().reverse();
          setSelectedYear(years.length > 0 ? (years[0] as string) : null);
        }
      } catch (err: unknown) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Group events by year and term
  const eventsByYear = events.reduce((acc: EventsByYear, event) => {
    if (!acc[event.year]) {
      acc[event.year] = {};
    }
    if (!acc[event.year][event.term]) {
      acc[event.year][event.term] = [];
    }
    acc[event.year][event.term].push(event);
    return acc;
  }, {});

  // Get all unique years, sorted descending
  const allYears = Object.keys(eventsByYear).sort().reverse();

  // Only show events for the selected year
  const visibleEventsByYear = selectedYear ? { [selectedYear]: eventsByYear[selectedYear] } : eventsByYear;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#4A154B] pt-20">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-white text-xl">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#4A154B] pt-20">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-white text-xl bg-red-500/80 p-4 ">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#4A154B] pt-20">
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className={`${bebasNeue.className} text-4xl md:text-5xl lg:text-6xl text-white mb-8 text-center`}>
            Past Events
          </h1>

          {/* Year Selector Carousel */}
          <div className="flex space-x-2 mb-10 overflow-x-auto pb-2 justify-center">
            {allYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-2  border transition-colors whitespace-nowrap text-base md:text-lg font-semibold ${selectedYear === year ? 'bg-[#931cf5] text-white border-[#931cf5]' : 'bg-white/80 text-[#4A154B] border-gray-300 hover:bg-[#e9d6fa]'}`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Events by Year and Term */}
          {Object.entries(visibleEventsByYear).map(([year, terms]) => (
            <div key={year} className="mb-16">
              {Object.entries(terms).map(([term, termEvents]) => (
                <div key={`${year}-${term}`} className="mb-12">
                  <h3 className={`${bebasNeue.className} text-2xl md:text-3xl text-white mb-2 text-center`}>
                    {term} Term
                  </h3>
                  <div className="w-full border-b-2 border-[#f7ce46] pb-2 mb-8"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {termEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="bg-white/80 backdrop-blur-sm shadow-lg shadow-xl p-6 g transform hover:scale-105 transition-transform duration-300"
                      >
                        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className={`${bebasNeue.className} text-lg md:text-xl text-[#4A154B] font-semibold mb-2`}>
                          {event.title}
                        </h4>
                        <p className="text-base text-gray-600 mb-2">{event.location}</p>
                        <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
} 