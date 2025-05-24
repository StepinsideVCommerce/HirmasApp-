
import React from 'react';
import { Car, Clock } from 'lucide-react';

interface VehicleCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  eta: string;
  isSelected: boolean;
  onClick: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  name,
  description,
  image,
  eta,
  isSelected,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'bg-yellow-500/20 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20'
          : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
          <Car className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-slate-400 text-sm">{description}</p>
          <div className="flex items-center mt-2">
            <div className="flex items-center text-slate-400">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{eta}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
