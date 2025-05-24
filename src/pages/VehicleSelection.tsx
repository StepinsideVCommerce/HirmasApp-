
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VehicleCard from '@/components/VehicleCard';
import { useBookingFlow } from '@/hooks/useBookingFlow';

const VehicleSelection = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFlow();
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const vehicles = [
    {
      id: 'luxury-sedan',
      name: 'Luxury Sedan',
      description: 'Mercedes S-Class or equivalent',
      image: '',
      eta: '3-5 min',
      price: 'Premium'
    },
    {
      id: 'suv',
      name: 'Premium SUV',
      description: 'BMW X7 or equivalent',
      image: '',
      eta: '5-8 min',
      price: 'Executive'
    },
    {
      id: 'minibus',
      name: 'Executive Minibus',
      description: 'Mercedes Sprinter - Up to 12 passengers',
      image: '',
      eta: '8-12 min',
      price: 'Group'
    },
    {
      id: 'other',
      name: 'Custom Request',
      description: 'Special vehicle requirements',
      image: '',
      eta: 'On request',
      price: 'Quote'
    }
  ];

  const handleContinue = () => {
    if (!selectedVehicle) {
      alert('Please select a vehicle');
      return;
    }
    updateBookingData({ carType: selectedVehicle });
    navigate('/review');
  };

  return (
    <div className="min-h-screen luxury-gradient">
      {/* Header */}
      <div className="px-6 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mr-4 text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Select Vehicle</h1>
            <p className="text-slate-400">Choose your preferred transportation</p>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Car className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Available Vehicles</h2>
            </div>
            
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  {...vehicle}
                  isSelected={selectedVehicle === vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                />
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={handleContinue}
            disabled={!selectedVehicle}
            className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Continue to Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelection;
