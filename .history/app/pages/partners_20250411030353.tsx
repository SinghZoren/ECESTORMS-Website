import React from 'react';

export default function Partners() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-20">
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-[#931cf5] mb-8 text-center">
          Our Partners
        </h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 mb-8 text-center">
            We are proud to collaborate with these organizations to bring you the best resources and opportunities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Partner cards will go here */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Academic Partners
              </h2>
              <ul className="space-y-2">
                <li className="text-gray-600">• Faculty of Engineering</li>
                <li className="text-gray-600">• Department of Electrical Engineering</li>
                <li className="text-gray-600">• Department of Computer Engineering</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Industry Partners
              </h2>
              <ul className="space-y-2">
                <li className="text-gray-600">• Local Tech Companies</li>
                <li className="text-gray-600">• Engineering Firms</li>
                <li className="text-gray-600">• Research Institutions</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 