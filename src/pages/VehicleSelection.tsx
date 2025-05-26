
import React, { useState, useEffect } from "react";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import RouteMapModal from "@/components/RouteMapModal";
import VehicleSelectionHeader from "@/components/VehicleSelectionHeader";
import TripDetailsForm from "@/components/TripDetailsForm";
import VehicleSelectionSection from "@/components/VehicleSelectionSection";
import ContinueButton from "@/components/ContinueButton";

const VehicleSelection = () => {
  const { bookingData, updateBookingData } = useBookingFlow();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [isRouteMapOpen, setIsRouteMapOpen] = useState(false);

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

  const vehicles = [
    {
      id: "luxury-sedan",
      name: "Luxury Sedan",
      description: "Premium comfort for business travel",
      eta: "3-5 min",
    },
    {
      id: "suv",
      name: "SUV",
      description: "Spacious and comfortable for families",
      eta: "5-8 min",
    },
    {
      id: "vip-bus-28",
      name: "VIP Bus 28 Seaters",
      description: "Luxury group transportation",
      eta: "15-20 min",
    },
    {
      id: "mercedes-sprinter",
      name: "Mercedes Sprinter Bus",
      description: "Premium group travel experience",
      eta: "12-15 min",
    },
    {
      id: "shuttle-bus-18",
      name: "18 Seaters Shuttle Bus",
      description: "Comfortable medium group transport",
      eta: "10-15 min",
    },
    {
      id: "hiace-10",
      name: "10 Seaters Hiace",
      description: "Reliable group transportation",
      eta: "8-12 min",
    },
    {
      id: "staria-mercedes",
      name: "Staria Mercedes",
      description: "Modern luxury van",
      eta: "6-10 min",
    },
    {
      id: "vito-bus-5",
      name: "Vito Bus 5 Seaters",
      description: "Compact luxury transport",
      eta: "5-8 min",
    },
    {
      id: "normal-sedan",
      name: "Normal Sedan",
      description: "Economical and reliable transport",
      eta: "3-5 min",
    },
  ];

  const handleVehicleSelect = (vehicleId: string) => {
    console.log("Vehicle selected:", vehicleId);
    setSelectedVehicle(vehicleId);
    updateBookingData({ carType: vehicleId });
  };

  const isMultipleTrip = bookingData.serviceType === 'Multiple Trip';

  return (
    <div className="min-h-screen bg-slate-900">
      <VehicleSelectionHeader />

      <div className="px-4 space-y-6">
        <TripDetailsForm
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          onShowRoute={() => setIsRouteMapOpen(true)}
        />

        <VehicleSelectionSection
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={handleVehicleSelect}
        />

        <ContinueButton
          bookingData={bookingData}
          selectedVehicle={selectedVehicle}
        />
      </div>

      <RouteMapModal
        isOpen={isRouteMapOpen}
        onClose={() => setIsRouteMapOpen(false)}
        pickupLocation={bookingData.pickupLocation}
        dropoffLocation={bookingData.dropoffLocation}
        firstStopLocation={bookingData.firstStopLocation}
        secondFromLocation={bookingData.secondFromLocation}
        isMultipleTrip={isMultipleTrip}
      />
    </div>
  );
};

export default VehicleSelection;
