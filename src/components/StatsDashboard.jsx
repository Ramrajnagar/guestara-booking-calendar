import React, { useMemo } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { TrendingUp, Users, Home, Clock } from 'lucide-react';

export const StatsDashboard = ({ 
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

    const totalCapacity = totalRooms * (totalDaysInRange || 1);
    const occupancyRate = (bookings.length / totalCapacity) * 100;

    const roomTypeCounts = {};
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
