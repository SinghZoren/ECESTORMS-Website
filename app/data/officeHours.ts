export interface TimeSlotInfo {
  name: string;
  position: string;
}

export interface DaySchedule {
  [timeSlot: string]: TimeSlotInfo;
}

export interface OfficeHoursSchedule {
  [day: string]: DaySchedule;
}

export const defaultOfficeHoursData: OfficeHoursSchedule = {};

export const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
export const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

export const defaultLocation = 'Kerr Hall East, Room 040-G';

// Export the current values
export const officeHoursData = defaultOfficeHoursData;
export const officeLocation = defaultLocation;