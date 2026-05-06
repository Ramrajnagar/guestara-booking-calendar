import React, { useMemo } from 'react';
import { getDaysInMonth, calculateOccupancy } from '../utils/dateUtils';
import { DayCell } from './DayCell';
import { startOfWeek, endOfWeek, eachDayOfInterval, isBefore } from 'date-fns';

export const CalendarGrid = ({
  currentMonth,
  bookings,
  selectedRange,
  onDateMouseDown,
  onDateMouseEnter,
  onDateMouseUp
}) => {
  const daysInGrid = useMemo(() => {
    const monthStart = getDaysInMonth(currentMonth)[0];
    const monthEnd = getDaysInMonth(currentMonth)[getDaysInMonth(currentMonth).length - 1];
    
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const isDateSelected = (date) => {
    if (!selectedRange.start) return false;
    
    const start = new Date(selectedRange.start);
    const end = selectedRange.end ? new Date(selectedRange.end) : start;
    
    const actualStart = isBefore(start, end) ? start : end;
    const actualEnd = isBefore(start, end) ? end : start;
    
    const d = new Date(date);
    d.setHours(0,0,0,0);
    actualStart.setHours(0,0,0,0);
    actualEnd.setHours(0,0,0,0);
    
    return d >= actualStart && d <= actualEnd;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-grid-container" onMouseLeave={onDateMouseUp}>
      <div className="calendar-header">
        {weekDays.map(day => (
          <div key={day} className="calendar-header-cell">{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {daysInGrid.map((date) => (
          <DayCell
            key={date.toISOString()}
            date={date}
            currentMonth={currentMonth}
            occupancyRate={calculateOccupancy(date, bookings)}
            isSelected={isDateSelected(date)}
            onMouseDown={onDateMouseDown}
            onMouseEnter={onDateMouseEnter}
            onMouseUp={onDateMouseUp}
          />
        ))}
      </div>
    </div>
  );
};
