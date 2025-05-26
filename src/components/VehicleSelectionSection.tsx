
import React from 'react';
import VehicleCarousel from '@/components/VehicleCarousel';

interface Vehicle {
  id: string;
  name: string;
  description: string;
  eta: string;
}

interface VehicleSelectionSectionProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string) => void;
}

const VehicleSelectionSection: React.FC<VehicleSelectionSectionProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">
        Choose your vehicle
      </h2>
      
      <VehicleCarousel
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onVehicleSelect={onVehicleSelect}
      />
    </div>
  );
};

export default VehicleSelectionSection;
