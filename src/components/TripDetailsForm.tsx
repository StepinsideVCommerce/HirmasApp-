import React, { useEffect, useState } from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocationPicker from "@/components/LocationPicker";
import { BookingData } from "@/hooks/useBookingFlow";
import { hermasAdminSupabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";

interface TripDetailsFormProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onShowRoute: () => void;
}

const TripDetailsForm: React.FC<
  TripDetailsFormProps & { event: { id: number; [key: string]: any } }
> = ({ bookingData, updateBookingData, onShowRoute, event }) => {
  const isMultipleTrip = bookingData.serviceType === "Multiple Trip";
  const [hubs, setHubs] = useState<
    Database["public"]["Tables"]["Hub"]["Row"][]
  >([]);
  const [loadingHubs, setLoadingHubs] = useState(false);

  useEffect(() => {
    const fetchHubs = async () => {
      if (!event?.id || !bookingData.shift?.id) return;
      setLoadingHubs(true);
      const { data, error } = await hermasAdminSupabase
        .from("Hub")
        .select("*")
        .eq("event_id", event.id)
        .eq("shift_id", bookingData.shift.id);
      if (!error && data) setHubs(data);
      setLoadingHubs(false);
    };
    fetchHubs();
  }, [event, bookingData.shift]);

  // Check if locations are selected (for multiple trip, check all locations)
  const canShowRoute = isMultipleTrip
    ? bookingData.pickupLocation &&
      bookingData.firstStopLocation &&
      bookingData.dropoffLocation
    : bookingData.pickupLocation && bookingData.dropoffLocation;

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 relative overflow-visible">
      <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-xl p-6 max-w-full mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">
          Trip Details – Single Trip
        </h2>
        <div className="space-y-6">
          {/* From Section */}
          <div>
            <label className="text-white font-medium mb-2 block">From</label>
            <div className="space-y-4">
              <select
                className="w-full rounded-lg border border-gray-600 bg-gray-800/60 text-gray-200 px-4 py-3 mb-0 focus:ring-2 focus:ring-gold-500 placeholder-gray-500"
                value={bookingData.pickupHub?.id || ""}
                onChange={(e) => {
                  const hub = hubs.find((h) => h.id === Number(e.target.value));
                  if (hub) {
                    updateBookingData({
                      pickupHub: hub,
                      pickupLocation: hub.address,
                      pickupLat: hub.latitude,
                      pickupLng: hub.longitude,
                    });
                  }
                }}
                disabled={loadingHubs}
              >
                <option value="" disabled>
                  {loadingHubs ? "Loading hubs..." : "Select a pickup hub"}
                </option>
                {hubs.map((hub) => (
                  <option
                    key={hub.id}
                    value={hub.id}
                    className="bg-gray-900 text-gray-200"
                  >
                    {hub.name}
                  </option>
                ))}
              </select>
              <LocationPicker
                label="Or enter a place..."
                value={
                  bookingData.pickupHub ? "" : bookingData.pickupLocation || ""
                }
                onChange={(location) => {
                  updateBookingData({
                    pickupLocation: location.address,
                    pickupLat: location.lat,
                    pickupLng: location.lng,
                    pickupHub: undefined,
                  });
                }}
                placeholder="Or enter a place..."
                showCurrentLocation={false}
              />
              {/* Pickup Note for Single Trip */}
              {!isMultipleTrip && (
                <div>
                  <label className="text-white font-medium mb-2 block">
                    Pickup Note
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-600 bg-gray-800/60 text-gray-200 px-4 py-3 placeholder-gray-500 focus:ring-2 focus:ring-gold-500"
                    value={bookingData.pickupNote || ""}
                    onChange={(e) =>
                      updateBookingData({ pickupNote: e.target.value })
                    }
                    placeholder="Add a note for the pickup location (optional)"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section Separator */}
          <div className="border-t border-gray-700 my-6"></div>

          {/* To Section */}
          <div>
            <div className="space-y-4">
              <LocationPicker
                label={
                  isMultipleTrip ? "To (Second Stop - Final Destination)" : "To"
                }
                value={bookingData.dropoffLocation}
                onChange={(location) =>
                  updateBookingData({
                    dropoffLocation: location.address,
                    dropoffLat: location.lat,
                    dropoffLng: location.lng,
                  })
                }
                placeholder={
                  isMultipleTrip
                    ? "Enter final destination"
                    : "Enter destination"
                }
                showCurrentLocation={false}
              />
              {/* Dropoff Note for Single Trip */}
              {!isMultipleTrip && (
                <div>
                  <label className="text-white font-medium mb-2 block">
                    Dropoff Note
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-600 bg-gray-800/60 text-gray-200 px-4 py-3 placeholder-gray-500 focus:ring-2 focus:ring-gold-500"
                    value={bookingData.dropoffNote || ""}
                    onChange={(e) =>
                      updateBookingData({ dropoffNote: e.target.value })
                    }
                    placeholder="Add a note for the dropoff location (optional)"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Show on Map Button */}
          {/* {canShowRoute && (
            <Button
              onClick={onShowRoute}
              className="w-full h-12 bg-gradient-to-r from-gold-500 to-yellow-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-xl">🚗</span>
              Show Route on Map
            </Button>
          )} */}
        </div>
      </Card>
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
