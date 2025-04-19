'use client';

import React, { useState, useEffect } from 'react';
import { daysOfWeek } from '../data/officeHours';
import { useEscapeKey } from '../hooks/useEscapeKey';

// Add time options array
const timeOptions = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM"
];

// Helper function to convert between 24h and 12h formats
const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ');
  const [hours, minutes] = time.split(':');
  
  let hoursNum = parseInt(hours, 10);
  if (modifier === 'PM' && hoursNum < 12) hoursNum += 12;
  if (modifier === 'AM' && hoursNum === 12) hoursNum = 0;
  
  const hoursStr = hoursNum.toString().padStart(2, '0');
  return `${hoursStr}:${minutes}`;
};

const convertTo12Hour = (time24h: string): string => {
  const [hours, minutes] = time24h.split(':');
  const hoursNum = parseInt(hours, 10);
  
  let period = 'AM';
  let hours12 = hoursNum;
  
  if (hoursNum >= 12) {
    period = 'PM';
    hours12 = hoursNum === 12 ? 12 : hoursNum - 12;
  }
  if (hoursNum === 0) {
    hours12 = 12;
  }
  
  return `${hours12}:${minutes} ${period}`;
};

interface TimeSlotInfo {
  name: string;
  position: string;
}

interface DaySchedule {
  [timeRange: string]: TimeSlotInfo;
}

interface OfficeHoursSchedule {
  [day: string]: DaySchedule;
}

interface OfficeHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hours: OfficeHoursSchedule, location: string) => void;
  currentHours: OfficeHoursSchedule;
  currentLocation: string;
}

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  name: string;
  position: string;
}

export default function OfficeHoursModal({
  isOpen,
  onClose,
  onSave,
  currentHours,
  currentLocation
}: OfficeHoursModalProps) {
  const [location, setLocation] = useState(currentLocation);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEscapeKey(() => {
    if (isOpen) {
      onClose();
    }
  });

  // Convert current hours to time slots format when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocation(currentLocation);
      const slots: TimeSlot[] = [];
      
      Object.entries(currentHours).forEach(([day, schedule]) => {
        Object.entries(schedule).forEach(([timeRange, info]) => {
          const [startTime, endTime] = timeRange.split('-');
          slots.push({
            day,
            startTime,
            endTime,
            name: info.name,
            position: info.position
          });
        });
      });
      
      setTimeSlots(slots);
      setHasChanges(false); // Reset changes flag when modal opens
    }
  }, [currentHours, currentLocation, isOpen]);

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close without publishing?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const addNewTimeSlot = () => {
    setTimeSlots([...timeSlots, {
      day: daysOfWeek[0],
      startTime: '09:00',
      endTime: '10:00',
      name: '',
      position: ''
    }]);
    setHasChanges(true);
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const newSlots = [...timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setTimeSlots(newSlots);
    setHasChanges(true);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsPublishing(true);
    try {
      // Convert time slots back to the required format
      const newHours: OfficeHoursSchedule = {};
      
      // Group time slots by day and person
      const groupedSlots = timeSlots.reduce((acc, slot) => {
        if (!slot.name || !slot.position) return acc;
        
        if (!acc[slot.day]) {
          acc[slot.day] = {};
        }
        
        // Create a key for this person's shifts
        const personKey = `${slot.name}-${slot.position}`;
        if (!acc[slot.day][personKey]) {
          acc[slot.day][personKey] = {
            slots: [],
            name: slot.name,
            position: slot.position
          };
        }
        
        acc[slot.day][personKey].slots.push({
          start: slot.startTime,
          end: slot.endTime
        });
        
        return acc;
      }, {} as Record<string, Record<string, { slots: Array<{start: string, end: string}>, name: string, position: string }>>);

      // Convert grouped slots into continuous ranges
      Object.entries(groupedSlots).forEach(([day, people]) => {
        newHours[day] = {};
        
        Object.values(people).forEach(({ slots, name, position }) => {
          // Sort slots by start time
          slots.sort((a, b) => a.start.localeCompare(b.start));
          
          // Combine continuous slots
          let currentRange = slots[0];
          slots.slice(1).forEach(slot => {
            if (slot.start === currentRange.end) {
              // Extend the current range
              currentRange.end = slot.end;
            } else {
              // Add the completed range and start a new one
              const timeRange = `${currentRange.start}-${currentRange.end}`;
              newHours[day][timeRange] = { name, position };
              currentRange = slot;
            }
          });
          
          // Add the last range
          const timeRange = `${currentRange.start}-${currentRange.end}`;
          newHours[day][timeRange] = { name, position };
        });
      });

      await onSave(newHours, location);
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Office Hours</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Office Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office Location
          </label>
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
            placeholder="Enter office location"
          />
        </div>

        {/* Add Hours Button */}
        <button
          onClick={addNewTimeSlot}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#931cf5] text-white rounded-md hover:bg-[#7b17cc] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Office Hours
        </button>

        {/* Time Slots */}
        <div className="space-y-4">
          {timeSlots.map((slot, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
              <button
                onClick={() => removeTimeSlot(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                  <select
                    value={slot.day}
                    onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <select
                    value={convertTo12Hour(slot.startTime)}
                    onChange={(e) => updateTimeSlot(index, 'startTime', convertTo24Hour(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <select
                    value={convertTo12Hour(slot.endTime)}
                    onChange={(e) => updateTimeSlot(index, 'endTime', convertTo24Hour(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={slot.name}
                    onChange={(e) => updateTimeSlot(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
                    placeholder="Enter name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={slot.position}
                    onChange={(e) => updateTimeSlot(index, 'position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
                    placeholder="Enter position"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPublishing}
            className="px-4 py-2 bg-[#931cf5] text-white rounded-md hover:bg-[#7b17cc] transition-colors disabled:opacity-50"
          >
            {isPublishing ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>
    </div>
  );
} 