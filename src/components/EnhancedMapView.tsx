
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedMapViewProps {
  pickupLocation: string;
  dropoffLocation: string;
  onPickupSelect: (location: string) => void;
  onDropoffSelect: (location: string) => void;
}

const EnhancedMapView: React.FC<EnhancedMapViewProps> = ({
  pickupLocation,
  dropoffLocation,
  onPickupSelect,
  onDropoffSelect
}) => {
  const [isPickupExpanded, setIsPickupExpanded] = useState(false);
  const [isDropoffExpanded, setIsDropoffExpanded] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Simulated locations
  const locations = [
    "123 Luxury Hotel Drive, Downtown",
    "456 Conference Center Blvd",
    "789 VIP Terminal, Airport",
    "321 Executive Plaza, Business District"
  ];

  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      setTimeout(() => setShowRoute(true), 500);
      
      if (showRoute) {
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev < 100) return prev + 2;
            clearInterval(interval);
            return 100;
          });
        }, 50);
        
        return () => clearInterval(interval);
      }
    }
  }, [pickupLocation, dropoffLocation, showRoute]);

  const handleLocationSelect = (type: 'pickup' | 'dropoff', location: string) => {
    if (type === 'pickup') {
      onPickupSelect(location);
      setIsPickupExpanded(false);
    } else {
      onDropoffSelect(location);
      setIsDropoffExpanded(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Pickup Location */}
      <div className="relative z-20">
        <motion.div 
          onClick={() => {
            setIsPickupExpanded(true);
            setIsDropoffExpanded(false);
          }}
          className="h-16 bg-slate-800 rounded-xl flex items-center px-4 cursor-pointer border border-slate-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 w-full">
            <motion.div 
              className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center"
              animate={pickupLocation ? { 
                scale: [1, 1.2, 1],
                backgroundColor: ['rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 0.4)', 'rgba(34, 197, 94, 0.2)']
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <MapPin className="text-green-500 w-5 h-5" />
            </motion.div>
            <p className={`flex-1 ${pickupLocation ? 'text-white' : 'text-slate-400'}`}>
              {pickupLocation || "Select pickup location"}
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Dropoff Location */}
      <div className="relative z-10">
        <motion.div 
          onClick={() => {
            setIsDropoffExpanded(true);
            setIsPickupExpanded(false);
          }}
          className="h-16 bg-slate-800 rounded-xl flex items-center px-4 cursor-pointer border border-slate-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 w-full">
            <motion.div 
              className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center"
              animate={dropoffLocation ? {
                scale: [1, 1.2, 1],
                backgroundColor: ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.4)', 'rgba(239, 68, 68, 0.2)']
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Navigation className="text-red-500 w-5 h-5" />
            </motion.div>
            <p className={`flex-1 ${dropoffLocation ? 'text-white' : 'text-slate-400'}`}>
              {dropoffLocation || "Select destination"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Map with Route */}
      {(pickupLocation || dropoffLocation) && (
        <motion.div 
          className="rounded-xl overflow-hidden relative h-64 mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 240 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,2,0/600x400?access_token=pk.placeholder')] bg-cover bg-center">
            {/* Pickup Marker */}
            {pickupLocation && (
              <motion.div 
                className="absolute left-1/4 top-1/2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <motion.div 
                  className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
            )}
            
            {/* Dropoff Marker */}
            {dropoffLocation && (
              <motion.div 
                className="absolute right-1/4 top-1/2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <motion.div 
                  className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                >
                  <Navigation className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
            )}
            
            {/* Route Line */}
            {showRoute && (
              <>
                <div className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-slate-600">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-yellow-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                
                {/* Moving Car Icon */}
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2"
                  initial={{ left: "25%" }}
                  animate={{ left: `${25 + (progress * 0.5)}%` }}
                >
                  <motion.div 
                    className="bg-yellow-500 rounded-full p-1 -translate-x-1/2"
                    animate={{ y: [0, -2, 0, 2, 0], rotate: [0, 5, 0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Car className="w-4 h-4 text-black" />
                  </motion.div>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Location Selection Panel - Pickup */}
      <AnimatePresence>
        {isPickupExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden absolute z-30 left-0 right-0"
          >
            <div className="p-4">
              <h3 className="text-white font-medium mb-4 flex items-center">
                <MapPin className="text-green-500 w-5 h-5 mr-2" />
                Select Pickup Location
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {locations.map((location, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLocationSelect('pickup', location)}
                    className="p-3 rounded-md cursor-pointer border border-slate-700 text-white"
                  >
                    {location}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Location Selection Panel - Dropoff */}
      <AnimatePresence>
        {isDropoffExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden absolute z-30 left-0 right-0"
          >
            <div className="p-4">
              <h3 className="text-white font-medium mb-4 flex items-center">
                <Navigation className="text-red-500 w-5 h-5 mr-2" />
                Select Drop-off Location
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {locations.map((location, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLocationSelect('dropoff', location)}
                    className="p-3 rounded-md cursor-pointer border border-slate-700 text-white"
                  >
                    {location}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedMapView;
