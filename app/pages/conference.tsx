import React from 'react';
import Footer from '../components/Footer';

export default function Conference() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Conference</h1>
          <p className="mt-4 text-xl text-gray-500">
            Learn about our annual conference.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
} 