
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimatedMapProps {
  onLocationSelect: (location: string) => void;
  placeholder: string;
}

const AnimatedMap: React.FC<AnimatedMapProps> = ({ onLocationSelect, placeholder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Simulated locations for demo
  const locations = [
    "123 Luxury Hotel Drive, Downtown",
    "456 Conference Center Blvd",
    "789 VIP Terminal, Airport",
    "321 Executive Plaza, Business District"
  ];

  const handleMapSelect = (location: string) => {
    onLocationSelect(location);
    setIsExpanded(false);
  };

  return (
    <div className="w-full">
      <motion.div 
        onClick={() => setIsExpanded(true)}
        className="h-16 bg-slate-800 rounded-xl flex items-center px-4 cursor-pointer border border-slate-700 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <MapPin className="text-yellow-500 w-5 h-5 mr-3 flex-shrink-0" />
        <p className="text-slate-400">{placeholder}</p>
      </motion.div>

      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
        >
          <div className="h-56 bg-slate-700 relative">
            {/* Simulated map */}
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,1,0/300x200?access_token=pk.placeholder')] bg-cover bg-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <MapPin className="text-yellow-500 w-6 h-6" />
                </motion.div>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-white font-medium mb-2">Select Location</h3>
            <div className="space-y-2">
              {locations.map((location, index) => (
                <motion.div
                  key={index}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMapSelect(location)}
                  className="p-3 rounded-md cursor-pointer border border-slate-700 text-white"
                >
                  {location}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedMap;
