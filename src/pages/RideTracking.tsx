
import React from 'react';
import { MapPin, Clock, Car, PhoneCall, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { motion } from 'framer-motion';
import RouteAnimation from '@/components/RouteAnimation';

const RideTracking = () => {
  const { bookingData } = useBookingFlow();
  
  const driverInfo = {
    name: "Michael Chen",
    vehicle: "Mercedes S-Class",
    plate: "VIP-001",
    eta: "3 minutes",
    phone: "+1 (555) 123-4567"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen luxury-gradient">
      <div className="px-6 py-8">
        {/* Success Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            type: "spring",
            stiffness: 200,
            damping: 20 
          }}
        >
          <motion.div 
            className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4"
            animate={{ 
              boxShadow: ["0 0 0 rgba(34, 197, 94, 0)", "0 0 20px rgba(34, 197, 94, 0.7)", "0 0 0 rgba(34, 197, 94, 0)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Car className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Ride Confirmed!</h1>
          <p className="text-slate-400 text-lg">Your premium driver is on the way</p>
        </motion.div>

        <motion.div 
          className="max-w-md mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Driver Information */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Your Driver</h2>
            
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-2xl font-bold text-yellow-500">MC</span>
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{driverInfo.name}</h3>
                <p className="text-slate-400">{driverInfo.vehicle}</p>
                <p className="text-slate-400">Plate: {driverInfo.plate}</p>
              </div>
            </div>
          </motion.div>

          {/* ETA */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-yellow-500" />
                <span className="text-white font-medium">Arrival Time</span>
              </div>
              <motion.span 
                className="text-yellow-500 font-bold text-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {driverInfo.eta}
              </motion.span>
            </div>
          </motion.div>

          {/* Animated Route Map */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <MapPin className="w-5 h-5 text-yellow-500 mr-2" />
              Live Tracking
            </h3>
            <RouteAnimation 
              startLocation={bookingData.pickupLocation || "Your Location"} 
              endLocation={bookingData.dropoffLocation || "Destination"} 
            />
          </motion.div>

          {/* Contact Buttons */}
          <motion.div variants={itemVariants} className="space-y-3">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                className="w-full h-12 gold-gradient text-black font-semibold hover:opacity-90 transition-opacity"
                onClick={() => window.open(`tel:${driverInfo.phone}`)}
              >
                <PhoneCall className="w-4 h-4 mr-2" /> Contact Driver
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                variant="outline"
                className="w-full h-12 border-slate-600 text-white hover:bg-slate-800"
                onClick={() => window.open('tel:+1-555-SUPPORT')}
              >
                <HelpCircle className="w-4 h-4 mr-2" /> Contact Support
              </Button>
            </motion.div>
          </motion.div>

          {/* Ride Status */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-slate-400">
              Trip ID: <span className="text-white font-mono">VIP-{Date.now().toString().slice(-6)}</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RideTracking;
