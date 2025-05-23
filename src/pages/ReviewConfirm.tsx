
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, User, Car, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { motion } from 'framer-motion';
import StepNavigation from '@/components/StepNavigation';

const ReviewConfirm = () => {
  const navigate = useNavigate();
  const { bookingData } = useBookingFlow();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    console.log('Booking confirmed:', bookingData);
    
    // Simulate webhook call
    try {
      const response = await fetch('https://your-webhook-url.com/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          timestamp: new Date().toISOString(),
          status: 'confirmed'
        }),
      });
      
      console.log('Webhook response:', response);
    } catch (error) {
      console.error('Webhook error:', error);
    }
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/searching');
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const getVehicleName = (id: string) => {
    const vehicles = {
      'luxury-sedan': 'Luxury Sedan',
      'suv': 'Premium SUV',
      'minibus': 'Executive Minibus',
      'other': 'Custom Request'
    };
    return vehicles[id as keyof typeof vehicles] || id;
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
            onClick={() => navigate('/vehicles')}
            className="mr-4 text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Review & Confirm</h1>
            <p className="text-slate-400">Verify your ride details</p>
          </div>
        </motion.div>

        <StepNavigation currentStep={3} maxStep={3} />

        <motion.div 
          className="max-w-md mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Vehicle Summary */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Car className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Selected Vehicle</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center">
                <Car className="w-8 h-8 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {getVehicleName(bookingData.carType || '')}
                </h3>
                <p className="text-slate-400 text-sm">Premium transportation service</p>
              </div>
            </div>
          </motion.div>

          {/* Trip Summary */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <MapPin className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Trip Details</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 flex">
                <div className="mr-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Pickup Location</p>
                  <p className="text-white">{bookingData.pickupLocation}</p>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 flex">
                <div className="mr-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Dropoff Location</p>
                  <p className="text-white">{bookingData.dropoffLocation || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <p className="text-xs text-slate-400">Date</p>
                  </div>
                  <p className="text-white">{bookingData.pickupDate || 'Today'}</p>
                </div>
                
                <div className="flex-1 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <p className="text-xs text-slate-400">Time</p>
                  </div>
                  <p className="text-white">{bookingData.pickupTime || 'ASAP'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Guest Details */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <User className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Guest Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-xs text-slate-400">Guest Name</p>
                <p className="text-white">{bookingData.guestName || 'Not provided'}</p>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-white">{bookingData.phoneNumber || 'Not provided'}</p>
                </div>
                
                <div className="flex-1 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400">Service</p>
                  <p className="text-white">{bookingData.serviceType}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Confirm Button */}
          <motion.div variants={itemVariants}>
            <Button 
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity relative overflow-hidden"
            >
              {isSubmitting ? (
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </motion.div>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" /> Confirm Booking
                </>
              )}
              
              {isSubmitting && (
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1 }}
                />
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReviewConfirm;
