import React from "react";
import VehicleCarousel from "@/components/VehicleCarousel";

interface Vehicle {
  type: string;
  count: number;
}

interface VehicleSelectionSectionProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onVehicleSelect: (carType: string) => void;
  loading?: boolean;
}

const VehicleSelectionSection: React.FC<VehicleSelectionSectionProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  loading,
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">
        Choose your vehicle
      </h2>
      {loading ? (
        <div className="text-slate-300 text-center py-8">
          Loading vehicles...
        </div>
      ) : (
        <VehicleCarousel
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={onVehicleSelect}
        />
      )}
    </div>
  );
};

export default VehicleSelectionSection;
