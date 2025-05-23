
import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Car, PhoneCall, HelpCircle, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { motion } from 'framer-motion';
import RouteAnimation from '@/components/RouteAnimation';
import StepNavigation from '@/components/StepNavigation';

const RideTracking = () => {
  const { bookingData } = useBookingFlow();
  const [eta, setEta] = useState(5);
  
  const driverInfo = {
    name: "Michael Chen",
    vehicle: "Mercedes S-Class",
    plate: "VIP-001",
    rating: 4.9,
    phone: "+1 (555) 123-4567"
  };

  useEffect(() => {
    // Countdown ETA
    const timer = setInterval(() => {
      setEta((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timer);
        return prev;
      });
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
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
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white text-center">Your Ride</h1>
          <p className="text-slate-400 text-center">Driver is on the way</p>
        </motion.div>
        
        <StepNavigation currentStep={4} maxStep={4} />

        <motion.div 
          className="max-w-md mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Map with Route */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6 mb-6 overflow-hidden">
            <RouteAnimation 
              startLocation={bookingData.pickupLocation || "Your Location"} 
              endLocation={bookingData.dropoffLocation || "Destination"} 
            />
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-slate-400">Arrives in</p>
                  <p className="text-xl font-bold text-white">{eta} min</p>
                </div>
              </div>
              
              <div>
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 h-10 px-4 rounded-full text-black font-medium"
                  onClick={() => window.location.reload()}
                >
                  Update ETA
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Driver Information */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl overflow-hidden">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white">Your Driver</h2>
              
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-2xl font-bold text-yellow-500">MC</span>
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-white">{driverInfo.name}</h3>
                    <div className="flex items-center ml-auto">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-white ml-1">{driverInfo.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-400">{driverInfo.vehicle}</p>
                  <p className="text-white text-sm bg-slate-700 px-2 py-0.5 rounded-md inline-block mt-1">{driverInfo.plate}</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-px bg-slate-700 border-t border-slate-700">
              <Button 
                variant="ghost"
                className="bg-slate-800 text-white h-14 rounded-none"
                onClick={() => window.open(`tel:${driverInfo.phone}`)}
              >
                <PhoneCall className="w-5 h-5 mr-2" />
                Call Driver
              </Button>
              <Button 
                variant="ghost"
                className="bg-slate-800 text-white h-14 rounded-none"
                onClick={() => alert('Messaging feature coming soon')}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Message
              </Button>
            </div>
          </motion.div>

          {/* Support Button */}
          <motion.div variants={itemVariants}>
            <Button 
              variant="outline"
              className="w-full h-12 border-slate-600 text-white hover:bg-slate-800"
              onClick={() => window.open('tel:+1-555-SUPPORT')}
            >
              <HelpCircle className="w-4 h-4 mr-2" /> Contact Support
            </Button>
          </motion.div>

          {/* Ride Status */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-slate-400">
              Trip ID: <span className="text-white font-mono">VIP-{Date.now().toString().slice(-6)}</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RideTracking;
