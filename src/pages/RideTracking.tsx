import React, { useEffect, useState } from "react";
import { MapPin, Clock, Car, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { hermasAdminSupabase } from "@/integrations/supabase/client";

const RideTracking = () => {
  const location = useLocation();
  const [rideStage, setRideStage] = useState(0);
  const [driver, setDriver] = useState<any>(null);
  const [car, setCar] = useState<any>(null);
  const [pendingRide, setPendingRide] = useState<any>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      const idStr = sessionStorage.getItem("pendingRideId");
      if (!idStr) return;
      // 1. Fetch PendingRides row
      const { data: ride } = await hermasAdminSupabase
        .from("PendingRides")
        .select("*, car_id, pickupTime")
        .eq("id", idStr)
        .single();
      setPendingRide(ride);
      if (ride && ride.car_id) {
        // 2. Fetch Car object
        const { data: carObj } = await hermasAdminSupabase
          .from("Cars")
          .select("*, driver_id")
          .eq("id", ride.car_id)
          .single();
        setCar(carObj);
        if (carObj && carObj.driver_id) {
          // 3. Fetch Driver
          const { data: driverObj } = await hermasAdminSupabase
            .from("Drivers")
            .select("*")
            .eq("id", carObj.driver_id)
            .single();
          setDriver(driverObj);
        }
      }
    };
    fetchTrackingData();
  }, []);

  const driverInfo =
    driver && car && pendingRide
      ? {
          name: driver.name,
          driverNumber: driver.driverNumber,
          phone: driver.phoneNumber,
          vehicle: car.type + " VH-" + car.carNumber,
          plate: car.carNumber,
          licensePlate: car.licensePlate,
          color: car.color,
          eta: "On the way", // You can enhance this with real ETA logic
          rating: driver.rating || "-",
          tripTime: "10 minutes", // Set to 10 minutes
          arrivalTime: pendingRide.pickupTime || "-",
          tripId: pendingRide.id,
        }
      : null;

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Map Area (Simulated) */}
      <div className="relative flex-1 bg-slate-800">
        {/* Animated Car Moving Along Route */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-3/4 h-0.5 bg-slate-600">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
              style={{ left: "15%" }}
            >
              <div className="relative -mt-2 -ml-2">
                <Car className="w-6 h-6 text-white transform -rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 pointer-events-none"></div>

        {/* Back Button */}
        <div className="absolute top-6 left-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-slate-800/50 backdrop-blur text-white hover:bg-slate-700"
          >
            <MapPin className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Trip Info Panel */}
      <div className="relative bg-slate-900 rounded-t-3xl -mt-10 z-10 px-4 pt-6 pb-8">
        <div className="w-16 h-1 bg-slate-700 mx-auto mb-6 rounded-full"></div>

        {/* Status Bar */}
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold">
                Your driver is on the way
              </h2>
              <p className="text-slate-400 text-sm">
                Arriving in {driverInfo?.eta}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
              <Car className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          {driverInfo ? (
            <div className="flex items-center mb-3">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-yellow-500">
                  {driverInfo.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">
                    {driverInfo.name}
                  </h3>
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded ml-2">
                    DR-{driverInfo.driverNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-400">{car?.type}</span>
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                    VH-{car?.carNumber}
                  </span>
                  <span className="bg-slate-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                    {driverInfo.licensePlate}
                  </span>
                  {driverInfo.color && (
                    <span
                      className="inline-block w-6 h-6 rounded-full border-2 border-slate-700 align-middle"
                      style={{ backgroundColor: driverInfo.color }}
                      title={driverInfo.color}
                    ></span>
                  )}
                </div>
                <div className="text-slate-400 text-sm mt-1">
                  Phone:{" "}
                  <span className="text-white font-medium">
                    {driverInfo.phone}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400">Loading driver info...</div>
          )}
        </div>

        {/* Trip Details */}
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <h3 className="text-white font-semibold mb-3">Trip Details</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-slate-300">Estimated trip time</span>
              </div>
              <span className="text-white">
                {driverInfo ? driverInfo.tripTime : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-slate-300">Arrival time</span>
              </div>
              <span className="text-white">
                {driverInfo ? driverInfo.arrivalTime : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Safety Feature */}
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-yellow-500 mr-3" />
            <div>
              <h4 className="text-white font-medium">Trip Protected</h4>
              <p className="text-slate-400 text-sm">
                24/7 support & safety features
              </p>
            </div>
          </div>
        </div>

        {/* Ride Status */}
        <div className="text-center mt-3">
          <p className="text-slate-400 text-sm">
            Trip ID:{" "}
            <span className="text-white font-mono">
              {driverInfo ? driverInfo.tripId : "-"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RideTracking;
