import React from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocationPicker from "@/components/LocationPicker";
import { BookingData } from "@/hooks/useBookingFlow";

interface TripDetailsFormProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onShowRoute: () => void;
}

const TripDetailsForm: React.FC<TripDetailsFormProps> = ({
  bookingData,
  updateBookingData,
  onShowRoute,
}) => {
  const isMultipleTrip = bookingData.serviceType === "Multiple Trip";

  // Check if locations are selected (for multiple trip, check all locations)
  const canShowRoute = isMultipleTrip
    ? bookingData.pickupLocation &&
      bookingData.firstStopLocation &&
      bookingData.dropoffLocation
    : bookingData.pickupLocation && bookingData.dropoffLocation;

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 relative overflow-visible">
      <h2 className="text-lg font-semibold text-white mb-4">
        Trip Details - {bookingData.serviceType || "Single Trip"}
      </h2>

      <div className="relative mb-6 overflow-visible">
        {/* From Location */}
        <div className="relative z-30 mb-8">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="ml-12">
            <LocationPicker
              label={isMultipleTrip ? "From (Pickup Location)" : "From"}
              value={bookingData.pickupLocation}
              onChange={(value) => updateBookingData({ pickupLocation: value })}
              placeholder={
                isMultipleTrip
                  ? "Enter pickup location"
                  : "Enter pickup location"
              }
              showCurrentLocation={true}
            />
          </div>
        </div>

        {/* Multiple Trip: First Stop */}
        {isMultipleTrip && (
          <div className="relative z-20 mb-8">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-yellow-500 my-12"></div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="ml-12">
              <LocationPicker
                label="To (First Stop)"
                value={bookingData.firstStopLocation || ""}
                onChange={(value) =>
                  updateBookingData({ firstStopLocation: value })
                }
                placeholder="Enter first stop location"
                showCurrentLocation={false}
              />
            </div>
          </div>
        )}

        {/* Connection line for single trip or to final destination */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-yellow-500 my-12"></div>

        {/* To Location */}
        <div className="relative z-10">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="ml-12">
            <LocationPicker
              label={
                isMultipleTrip ? "To (Second Stop - Final Destination)" : "To"
              }
              value={bookingData.dropoffLocation}
              onChange={(value) =>
                updateBookingData({ dropoffLocation: value })
              }
              placeholder={
                isMultipleTrip ? "Enter final destination" : "Enter destination"
              }
              showCurrentLocation={false}
            />
          </div>
        </div>
      </div>

      {/* Show on Map Button */}
      {canShowRoute && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onShowRoute}
            variant="outline"
            className="bg-slate-700/50 border-yellow-500/30 text-white hover:bg-yellow-500/10 hover:border-yellow-500 transition-all duration-200"
          >
            <Map className="w-4 h-4 mr-2" />
            Show Route on Map
          </Button>
        </div>
      )}
    </div>
  );
};

export default TripDetailsForm;
