
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { motion } from 'framer-motion';
import EnhancedVehicleCarousel from '@/components/EnhancedVehicleCarousel';
import StepNavigation from '@/components/StepNavigation';

const VehicleSelection = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFlow();
  const [selectedVehicle, setSelectedVehicle] = useState(bookingData.carType || '');

  const vehicles = [
    {
      id: 'luxury-sedan',
      name: 'Luxury Sedan',
      description: 'Mercedes S-Class or equivalent',
      image: '',
      eta: '3-5 min',
      price: 'Premium',
      capacity: 4
    },
    {
      id: 'suv',
      name: 'Premium SUV',
      description: 'BMW X7 or equivalent',
      image: '',
      eta: '5-8 min',
      price: 'Executive',
      capacity: 6
    },
    {
      id: 'minibus',
      name: 'Executive Minibus',
      description: 'Mercedes Sprinter - Up to 12 passengers',
      image: '',
      eta: '8-12 min',
      price: 'Group',
      capacity: 12
    },
    {
      id: 'other',
      name: 'Custom Request',
      description: 'Special vehicle requirements',
      image: '',
      eta: 'On request',
      price: 'Quote',
      capacity: 4
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
    <motion.div 
      className="min-h-screen luxury-gradient"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mr-4 text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Select Your Ride</h1>
            <p className="text-slate-400">Choose your preferred vehicle</p>
          </div>
        </motion.div>

        <StepNavigation currentStep={2} maxStep={2} />

        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-effect rounded-xl p-6 mb-6"
          >
            {/* Trip Info Summary */}
            <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <h3 className="text-white font-medium mb-2">Trip Summary</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-400">Pickup</p>
                  <p className="text-sm text-white truncate">{bookingData.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Dropoff</p>
                  <p className="text-sm text-white truncate">{bookingData.dropoffLocation || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <EnhancedVehicleCarousel 
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={setSelectedVehicle}
              onContinue={handleContinue}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleSelection;
