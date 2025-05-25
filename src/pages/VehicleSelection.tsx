import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Car, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { useToast } from "@/hooks/use-toast";
import LocationPicker from "@/components/LocationPicker";
import MapComponent from "@/components/MapComponent";

const VehicleSelection = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFlow();
  const { toast } = useToast();

  // Initialize selectedVehicle from bookingData.carType
  const [selectedVehicle, setSelectedVehicle] = useState("");

  // Sync selectedVehicle with bookingData.carType when component mounts
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
      description: "Mercedes S-Class or equivalent",
      image: "",
      eta: "3-5 min",
    },
    {
      id: "suv",
      name: "Premium SUV",
      description: "BMW X7 or equivalent",
      image: "",
      eta: "5-8 min",
    },
    {
      id: "minibus",
      name: "Executive Minibus",
      description: "Mercedes Sprinter - Up to 12 passengers",
      image: "",
      eta: "8-12 min",
    },
    {
      id: "other",
      name: "Custom Request",
      description: "Special vehicle requirements",
      image: "",
      eta: "On request",
    },
  ];

  const handleVehicleSelect = (vehicleId: string) => {
    console.log("Vehicle selected:", vehicleId);
    setSelectedVehicle(vehicleId);
    updateBookingData({ carType: vehicleId });
  };

  const handleContinue = () => {
    if (!bookingData.pickupLocation || !bookingData.dropoffLocation) {
      toast({
        title: "Missing Locations",
        description: "Please enter both pickup and drop-off locations",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVehicle) {
      toast({
        title: "Selection Required",
        description: "Please select a vehicle",
        variant: "destructive",
      });
      return;
    }

    navigate("/user-info");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="bg-slate-800/50 backdrop-blur-sm text-white hover:bg-slate-700/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <h1 className="text-xl font-bold text-white">
            Select Vehicle & Route
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Location Inputs */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Trip Details
          </h2>

          <div className="relative mb-6">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-yellow-500 my-12"></div>

            <div className="relative z-10 mb-4">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              <div className="ml-12">
                <LocationPicker
                  label="From"
                  value={bookingData.pickupLocation}
                  onChange={(value) =>
                    updateBookingData({ pickupLocation: value })
                  }
                  placeholder="Enter pickup location"
                />
              </div>
            </div>

            <div className="relative z-10">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-yellow-500 bg-slate-900"></div>
              <div className="ml-12">
                <LocationPicker
                  label="To"
                  value={bookingData.dropoffLocation}
                  onChange={(value) =>
                    updateBookingData({ dropoffLocation: value })
                  }
                  placeholder="Enter destination"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Choose your vehicle
          </h2>

          <div className="grid gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => handleVehicleSelect(vehicle.id)}
                className={`relative overflow-hidden group cursor-pointer p-6 rounded-xl transition-all duration-300 ${
                  selectedVehicle === vehicle.id
                    ? "bg-yellow-500/20 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20"
                    : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Car className="w-12 h-12 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">
                      {vehicle.name}
                    </h3>
                    <p className="text-slate-300">{vehicle.description}</p>

                    <div className="flex items-center mt-3">
                      <div className="flex items-center text-slate-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{vehicle.eta}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedVehicle === vehicle.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map Component */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Route Preview & Search
          </h2>
          <div className="h-[500px] rounded-lg overflow-hidden">
            <MapComponent
              pickupLocation={bookingData.pickupLocation}
              dropoffLocation={bookingData.dropoffLocation}
            />
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={
            !selectedVehicle ||
            !bookingData.pickupLocation ||
            !bookingData.dropoffLocation
          }
          className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity disabled:opacity-50 mb-6"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default VehicleSelection;
