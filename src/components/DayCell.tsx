import React from 'react';
import { format, isSameMonth, isToday } from 'date-fns';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  occupancyRate: number;
  isSelected: boolean;
  onMouseDown: (dateStr: string) => void;
  onMouseEnter: (dateStr: string) => void;
  onMouseUp: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  currentMonth,
  occupancyRate,
  isSelected,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isCurrentDay = isToday(date);

  // Determine heatmap color based on occupancy
  let bgClass = 'bg-white';
  if (occupancyRate > 0) {
    if (occupancyRate <= 25) bgClass = 'occupancy-low';
    else if (occupancyRate <= 50) bgClass = 'occupancy-med';
    else if (occupancyRate <= 75) bgClass = 'occupancy-high';
    else bgClass = 'occupancy-full';
  }

  return (
    <div
      className={`day-cell ${!isCurrentMonth ? 'text-gray' : ''} ${bgClass} ${isSelected ? 'selected' : ''} ${isCurrentDay ? 'today' : ''}`}
      onMouseDown={() => onMouseDown(dateStr)}
      onMouseEnter={() => onMouseEnter(dateStr)}
      onMouseUp={onMouseUp}
    >
      <span className="day-number">{format(date, 'd')}</span>
      {occupancyRate > 0 && (
        <span className="occupancy-label">{Math.round(occupancyRate)}%</span>
      )}
    </div>
  );
};
