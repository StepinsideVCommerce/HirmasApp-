
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookingFlow } from '@/hooks/useBookingFlow';

const DriverSearch = () => {
  const navigate = useNavigate();
  const { bookingData } = useBookingFlow();
  const [searchStage, setSearchStage] = useState(0);
  const [pings, setPings] = useState<{x: number, y: number, delay: number}[]>([]);

  useEffect(() => {
    // Generate random ping positions
    const newPings = Array(6).fill(0).map((_, i) => ({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      delay: i * 0.4
    }));
    setPings(newPings);
    
    const stages = [
      "Looking for your driver...",
      "Found nearby drivers...",
      "Confirming availability...",
      "Driver confirmed!"
    ];

    const interval = setInterval(() => {
      setSearchStage(prev => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          setTimeout(() => navigate('/tracking'), 1000);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate]);

  const stages = [
    "Looking for your driver...",
    "Found nearby drivers...",
    "Confirming availability...",
    "Driver confirmed!"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen luxury-gradient flex items-center justify-center"
    >
      <div className="text-center space-y-8 px-6 w-full max-w-md">
        {/* Animated Search Visualization */}
        <div className="relative">
          <div className="relative w-32 h-32 mx-auto">
            <motion.div 
              className="absolute inset-0 w-full h-full rounded-full bg-yellow-500 opacity-20"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute inset-0 w-full h-full rounded-full bg-yellow-500 opacity-30"
              animate={{ scale: [1, 2, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full relative">
                {/* Pulsing dots representing nearby drivers */}
                {pings.map((ping, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-yellow-500 rounded-full"
                    style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: ping.delay, 
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Central Car Icon */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: searchStage >= 3 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: searchStage >= 3 ? 3 : 0 }}
            >
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                <Car className="w-8 h-8 text-black" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Status Text */}
        <motion.div 
          className="space-y-4"
          animate={{ y: [10, 0], opacity: [0, 1] }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white">{stages[searchStage]}</h1>
          <p className="text-slate-400 text-lg">Please wait while we arrange your premium ride</p>
        </motion.div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {stages.map((_, index) => (
            <motion.div
              key={index}
              className="w-3 h-3 rounded-full"
              initial={{ backgroundColor: "#334155" }}
              animate={{ 
                backgroundColor: index <= searchStage ? "#eab308" : "#334155",
                scale: index === searchStage ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>

        {/* Pickup & Dropoff Summary */}
        <motion.div 
          className="glass-effect rounded-xl p-6 max-w-sm mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="space-y-3">
            {/* Pickup */}
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                <motion.div 
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pickup</p>
                <p className="text-white">{bookingData.pickupLocation || "Current Location"}</p>
              </div>
            </div>
            
            {/* Dropoff */}
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Dropoff</p>
                <p className="text-white">{bookingData.dropoffLocation || "Destination"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ETA */}
        <motion.div 
          className="glass-effect rounded-xl p-6 max-w-sm mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center justify-center space-x-3">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-white">Estimated arrival: 3-5 minutes</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DriverSearch;
