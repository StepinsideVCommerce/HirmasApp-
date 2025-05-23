
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import DriverSearchAnimation from '@/components/DriverSearchAnimation';
import StepNavigation from '@/components/StepNavigation';

const DriverSearch = () => {
  const navigate = useNavigate();
  const { bookingData } = useBookingFlow();
  
  useEffect(() => {
    // If no booking data, redirect to home
    if (!bookingData.pickupLocation) {
      navigate('/');
    }
  }, [bookingData, navigate]);

  const handleDriverFound = () => {
    setTimeout(() => {
      navigate('/tracking');
    }, 1500);
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
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white">Finding Your Driver</h1>
          <p className="text-slate-400">Just a moment while we match you with the best driver</p>
        </motion.div>

        <StepNavigation currentStep={4} maxStep={4} />

        <div className="max-w-md mx-auto h-[70vh] flex items-center justify-center">
          <DriverSearchAnimation onDriverFound={handleDriverFound} />
        </div>
      </div>
    </motion.div>
  );
};

export default DriverSearch;
