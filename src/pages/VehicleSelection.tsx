
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { useToast } from "@/hooks/use-toast";
import LocationPicker from "@/components/LocationPicker";
import RouteMapModal from "@/components/RouteMapModal";
import VehicleCarousel from "@/components/VehicleCarousel";

const VehicleSelection = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFlow();
  const { toast } = useToast();
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

  const handleContinue = () => {
    if (!bookingData.pickupLocation || !bookingData.dropoffLocation) {
      toast({
        title: "Missing Locations",
        description: "Please enter both pickup and drop-off locations",
        variant: "destructive",
      });
      return;
    }

    if (isMultipleTrip && (!bookingData.secondFromLocation || !bookingData.firstStopLocation)) {
      toast({
        title: "Missing Locations",
        description: "Please enter all required locations for multiple trip",
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

  const isMultipleTrip = bookingData.serviceType === 'Multiple Trip';
  
  // Check if locations are selected (for multiple trip, check all locations)
  const canShowRoute = isMultipleTrip 
    ? bookingData.pickupLocation && bookingData.secondFromLocation && bookingData.firstStopLocation && bookingData.dropoffLocation
    : bookingData.pickupLocation && bookingData.dropoffLocation;

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
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 relative overflow-visible">
          <h2 className="text-lg font-semibold text-white mb-4">
            Trip Details - {bookingData.serviceType || 'Single Trip'}
          </h2>

          <div className="relative mb-6 overflow-visible">
            {/* First From Location */}
            <div className="relative z-30 mb-8">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="ml-12">
                <LocationPicker
                  label="From (1st Location)"
                  value={bookingData.pickupLocation}
                  onChange={(value) =>
                    updateBookingData({ pickupLocation: value })
                  }
                  placeholder="Enter first pickup location"
                  showCurrentLocation={true}
                />
              </div>
            </div>

            {/* Multiple Trip: Second From Location */}
            {isMultipleTrip && (
              <div className="relative z-25 mb-8">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-yellow-500 my-12"></div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="ml-12">
                  <LocationPicker
                    label="From (2nd Location)"
                    value={bookingData.secondFromLocation || ''}
                    onChange={(value) =>
                      updateBookingData({ secondFromLocation: value })
                    }
                    placeholder="Enter second pickup location"
                    showCurrentLocation={true}
                  />
                </div>
              </div>
            )}

            {/* Multiple Trip: First Stop */}
            {isMultipleTrip && (
              <div className="relative z-20 mb-8">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-yellow-500 my-12"></div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="ml-12">
                  <LocationPicker
                    label="First Stop"
                    value={bookingData.firstStopLocation || ''}
                    onChange={(value) =>
                      updateBookingData({ firstStopLocation: value })
                    }
                    placeholder="Enter first stop location"
                    showCurrentLocation={true}
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
                  label="To"
                  value={bookingData.dropoffLocation}
                  onChange={(value) =>
                    updateBookingData({ dropoffLocation: value })
                  }
                  placeholder="Enter destination"
                  showCurrentLocation={true}
                />
              </div>
            </div>
          </div>

          {/* Show on Map Button */}
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

        {/* Vehicle Selection Carousel */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Choose your vehicle
          </h2>
          
          <VehicleCarousel
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={handleVehicleSelect}
          />
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={
            !selectedVehicle ||
            !bookingData.pickupLocation ||
            !bookingData.dropoffLocation ||
            (isMultipleTrip && (!bookingData.secondFromLocation || !bookingData.firstStopLocation))
          }
          className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity disabled:opacity-50 mb-6"
        >
          Next Step
        </Button>
      </div>

      {/* Route Map Modal */}
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
