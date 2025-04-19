import React from 'react';
import Footer from '../components/Footer';

export default function OurTeam() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-gradient-to-b from-white to-gray-100 pt-20">
        <main className="container mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-[#931cf5] mb-8 text-center">
            Our Team
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-8 text-center">
              Meet the dedicated individuals who make ECESTORMS possible.
            </p>
            {/* Team members grid will go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team member cards will be added here */}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
} 