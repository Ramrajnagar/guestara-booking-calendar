import React, { useMemo } from 'react';
import type { Booking } from '../types';
import { differenceInDays, parseISO } from 'date-fns';
import { TrendingUp, Users, Home, Clock } from 'lucide-react';

interface StatsDashboardProps {
  bookings: Booking[];
  totalDaysInRange: number;
  totalRooms?: number;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ 
  bookings, 
  totalDaysInRange,
  totalRooms = 10 
}) => {
  const stats = useMemo(() => {
    if (bookings.length === 0) return null;

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const avgStay = bookings.reduce((sum, b) => {
      return sum + differenceInDays(parseISO(b.checkOut), parseISO(b.checkIn));
    }, 0) / bookings.length;

    // Occupancy Rate: (Sum of nights occupied) / (Total rooms * days in range)
    // For simplicity, we'll calculate it based on the number of unique bookings in the selected range
    // versus total capacity.
    const totalCapacity = totalRooms * (totalDaysInRange || 1);
    // Actually, totalDaysInRange is days in range, but we need "nights" for occupancy.
    // If user selected 1 day, it's 1 night.
    const occupancyRate = (bookings.length / totalCapacity) * 100;

    const roomTypeCounts: Record<string, number> = {};
    bookings.forEach(b => {
      roomTypeCounts[b.roomType] = (roomTypeCounts[b.roomType] || 0) + 1;
    });
    
    const mostBookedRoom = Object.entries(roomTypeCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    return {
      totalRevenue,
      avgStay: avgStay.toFixed(1),
      occupancyRate: Math.min(occupancyRate, 100).toFixed(1),
      mostBookedRoom
    };
  }, [bookings, totalDaysInRange, totalRooms]);

  if (!stats) return null;

  return (
    <div className="stats-dashboard">
      <div className="stat-card">
        <div className="stat-icon revenue"><TrendingUp size={20} /></div>
        <div className="stat-info">
          <label>Total Revenue</label>
          <span className="stat-value">₹{stats.totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon occupancy"><Users size={20} /></div>
        <div className="stat-info">
          <label>Occupancy Rate</label>
          <span className="stat-value">{stats.occupancyRate}%</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon room"><Home size={20} /></div>
        <div className="stat-info">
          <label>Top Room Type</label>
          <span className="stat-value">{stats.mostBookedRoom}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon duration"><Clock size={20} /></div>
        <div className="stat-info">
          <label>Avg. Stay</label>
          <span className="stat-value">{stats.avgStay} days</span>
        </div>
      </div>
    </div>
  );
};
