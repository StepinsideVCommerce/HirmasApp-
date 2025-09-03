import React, { useState, useEffect } from "react";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import RouteMapModal from "@/components/RouteMapModal";
import VehicleSelectionHeader from "@/components/VehicleSelectionHeader";
import TripDetailsForm from "@/components/TripDetailsForm";
import VehicleSelectionSection from "@/components/VehicleSelectionSection";
import ContinueButton from "@/components/ContinueButton";
import { useLocation, useNavigate } from "react-router-dom";
import { hermasAdminSupabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const VehicleSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let event = location.state?.event;
  if (!event) {
    const stored = sessionStorage.getItem("selectedEvent");
    if (stored) {
      event = JSON.parse(stored);
    }
  }
  const { bookingData, updateBookingData } = useBookingFlow();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [isRouteMapOpen, setIsRouteMapOpen] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize selectedVehicle from bookingData.carType
  useEffect(() => {
    if (bookingData.carType) {
      setSelectedVehicle(bookingData.carType);
      console.log(
        "Syncing selected vehicle from booking data:",
        bookingData.carType
      );
    }
  }, [bookingData.carType]);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!event?.id || !bookingData.shift?.id) {
        setVehicles([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      // 1. Get all drivers for the selected shift and event
      const { data: drivers, error: driversError } = await hermasAdminSupabase
        .from("Drivers")
        .select("id")
        .eq("shift_id", bookingData.shift.id)
        .eq("event_id", event.id);
      if (driversError || !drivers || drivers.length === 0) {
        setVehicles([]);
        setLoading(false);
        return;
      }
      const driverIds = drivers.map((d) => d.id);
      // 2. Get all cars for these drivers and event
      const { data: cars, error: carsError } = await hermasAdminSupabase
        .from("Cars")
        .select("id, type, carNumber, driver_id")
        .in("driver_id", driverIds)
        .eq("event_id", event.id);
      if (carsError || !cars) {
        setVehicles([]);
        setLoading(false);
        return;
      }
      // Fetch all PendingRides for this event
      const { data: pendingRides } = await hermasAdminSupabase
        .from("PendingRides")
        .select("car_id, status")
        .eq("event_id", event.id);
      // Filter cars: exclude cars assigned to a PendingRide unless status is 'End'
      const filteredCars = cars.filter((car) => {
        const assignedRide = pendingRides?.find((r) => r.car_id === car.id);
        return !assignedRide || assignedRide.status === "End";
      });
      // Group cars by type and count available cars for each type
      const carTypeCounts: Record<string, number> = {};
      filteredCars.forEach((car) => {
        if (car.type) {
          carTypeCounts[car.type] = (carTypeCounts[car.type] || 0) + 1;
        }
      });
      // Prepare vehicle list as car types with counts
      const vehiclesByType = Object.entries(carTypeCounts).map(
        ([type, count]) => ({
          type,
          count,
        })
      );
      setVehicles(vehiclesByType);
      setLoading(false);
    };
    fetchVehicles();
  }, [event, bookingData.shift]);

  const handleVehicleSelect = (carType: string) => {
    setSelectedVehicle(carType);
    updateBookingData({ carType });
  };

  const handleContinue = () => {
    navigate("/user-info", { state: { event } });
  };

  const isMultipleTrip = bookingData.serviceType === "Multiple Trip";

  return (
    <div className="min-h-screen bg-slate-900">
      <VehicleSelectionHeader />
      <div className="px-4 space-y-6">
        <TripDetailsForm
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          onShowRoute={() => setIsRouteMapOpen(true)}
          event={event}
        />
        <VehicleSelectionSection
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={handleVehicleSelect}
          loading={loading}
        />
        <ContinueButton
          bookingData={bookingData}
          selectedVehicle={selectedVehicle}
          onContinue={handleContinue}
        />
      </div>

      <RouteMapModal
        isOpen={isRouteMapOpen}
        onClose={() => setIsRouteMapOpen(false)}
        pickupLocation={bookingData.pickupLocation}
        dropoffLocation={bookingData.dropoffLocation}
        firstStopLocation={bookingData.firstStopLocation}
        secondFromLocation=""
        isMultipleTrip={isMultipleTrip}
      />
    </div>
  );
};

export default VehicleSelection;
