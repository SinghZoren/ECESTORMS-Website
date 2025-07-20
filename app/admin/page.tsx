'use client';

import React, { useState, useEffect } from 'react';
import { defaultOfficeHoursData, defaultLocation } from '../data/officeHours';
import { teamMembers as defaultTeamMembers } from '../data/teamMembers';
import OfficeHoursModal from '../components/OfficeHoursModal';
import TeamMembersModal from '../components/TeamMembersModal';
import CalendarModal from '../components/CalendarModal';
import SponsorsModal, { Sponsor } from '../components/SponsorsModal';
import ResourceManagerModal from '../components/ResourceManagerModal';
import TutorialEditModal from '../components/TutorialEditModal';
import PastEventsModal from '../components/PastEventsModal';
import ShopModal from '../components/ShopModal';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  description?: string;
}

interface PastEvent {
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

interface ShopItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buyUrl: string;
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOfficeHoursModalOpen, setIsOfficeHoursModalOpen] = useState(false);
  const [isTeamMembersModalOpen, setIsTeamMembersModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isSponsorsModalOpen, setIsSponsorsModalOpen] = useState(false);
  const [isResourceManagerModalOpen, setIsResourceManagerModalOpen] = useState(false);
  const [isTutorialEditModalOpen, setIsTutorialEditModalOpen] = useState(false);
  const [isPastEventsModalOpen, setIsPastEventsModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [currentHours, setCurrentHours] = useState(defaultOfficeHoursData);
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);
  const [currentTeamMembers, setCurrentTeamMembers] = useState(defaultTeamMembers);
  const [currentSponsors, setCurrentSponsors] = useState<Sponsor[]>([]);
  const [conferenceVisible, setConferenceVisible] = useState(true);
  const [currentPastEvents, setCurrentPastEvents] = useState<PastEvent[]>([]);
  const [currentShopItems, setCurrentShopItems] = useState<ShopItem[]>([]);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
        if (data.isLoggedIn) {
          fetchConferenceVisibility();
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  const fetchConferenceVisibility = async () => {
    try {
      const response = await fetch('/api/conferenceVisibility/GET');
      if (!response.ok) throw new Error('Failed to fetch conference visibility');
      const data = await response.json();
      setConferenceVisible(data.conferenceVisible);
    } catch (error) {
      console.error('Error fetching conference visibility:', error);
    }
  };

  const handleToggleConferenceVisibility = async () => {
    try {
      const newVisibility = !conferenceVisible;
      const response = await fetch('/api/conferenceVisibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conferenceVisible: newVisibility }),
      });

      if (!response.ok) throw new Error('Failed to update conference visibility');
      
      setConferenceVisible(newVisibility);
      alert(`Conference link is now ${newVisibility ? 'visible' : 'hidden'}`);
    } catch (error) {
      console.error('Error updating conference visibility:', error);
      alert('Failed to update conference visibility. Please try again.');
    }
  };

  // Fetch current office hours when opening the modal
  const handleOpenOfficeHoursModal = async () => {
    try {
      const response = await fetch('/api/getOfficeHours');
      if (!response.ok) {
        throw new Error('Failed to fetch office hours');
      }
      const data = await response.json();
      setCurrentHours(data.hours);
      setCurrentLocation(data.location);
      setIsOfficeHoursModalOpen(true);
    } catch (error) {
      console.error('Error fetching office hours:', error);
      alert('Failed to load current office hours. Please try again.');
    }
  };

  // Fetch current team members when opening the modal
  const handleOpenTeamMembersModal = async () => {
    try {
      const response = await fetch('/api/getTeamMembers');
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      const data = await response.json();
      setCurrentTeamMembers(data.teamMembers);
      setIsTeamMembersModalOpen(true);
    } catch (error) {
      console.error('Error fetching team members:', error);
      alert('Failed to load current team members. Please try again.');
    }
  };

  // Fetch current sponsors when opening the modal
  const handleOpenSponsorsModal = async () => {
    try {
      const response = await fetch('/api/getSponsors');
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      setCurrentSponsors(data.sponsors);
      setIsSponsorsModalOpen(true);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      alert('Failed to load current sponsors. Please try again.');
    }
  };

  // Fetch current past events when opening the modal
  const handleOpenPastEventsModal = async () => {
    try {
      const response = await fetch('/api/getPastEvents');
      if (!response.ok) {
        throw new Error('Failed to fetch past events');
      }
      const data = await response.json();
      setCurrentPastEvents(data.events);
      setIsPastEventsModalOpen(true);
    } catch (error) {
      console.error('Error fetching past events:', error);
      alert('Failed to load current past events. Please try again.');
    }
  };

  // Fetch current shop items when opening the modal
  const handleOpenShopModal = async () => {
    try {
      const response = await fetch('/api/getShopItems');
      if (!response.ok) {
        throw new Error('Failed to fetch shop items');
      }
      const data = await response.json();
      setCurrentShopItems(data.items);
      setIsShopModalOpen(true);
    } catch {
      alert('Failed to load shop items. Please try again.');
    }
  };

  // Don't render anything until auth check is complete
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        fetchConferenceVisibility();
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const handleSaveOfficeHours = async (newHours: typeof defaultOfficeHoursData, newLocation: string) => {
    try {
      // Use fetch to send the correct content to your backend to update the file
      const response = await fetch('/api/updateOfficeHours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          hours: newHours,
          location: newLocation
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update office hours');
      }

      // Update the current state with the new data
      setCurrentHours(newHours);
      setCurrentLocation(newLocation);
      
      alert('Office hours published successfully!');
    } catch (error) {
      console.error('Error publishing changes:', error);
      alert('Failed to publish changes. Please try again.');
    }
  };

  const handleSaveTeamMembers = async (newTeamMembers: typeof defaultTeamMembers, teamPhotoUrl: string) => {
    try {
      // Send team members data to backend
      const response = await fetch('/api/updateTeamMembers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          teamMembers: newTeamMembers,
          teamPhotoUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update team members');
      }

      // Update the current state with the new data
      setCurrentTeamMembers(newTeamMembers);
      
      alert('Team members published successfully!');
    } catch (error) {
      console.error('Error publishing team members:', error);
      alert('Failed to publish team members. Please try again.');
    }
  };

  const handleSaveCalendar = async (events: CalendarEvent[]) => {
    try {
      // Send calendar events to backend
      const response = await fetch('/api/updateCalendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        throw new Error('Failed to update calendar events');
      }

      alert('Calendar events published successfully!');
    } catch (error) {
      console.error('Error publishing calendar events:', error);
      alert('Failed to publish calendar events. Please try again.');
    }
  };

  const handleSaveSponsors = async (sponsors: Sponsor[]) => {
    try {
      const response = await fetch('/api/updateSponsors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sponsors }),
      });

      if (!response.ok) {
        throw new Error('Failed to update sponsors');
      }

      setCurrentSponsors(sponsors);
      alert('Sponsors updated successfully!');
    } catch (error) {
      console.error('Error updating sponsors:', error);
      alert('Failed to update sponsors. Please try again.');
    }
  };

  const handleSavePastEvents = async (events: PastEvent[]) => {
    try {
      const response = await fetch('/api/updatePastEvents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        throw new Error('Failed to update past events');
      }

      setCurrentPastEvents(events);
      alert('Past events published successfully!');
    } catch (error) {
      console.error('Error publishing past events:', error);
      alert('Failed to publish past events. Please try again.');
    }
  };

  function handleSaveShopItems(items: ShopItem[]) {
    (async () => {
      try {
        const response = await fetch('/api/updateShopItems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items }),
        });
        if (!response.ok) {
          throw new Error('Failed to update shop items');
        }
        setCurrentShopItems(items);
        alert('Shop items published successfully!');
      } catch {
        alert('Failed to publish shop items. Please try again.');
      }
    })();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {isLoggedIn ? (
        <>
          {/* Header with Logout */}
          <header className="bg-white shadow fixed top-0 left-0 right-0 z-10 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Conference Link:</span>
                  <button
                    onClick={handleToggleConferenceVisibility}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      conferenceVisible
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {conferenceVisible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
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
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 pt-28">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Website Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={handleOpenOfficeHoursModal}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">Office Hours</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage office hours schedule</p>
                </button>

                <button
                  onClick={handleOpenTeamMembersModal}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                  <p className="mt-1 text-sm text-gray-500">Update team member information</p>
                </button>

                <button
                  onClick={() => setIsCalendarModalOpen(true)}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">Calendar</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage calendar events</p>
                </button>

                <button
                  onClick={handleOpenSponsorsModal}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">Sponsors</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage sponsors and partners</p>
                </button>

                <button
                  onClick={() => setIsResourceManagerModalOpen(true)}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">Resource Manager</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage exam bank resources and files</p>
                </button>

                <button
                  onClick={() => setIsTutorialEditModalOpen(true)}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">Schedule Tutorial</h3>
                  <p className="mt-1 text-sm text-gray-500">Add or edit tutorial events</p>
                </button>

                <button
                  onClick={handleOpenPastEventsModal}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">Manage Past Events</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Add, edit, or remove past events and their details
                  </p>
                </button>

                <button
                  onClick={handleOpenShopModal}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">Manage Shop</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Add, edit, or remove shop items and their details
                  </p>
                </button>
              </div>
            </div>
          </main>

          {/* Modals */}
          <OfficeHoursModal
            isOpen={isOfficeHoursModalOpen}
            onClose={() => setIsOfficeHoursModalOpen(false)}
            onSave={handleSaveOfficeHours}
            currentHours={currentHours}
            currentLocation={currentLocation}
          />
          {isTeamMembersModalOpen && (
            <TeamMembersModal
              isOpen={isTeamMembersModalOpen}
              onClose={() => setIsTeamMembersModalOpen(false)}
              onSave={handleSaveTeamMembers}
              currentMembers={currentTeamMembers}
            />
          )}
          <CalendarModal
            isOpen={isCalendarModalOpen}
            onClose={() => setIsCalendarModalOpen(false)}
            onSave={handleSaveCalendar}
          />
          <SponsorsModal
            isOpen={isSponsorsModalOpen}
            onClose={() => setIsSponsorsModalOpen(false)}
            onSave={handleSaveSponsors}
            currentSponsors={currentSponsors}
          />
          <ResourceManagerModal
            isOpen={isResourceManagerModalOpen}
            onClose={() => setIsResourceManagerModalOpen(false)}
          />
          <TutorialEditModal
            isOpen={isTutorialEditModalOpen}
            onClose={() => setIsTutorialEditModalOpen(false)}
            onSave={(tutorial) => {
              // Handle saving the tutorial event
              console.log('Saving tutorial:', tutorial);
              // Add logic to save the tutorial event
            }}
          />
          <PastEventsModal
            isOpen={isPastEventsModalOpen}
            onClose={() => setIsPastEventsModalOpen(false)}
            onSave={handleSavePastEvents}
            currentEvents={currentPastEvents}
          />
          <ShopModal
            isOpen={isShopModalOpen}
            onClose={() => setIsShopModalOpen(false)}
            onSave={handleSaveShopItems}
            currentItems={currentShopItems}
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