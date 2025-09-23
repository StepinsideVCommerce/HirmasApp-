
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VehicleSelectionHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center">

        <h1 className="text-xl font-bold text-white">
          Select Vehicle & Route
        </h1>
        <div className="w-10"></div>
      </div>
    </div>
  );
};

export default VehicleSelectionHeader;
