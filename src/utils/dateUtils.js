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

/**
 * Returns an array of all days in the month for a given date
 */
export const getDaysInMonth = (date) => {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
};

/**
 * Core Logic: Determines if a booking occupies a specific night.
 * Rule: Occupies nights from checkIn UP TO (but not including) checkOut.
 */
export const getBookingsForDate = (date, bookings) => {
  const targetDate = startOfDay(date);
  
  return bookings.filter(booking => {
    if (booking.status === 'cancelled') return false;

    const checkIn = startOfDay(parseISO(booking.checkIn));
    const checkOut = startOfDay(parseISO(booking.checkOut));

    // targetDate is within [checkIn, checkOut)
    return (isEqual(targetDate, checkIn) || isBefore(checkIn, targetDate)) && isBefore(targetDate, checkOut);
  });
};

/**
 * Calculates occupancy percentage based on a total of 10 rooms
 */
export const calculateOccupancy = (date, bookings, totalRooms = 10) => {
  const activeBookings = getBookingsForDate(date, bookings);
  return (activeBookings.length / totalRooms) * 100;
};

/**
 * Returns array of date strings for a range, handling reverse selection
 */
export const getDatesInRange = (startStr, endStr) => {
  if (!startStr || !endStr) return [];
  
  const start = parseISO(startStr);
  const end = parseISO(endStr);
  
  const actualStart = isBefore(start, end) ? start : end;
  const actualEnd = isBefore(start, end) ? end : start;

  return eachDayOfInterval({ start: actualStart, end: actualEnd }).map(d => format(d, 'yyyy-MM-dd'));
};

/**
 * Application of UI filters
 */
export const filterBookings = (bookings, filters) => {
  return bookings.filter(b => {
    if (filters.roomType && b.roomType !== filters.roomType) return false;
    if (filters.status && b.status !== filters.status) return false;
    if (filters.source && b.source !== filters.source) return false;
    return true;
  });
};
