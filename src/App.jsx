import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { CalendarGrid } from './components/CalendarGrid';
import { BookingPanel } from './components/BookingPanel';
import { HeatmapLegend } from './components/HeatmapLegend';
import { StatsDashboard } from './components/StatsDashboard';
import { filterBookings, getBookingsForDate, getDatesInRange } from './utils/dateUtils';
import { parseISO } from 'date-fns';
import './App.css';

function App() {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); 
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [isDragging, setIsDragging] = useState(false);
  
  const [filters, setFilters] = useState({
    roomType: '',
    status: '',
    source: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/bookings.json');
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setAllBookings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  const filteredBookings = useMemo(() => {
    return filterBookings(allBookings, filters);
  }, [allBookings, filters]);

  const roomTypes = useMemo(() => [...new Set(allBookings.map(b => b.roomType))], [allBookings]);
  const sources = useMemo(() => [...new Set(allBookings.map(b => b.source))], [allBookings]);

  const rangeBookings = useMemo(() => {
    if (!selectedRange.start) return [];
    const dates = getDatesInRange(selectedRange.start, selectedRange.end || selectedRange.start);
    const unique = new Map();
    dates.forEach(d => {
      getBookingsForDate(parseISO(d), filteredBookings).forEach(b => unique.set(b.id, b));
    });
    return Array.from(unique.values());
  }, [selectedRange, filteredBookings]);

  const handleMouseDown = (dateStr) => {
    setIsDragging(true);
    setSelectedRange({ start: dateStr, end: dateStr });
  };

  const handleMouseEnter = (dateStr) => {
    if (isDragging) {
      setSelectedRange(prev => ({ ...prev, end: dateStr }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <span>Preparing your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div style={{ color: 'var(--status-cancelled-text)', fontSize: '3rem' }}>!</div>
        <span>Oops! {error}</span>
        <button onClick={() => window.location.reload()} className="btn-today">Try Again</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar 
        currentMonth={currentMonth} 
        onMonthChange={setCurrentMonth}
        filters={filters}
        onFilterChange={setFilters}
        roomTypes={roomTypes}
        sources={sources}
      />
      
      <main className="main-content">
        <div className="left-panel">
          <div className="calendar-card">
            <div className="calendar-top">
              <span className="selection-hint">Click and drag to select a range</span>
              <HeatmapLegend />
            </div>
            <CalendarGrid 
              currentMonth={currentMonth}
              bookings={filteredBookings}
              selectedRange={selectedRange}
              onDateMouseDown={handleMouseDown}
              onDateMouseEnter={handleMouseEnter}
              onDateMouseUp={handleMouseUp}
            />
          </div>
          
          <StatsDashboard 
            bookings={rangeBookings} 
            totalDaysInRange={selectedRange.start ? getDatesInRange(selectedRange.start, selectedRange.end || selectedRange.start).length : 0}
          />
        </div>

        <div className="right-panel">
          <BookingPanel 
            selectedRange={selectedRange}
            bookings={filteredBookings}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
