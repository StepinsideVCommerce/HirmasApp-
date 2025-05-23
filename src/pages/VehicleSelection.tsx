
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { motion } from 'framer-motion';
import VehicleCarousel from '@/components/VehicleCarousel';

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 py-8"
      >
        <div className="flex items-center mb-8">
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

        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-effect rounded-xl p-6 mb-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Car className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Available Vehicles</h2>
            </div>
            
            <VehicleCarousel 
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={setSelectedVehicle}
              onContinue={handleContinue}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VehicleSelection;
