
import { useState, useEffect } from 'react';

export interface BookingData {
  pickupLocation: string;
  dropoffLocation: string;
  firstStopLocation?: string;
  secondFromLocation?: string; // New field for the second from location
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

const STORAGE_KEY = 'booking-data';

export const useBookingFlow = () => {
  // Initialize with data from localStorage if available
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored booking data:', error);
      }
    }
    return {
      pickupLocation: '',
      dropoffLocation: '',
      firstStopLocation: '',
      secondFromLocation: '',
      guestName: '',
      phoneNumber: '',
      guestCategory: 'other',
      carType: '',
      serviceType: 'Single Trip',
      useGPS: false,
      pickupDate: '',
      pickupTime: '',
      passengerCount: 1,
    };
  });

  // Save to localStorage whenever bookingData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
    console.log('Booking data updated:', bookingData);
  }, [bookingData]);

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => {
      const newData = { ...prev, ...updates };
      console.log('Updating booking data with:', updates);
      console.log('New booking data:', newData);
      return newData;
    });
  };

  const clearBookingData = () => {
    const initialData = {
      pickupLocation: '',
      dropoffLocation: '',
      firstStopLocation: '',
      secondFromLocation: '',
      guestName: '',
      phoneNumber: '',
      guestCategory: 'other',
      carType: '',
      serviceType: 'Single Trip',
      useGPS: false,
      pickupDate: '',
      pickupTime: '',
      passengerCount: 1,
    };
    setBookingData(initialData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { bookingData, updateBookingData, clearBookingData };
};
