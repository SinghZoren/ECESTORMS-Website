'use client';

import React, { useState, useEffect } from 'react';
import { defaultOfficeHoursData, defaultLocation } from '../data/officeHours';
import OfficeHoursModal from '../components/OfficeHoursModal';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentHours, setCurrentHours] = useState(defaultOfficeHoursData);
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch current office hours when opening the modal
  const handleOpenModal = async () => {
    try {
      const response = await fetch('/api/getOfficeHours');
      if (!response.ok) {
        throw new Error('Failed to fetch office hours');
      }
      const data = await response.json();
      setCurrentHours(data.hours);
      setCurrentLocation(data.location);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching office hours:', error);
      alert('Failed to load current office hours. Please try again.');
    }
  };

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correctUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    
    if (username === correctUsername && password === correctPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleSaveOfficeHours = async (newHours: typeof defaultOfficeHoursData, newLocation: string) => {
    try {
      // Create the JSON content
      const jsonContent = {
        hours: newHours,
        daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timeSlots: [
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00'
        ],
        location: newLocation
      };

      // Use fetch to send the content to your backend to update the file
      const response = await fetch('/api/updateOfficeHours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: JSON.stringify(jsonContent, null, 2),
          isJson: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update office hours');
      }

      // Update the current state with the new data
      setCurrentHours(newHours);
      setCurrentLocation(newLocation);
      
      alert('Changes published successfully!');
    } catch (error) {
      console.error('Error publishing changes:', error);
      alert('Failed to publish changes. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn ? (
        <>
          {/* Header with Logout */}
          <header className="bg-white shadow fixed top-0 left-0 right-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={handleOpenModal}
                  className="bg-[#931cf5] text-white px-4 py-2 rounded-md hover:bg-[#7b17cc] transition-colors w-full text-left"
                >
                  Edit Office Hours
                </button>
              </div>
            </div>
          </main>

          <OfficeHoursModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveOfficeHours}
            currentHours={currentHours}
            currentLocation={currentLocation}
          />
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center">Admin Login</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#931cf5] text-white px-4 py-2 rounded-md hover:bg-[#7b17cc]"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 