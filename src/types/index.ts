export interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  totalAmount: number;
  currency: string;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  source: string;
}

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface FilterState {
  roomType: string;
  status: string;
  source: string;
}
