import React, { useState, useEffect } from 'react';
import { daysOfWeek, timeSlots, TimeSlotInfo } from '../data/officeHours';
import Footer from '../components/Footer';

interface OfficeHoursData {
  [day: string]: {
    [timeRange: string]: TimeSlotInfo;
  };
}

// Helper function to format time in 12-hour format
const formatTimeRange = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}${minutes === '00' ? '' : ':' + minutes}${ampm}`;
};

// Create time ranges for display
const timeRanges = timeSlots
  .filter((_, index) => index < timeSlots.length - 1 && timeSlots[index + 1] <= '18:00')
  .map((time, index) => ({
    display: `${formatTimeRange(time)}-${formatTimeRange(timeSlots[index + 1])}`,
    start: time,
    end: timeSlots[index + 1]
  }));

export default function OfficeHours() {
  const [showMap, setShowMap] = useState(false);
  const [currentOfficeHours, setCurrentOfficeHours] = useState<OfficeHoursData>({});
  const [currentLocation, setCurrentLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOfficeHours = async () => {
      try {
        const response = await fetch('/api/getOfficeHours');
        if (!response.ok) {
          throw new Error('Failed to fetch office hours');
        }
        const data = await response.json();
        setCurrentOfficeHours(data.hours);
        setCurrentLocation(data.location);
        
        // Save to localStorage after successful fetch
        localStorage.setItem('officeHours', JSON.stringify(data.hours));
        localStorage.setItem('officeLocation', data.location);
      } catch (err) {
        // Try to load from localStorage as fallback
        const savedOfficeHours = localStorage.getItem('officeHours');
        const savedLocation = localStorage.getItem('officeLocation');
        
        if (savedOfficeHours && savedLocation) {
          setCurrentOfficeHours(JSON.parse(savedOfficeHours));
          setCurrentLocation(savedLocation);
        } else {
          setError('Failed to load office hours');
          console.error('Error fetching office hours:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeHours();
  }, []);

  const getTimeSlotInfo = (day: string, startTime: string, endTime: string) => {
    const daySchedule = currentOfficeHours[day];
    if (!daySchedule) return null;

    for (const [timeRange, info] of Object.entries(daySchedule)) {
      const [rangeStart, rangeEnd] = timeRange.split('-');
      // Convert all times to minutes for easier comparison
      const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const slotStartMins = timeToMinutes(startTime);
      const slotEndMins = timeToMinutes(endTime);
      const rangeStartMins = timeToMinutes(rangeStart);
      const rangeEndMins = timeToMinutes(rangeEnd);

      // Check if this time slot falls within the range
      if (slotStartMins >= rangeStartMins && slotEndMins <= rangeEndMins) {
        return info;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen relative">
        <div className="flex-grow flex items-center justify-center relative z-10">
          <div className="text-white text-xl">Loading office hours...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen relative">
        <div className="flex-grow flex items-center justify-center relative z-10">
          <div className="text-white text-xl bg-red-500/80 p-4 ">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#4A154B]">
      {/* Content */}
      <div className="flex-grow">
        <div className="pt-30 pb-28">
          <div className={`transition-all duration-500 ease-in-out transform ${showMap ? 'translate-x-[-5vw]' : 'translate-x-0'}`}>
            <main className="w-[65vw] mx-auto px-3 sm:px-4 lg:px-6 py-3">
              <div className="text-center mb-[2.5vh]">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  Office Hours
                </h1>
                <p className="mt-[1vh] text-xs md:text-sm leading-5 text-white">
                  Visit us during our office hours for assistance and support.
                </p>
              </div>

              <div className="bg-white shadow-lg overflow-hidden  min-h-[42vh]">
                <div className="text-center py-[1.2vh] border-b border-gray-200">
                  <h2 className="text-base md:text-lg font-semibold text-[#4A154B]">Location</h2>
                  <div className="flex items-center justify-center gap-1.5 mt-[0.6vh]">
                    <p className="text-xs md:text-sm text-gray-700">{currentLocation}</p>
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className="w-4 h-4 bg-[#931cf5] text-white flex items-center justify-center text-[10px] hover:bg-[#7b17cc] transition-colors "
                      title="Toggle Map View"
                    >
                      ?
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto p-[1.2vh] h-full">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="w-[8vw] py-[1vh] px-[0.6vw] text-left text-[10px] md:text-xs text-gray-500 font-bold">Time</th>
                        {daysOfWeek.map(day => (
                          <th key={day} className="py-[1vh] px-[0.6vw] text-center text-[10px] md:text-xs text-gray-500 font-bold">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {timeRanges.map(({ display, start, end }) => (
                        <tr key={display} className="border-b border-gray-100 font-bold hover:bg-gray-50">
                          <td className="py-[1vh] px-[0.6vw] text-[10px] md:text-xs text-gray-500 whitespace-nowrap">
                            {display}
                          </td>
                          {daysOfWeek.map(day => {
                            const slotInfo = getTimeSlotInfo(day, start, end);
                            return (
                              <td key={`${day}-${display}`} className="py-[1vh] px-[0.6vw]">
                                {slotInfo && (
                                  <div className="bg-[#931cf5] px-[0.6vw] py-[0.6vh] ">
                                    <div className="font-bold text-[#f7ce46] truncate text-[10px] md:text-xs">{slotInfo.name}</div>
                                    <div className="font-medium text-white truncate text-[10px]">{slotInfo.position}</div>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </div>

          {/* Map Section - Slides in from right */}
          <div className={`fixed top-1/2 -translate-y-1/2 right-0 w-[30vw] h-[50vh] bg-white/90 backdrop-blur-sm shadow-lg shadow-xl overflow-hidden transition-transform duration-500 ease-in-out transform ${
            showMap ? 'translate-x-0 mr-[2.5vw]' : 'translate-x-[110%]'
          }`}>
            <div className="text-center py-[1.2vh] border-b border-gray-200 bg-[#931cf5]">
              <h2 className="text-base md:text-lg font-semibold text-white">Office Location</h2>
              <button
                onClick={() => setShowMap(false)}
                className="absolute top-[1.2vh] right-[1.2vw] text-white hover:text-gray-200 transition-colors text-base"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(50vh-7vh)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2041.0693921832612!2d-79.37888802599353!3d43.65840332276218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb4aa46c8ffd%3A0x7cd73eae5e29b077!2sKerr%20Hall%2C%20Toronto%2C%20ON!5e0!3m2!1sen!2sca!4v1744527355897!5m2!1sen!2sca%22%20width=%22600%22%20height=%22450%22%20style=%22border:0;%22%20allowfullscreen=%22%22%20loading=%22lazy%22%20referrerpolicy=%22no-referrer-when-downgrade"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with higher z-index */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
} 