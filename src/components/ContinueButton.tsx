import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookingData } from "@/hooks/useBookingFlow";

interface ContinueButtonProps {
  bookingData: BookingData;
  selectedVehicle: string;
  onContinue?: () => void;
  disabled?: boolean;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  bookingData,
  selectedVehicle,
  onContinue,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = () => {
    if (!bookingData.pickupLocation || !bookingData.dropoffLocation) {
      toast({
        title: "Missing Locations",
        description: "Please enter both pickup and drop-off locations",
        variant: "destructive",
      });
      return;
    }

    const isMultipleTrip = bookingData.serviceType === "Multiple Trip";
    if (isMultipleTrip && !bookingData.firstStopLocation) {
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

    if (onContinue) {
      onContinue();
    } else {
      navigate("/user-info");
    }
  };

  const isMultipleTrip = bookingData.serviceType === "Multiple Trip";
  const isDisabled =
    !selectedVehicle ||
    !bookingData.pickupLocation ||
    !bookingData.dropoffLocation ||
    (isMultipleTrip && !bookingData.firstStopLocation) ||
    disabled;

  return (
    <Button
      onClick={handleContinue}
      disabled={isDisabled}
      className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity disabled:opacity-50 mb-6"
    >
      Next Step
    </Button>
  );
};

export default ContinueButton;
