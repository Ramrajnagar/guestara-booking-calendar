import React, { useMemo } from 'react';
import { getDatesInRange, getBookingsForDate } from '../utils/dateUtils';
import { parseISO, format, differenceInDays } from 'date-fns';
import { Calendar } from 'lucide-react';

export const BookingPanel = ({ selectedRange, bookings }) => {
  const selectedBookings = useMemo(() => {
    if (!selectedRange.start) return [];

    if (!selectedRange.end) {
      return getBookingsForDate(parseISO(selectedRange.start), bookings);
    }

    const dates = getDatesInRange(selectedRange.start, selectedRange.end);
    const uniqueBookings = new Map();
    
    dates.forEach(dateStr => {
      const dayBookings = getBookingsForDate(parseISO(dateStr), bookings);
      dayBookings.forEach(b => uniqueBookings.set(b.id, b));
    });

    return Array.from(uniqueBookings.values());
  }, [selectedRange, bookings]);

  if (!selectedRange.start) {
    return (
      <div className="booking-panel empty-state">
        <div className="empty-state-icon">
          <Calendar size={64} />
        </div>
        <h3>No Selection</h3>
        <p>Select a date or drag to select a range to see details.</p>
      </div>
    );
  }

  const rangeDisplay = selectedRange.end && selectedRange.end !== selectedRange.start
    ? `${format(parseISO(selectedRange.start), 'MMM d')} - ${format(parseISO(selectedRange.end), 'MMM d, yyyy')}`
    : format(parseISO(selectedRange.start), 'MMMM d, yyyy');

  return (
    <div className="booking-panel">
      <h3>
        <span>Bookings</span>
        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{rangeDisplay}</span>
      </h3>
      <div className="booking-list">
        {selectedBookings.length === 0 ? (
          <p className="no-bookings">No active bookings for this period.</p>
        ) : (
          selectedBookings.map(booking => {
            const nights = differenceInDays(parseISO(booking.checkOut), parseISO(booking.checkIn));
            
            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <strong>{booking.guestName}</strong>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="booking-details">
                  <div className="detail-item">
                    <span className="detail-label">Room</span>
                    <span className="detail-value">{booking.roomNumber} ({booking.roomType})</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nights</span>
                    <span className="detail-value">{nights} Nights</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Check-in</span>
                    <span className="detail-value">{booking.checkIn}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Check-out</span>
                    <span className="detail-value">{booking.checkOut}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total</span>
                    <span className="detail-value">₹{booking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Source</span>
                    <span className="detail-value">{booking.source}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
