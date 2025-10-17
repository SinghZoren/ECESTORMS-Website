'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import type { SlideDefinition } from '../types';

interface PastEvent {
  id: string;
  title: string;
  description: string;
  location?: string;
  date?: string;
  time?: string;
  imageUrl?: string;
  year?: string;
  term?: string;
}

interface EventsResponse {
  events: PastEvent[];
}

const placeholderImage =
  'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80';

function EventsContent() {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      try {
        const response = await fetch('/api/getPastEvents', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Events request failed (${response.status})`);
        }
        const payload = (await response.json()) as EventsResponse;
        if (!cancelled) {
          const data = Array.isArray(payload?.events) ? payload.events.filter(Boolean) : [];
          setEvents(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load past events', err);
          setError('Unable to load recent events right now.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <img
        src="/images/campus3.jpg"
        alt="Downtown Toronto background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-[1400px] px-10 py-12">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-black uppercase tracking-tight md:text-6xl lg:text-7xl text-white drop-shadow-lg">
            Recent <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">Events</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/80 md:text-lg">
            Peek at some of the events we have hosted recently across academic, professional, and social pillars.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[260px] animate-pulse rounded-3xl bg-white/10" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={event.imageUrl || placeholderImage}
                    alt={event.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-5 text-left">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                      {[event.term, event.year]
                        .filter(Boolean)
                        .map((segment) => segment?.toString().trim())
                        .join(' • ')}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-white drop-shadow-sm">{event.title}</h3>
                    {event.location && (
                      <p className="mt-1 text-sm text-white/80">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="mt-3 text-sm text-white/75 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white/70">
            We are updating our recent events gallery. Check back soon for highlights.
          </p>
        )}

        {error && <p className="mt-6 text-center text-xs text-white/60">{error}</p>}
      </div>
    </div>
  );
}

const eventsSlide: SlideDefinition = {
  id: 'events',
  render: () => <EventsContent />,
};

export default eventsSlide;
