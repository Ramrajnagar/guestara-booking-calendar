import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isBefore,
  isEqual,
  parseISO,
  startOfDay,
} from 'date-fns';
import type { Booking } from '../types';

export const getDaysInMonth = (date: Date) => {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
};

export const getBookingsForDate = (date: Date, bookings: Booking[]) => {
  const targetDate = startOfDay(date);
  
  return bookings.filter(booking => {
    // Ignore cancelled bookings as per requirements
    if (booking.status === 'cancelled') return false;

    const checkIn = startOfDay(parseISO(booking.checkIn));
    const checkOut = startOfDay(parseISO(booking.checkOut));

    // A booking occupies the night if targetDate is >= checkIn AND < checkOut
    // It does NOT occupy the checkOut date.
    return (isEqual(targetDate, checkIn) || isBefore(checkIn, targetDate)) && isBefore(targetDate, checkOut);
  });
};

export const calculateOccupancy = (date: Date, bookings: Booking[], totalRooms: number = 10) => {
  const activeBookings = getBookingsForDate(date, bookings);
  return (activeBookings.length / totalRooms) * 100;
};

export const getDatesInRange = (startStr: string | null, endStr: string | null) => {
  if (!startStr || !endStr) return [];
  
  const start = parseISO(startStr);
  const end = parseISO(endStr);
  
  // Handle reverse drag selection
  const actualStart = isBefore(start, end) ? start : end;
  const actualEnd = isBefore(start, end) ? end : start;

  return eachDayOfInterval({ start: actualStart, end: actualEnd }).map(d => format(d, 'yyyy-MM-dd'));
};

// Filter out bookings that don't match the selected filters
export const filterBookings = (bookings: Booking[], filters: { roomType: string; status: string; source: string }) => {
  return bookings.filter(b => {
    if (filters.roomType && b.roomType !== filters.roomType) return false;
    if (filters.status && b.status !== filters.status) return false;
    if (filters.source && b.source !== filters.source) return false;
    return true;
  });
};
