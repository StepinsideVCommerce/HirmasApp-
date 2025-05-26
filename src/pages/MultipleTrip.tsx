
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import LocationPicker from "@/components/LocationPicker";
import RouteMapModal from "@/components/RouteMapModal";

const MultipleTrip = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFlow();
  const [isRouteMapOpen, setIsRouteMapOpen] = useState(false);

  // Ensure we're in multiple trip mode
  useEffect(() => {
    if (bookingData.serviceType !== "Multiple Trip") {
      updateBookingData({ serviceType: "Multiple Trip" });
    }
  }, [bookingData.serviceType, updateBookingData]);

  // Check if all locations are filled to enable "Show Route" button
  const canShowRoute =
    Boolean(bookingData.pickupLocation?.trim()) &&
    Boolean(bookingData.firstStopLocation?.trim()) &&
    Boolean(bookingData.dropoffLocation?.trim());

  // Check if enough locations are filled to enable "Continue" button
  // Simplified check to debug the issue
  const pickupFilled =
    bookingData.pickupLocation && bookingData.pickupLocation.length > 0;
  const firstStopFilled =
    bookingData.firstStopLocation && bookingData.firstStopLocation.length > 0;
  const dropoffFilled =
    bookingData.dropoffLocation && bookingData.dropoffLocation.length > 0;

  const canContinue = pickupFilled && firstStopFilled && dropoffFilled;

  // Additional debugging for individual field checks
  const pickupValid = Boolean(bookingData.pickupLocation?.trim());
  const firstStopValid = Boolean(bookingData.firstStopLocation?.trim());
  const dropoffValid = Boolean(bookingData.dropoffLocation?.trim());

  // Debug logging to check values
  React.useEffect(() => {
    console.log("MultipleTrip - Booking Data:", {
      pickupLocation: `'${bookingData.pickupLocation}'`,
      firstStopLocation: `'${bookingData.firstStopLocation}'`,
      dropoffLocation: `'${bookingData.dropoffLocation}'`,
      pickupFilled,
      firstStopFilled,
      dropoffFilled,
      pickupValid,
      firstStopValid,
      dropoffValid,
      canContinue,
    });
  }, [
    bookingData.pickupLocation,
    bookingData.firstStopLocation,
    bookingData.dropoffLocation,
    pickupFilled,
    firstStopFilled,
    dropoffFilled,
    pickupValid,
    firstStopValid,
    dropoffValid,
    canContinue,
  ]);

  const handleContinue = () => {
    navigate("/vehicles");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Multiple Trip Route</h1>
          <div className="w-10" /> {/* Spacer for center alignment */}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Trip Instructions */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">
            Plan Your Multiple Location Trip
          </h2>
          <p className="text-slate-300 text-sm">
            Set up your journey with one pickup location and multiple stops. The
            colored markers will help you visualize your route:
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-slate-300">Green: Pickup location</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-slate-300">Purple: First stop</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-slate-300">
                Red: Final destination (Second stop)
              </span>
            </div>
          </div>
        </div>

        {/* Location Form */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 relative overflow-visible">
          <h2 className="text-lg font-semibold text-white mb-6">
            Route Details
          </h2>

          <div className="relative mb-6 overflow-visible">
            {/* From Location */}
            <div className="relative z-30 mb-8">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="ml-12">
                <LocationPicker
                  label="From (Pickup Location)"
                  value={bookingData.pickupLocation}
                  onChange={(value) =>
                    updateBookingData({ pickupLocation: value })
                  }
                  placeholder="Enter pickup location"
                  showCurrentLocation={true}
                />
              </div>
            </div>

            {/* Connection line */}
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-yellow-500"></div>

            {/* First Stop */}
            <div className="relative z-20 mb-8">
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
                  showCurrentLocation={true}
                />
              </div>
            </div>

            {/* Second Stop (Final Destination) */}
            <div className="relative z-10">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="ml-12">
                <LocationPicker
                  label="To (Second Stop - Final Destination)"
                  value={bookingData.dropoffLocation}
                  onChange={(value) =>
                    updateBookingData({ dropoffLocation: value })
                  }
                  placeholder="Enter final destination"
                  showCurrentLocation={true}
                />
              </div>
            </div>
          </div>

          {/* Show Route Button */}
          {canShowRoute && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => setIsRouteMapOpen(true)}
                variant="outline"
                className="bg-slate-700/50 border-yellow-500/30 text-white hover:bg-yellow-500/10 hover:border-yellow-500 transition-all duration-200"
              >
                <Map className="w-4 h-4 mr-2" />
                Show Route on Map
              </Button>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`w-full py-4 text-lg font-semibold transition-all duration-200 ${
              canContinue
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            {canContinue
              ? "Continue to Vehicle Selection"
              : "Please fill required locations"}
          </Button>
        </div>
      </div>

      {/* Route Map Modal */}
      <RouteMapModal
        isOpen={isRouteMapOpen}
        onClose={() => setIsRouteMapOpen(false)}
        pickupLocation={bookingData.pickupLocation}
        dropoffLocation={bookingData.dropoffLocation}
        firstStopLocation={bookingData.firstStopLocation}
        secondFromLocation=""
        isMultipleTrip={true}
      />

      {/* Bottom padding to account for fixed button */}
      <div className="h-24"></div>
    </div>
  );
};

export default MultipleTrip;
