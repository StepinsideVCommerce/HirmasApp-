
import React, { useEffect, useState } from 'react';
import { MapPin, Car } from 'lucide-react';
import { motion } from 'framer-motion';

interface RouteAnimationProps {
  startLocation: string;
  endLocation: string;
}

const RouteAnimation: React.FC<RouteAnimationProps> = ({ startLocation, endLocation }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 0.5;
        }
        clearInterval(interval);
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 bg-slate-800 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,2,0/600x400?access_token=pk.placeholder')] bg-cover bg-center"></div>
      
      {/* Route path */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-3/4 h-1 bg-slate-600 rounded-full overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-yellow-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Start pin */}
      <div className="absolute left-1/8 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
        >
          <MapPin className="w-4 h-4 text-white" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          <p className="text-xs text-white bg-slate-800/80 px-2 py-1 rounded-md">Pickup</p>
        </motion.div>
      </div>
      
      {/* End pin */}
      <div className="absolute right-1/8 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
        >
          <MapPin className="w-4 h-4 text-white" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          <p className="text-xs text-white bg-slate-800/80 px-2 py-1 rounded-md">Dropoff</p>
        </motion.div>
      </div>
      
      {/* Moving car */}
      <motion.div 
        className="absolute top-1/2 transform -translate-y-1/2"
        initial={{ left: '12.5%' }}
        animate={{ left: `calc(12.5% + ${progress * 0.75}%)` }}
      >
        <motion.div 
          animate={{ 
            y: [0, -3, 0, 3, 0],
            rotate: [0, 2, 0, -2, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2
          }}
          className="bg-yellow-500 rounded-full p-1 shadow-lg shadow-yellow-500/30"
        >
          <Car className="w-4 h-4 text-black" />
        </motion.div>
      </motion.div>
      
      {/* ETA info */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700"
        >
          <p className="text-white text-sm">Estimated arrival: {Math.max(1, Math.floor((100 - progress) / 25))} minutes</p>
        </motion.div>
      </div>
    </div>
  );
};

export default RouteAnimation;
