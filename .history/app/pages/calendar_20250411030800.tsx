import React from 'react';
import Footer from '../components/Footer';

export default function Calendar() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-4 text-xl text-gray-500">
            View upcoming events and important dates.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
} 