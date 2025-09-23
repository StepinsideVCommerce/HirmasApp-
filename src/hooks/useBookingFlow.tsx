import { useState, useEffect } from "react";
import { defaultDialCode } from "@/data/countryDialCodes";

export interface BookingData {
  pickupLocation: string;
  pickupNote?: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  dropoffLocation: string;
  dropoffNote?: string;
  firstStopLocation?: string;
  secondFromLocation?: string; // New field for the second from location
  guestName: string;
  phoneNumber: string;
  phoneCountryCode: string;
  guestCategory: string;
  carType: string;
  car?: any; // Add car object to booking data
  shift?: any; // Add shift object to booking data
  serviceType: string;
  useGPS: boolean;
  pickupDate: string;
  pickupTime: string;
  passengerCount: number;
  pickupHub?: import("@/integrations/supabase/types").Database["public"]["Tables"]["Hub"]["Row"];
  event?: { id: number; [key: string]: any };
}

const STORAGE_KEY = "booking-data";

export const useBookingFlow = () => {
  // Initialize with data from localStorage if available
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.phoneCountryCode) {
          parsed.phoneCountryCode = defaultDialCode;
        }
        return parsed;
      } catch (error) {
        console.error("Error parsing stored booking data:", error);
      }
    }
    return {
      pickupLocation: "",
      dropoffLocation: "",
      firstStopLocation: "",
      secondFromLocation: "",
      guestName: "",
      phoneNumber: "",
      phoneCountryCode: defaultDialCode,
      guestCategory: "other",
      carType: "",
      serviceType: "Single Trip",
      useGPS: false,
      pickupDate: "",
      pickupTime: "",
      passengerCount: 1,
    };
  });

  // Save to localStorage whenever bookingData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
    console.log("Booking data updated:", bookingData);
  }, [bookingData]);

  // Clear localStorage on page refresh/unload
  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     localStorage.removeItem(STORAGE_KEY);
  //     console.log("Local storage cleared on page refresh");
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData((prev) => {
      const newData = { ...prev, ...updates };
      console.log("Updating booking data with:", updates);
      console.log("New booking data:", newData);
      return newData;
    });
  };

  const clearBookingData = () => {
    const initialData = {
      pickupLocation: "",
      dropoffLocation: "",
      firstStopLocation: "",
      secondFromLocation: "",
      guestName: "",
      phoneNumber: "",
      phoneCountryCode: defaultDialCode,
      guestCategory: "other",
      carType: "",
      serviceType: "Single Trip",
      useGPS: false,
      pickupDate: "",
      pickupTime: "",
      passengerCount: 1,
    };
    setBookingData(initialData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { bookingData, updateBookingData, clearBookingData };
};
