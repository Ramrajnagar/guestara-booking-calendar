import React from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export const Navbar = ({
  currentMonth,
  onMonthChange,
  filters,
  onFilterChange,
  roomTypes,
  sources
}) => {
  const handlePrevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const handleNextMonth = () => onMonthChange(addMonths(currentMonth, 1));
  const handleToday = () => onMonthChange(new Date());

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>Guestara Calendar</h1>
      </div>

      <div className="nav-controls">
        <div className="month-navigation">
          <button onClick={handlePrevMonth} className="btn-icon" aria-label="Previous Month">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleToday} className="btn-today">Today</button>
          <span className="current-month-display">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={handleNextMonth} className="btn-icon" aria-label="Next Month">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="filters-container">
          <div className="filter-item">
            <Filter size={16} />
            <select name="roomType" value={filters.roomType} onChange={handleFilterChange}>
              <option value="">All Rooms</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
            </select>
          </div>

          <div className="filter-item">
            <select name="source" value={filters.source} onChange={handleFilterChange}>
              <option value="">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};
