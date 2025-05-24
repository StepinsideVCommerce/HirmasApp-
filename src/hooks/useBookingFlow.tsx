
import { useState } from 'react';

export interface BookingData {
  pickupLocation: string;
  dropoffLocation: string;
  guestName: string;
  phoneNumber: string;
  guestCategory: string;
  carType: string;
  serviceType: string;
  useGPS: boolean;
  pickupDate: string;
  pickupTime: string;
  passengerCount: number;
}

export const useBookingFlow = () => {
  const [bookingData, setBookingData] = useState<BookingData>({
    pickupLocation: '',
    dropoffLocation: '',
    guestName: '',
    phoneNumber: '',
    guestCategory: 'other',
    carType: '',
    serviceType: 'Single Trip',
    useGPS: false,
    pickupDate: '',
    pickupTime: '',
    passengerCount: 1,
  });

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  return { bookingData, updateBookingData };
};
