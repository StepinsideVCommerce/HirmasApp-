
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VehicleSelectionHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default VehicleSelectionHeader;
