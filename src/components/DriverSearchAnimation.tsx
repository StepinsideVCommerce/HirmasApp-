
import React, { useEffect, useState } from 'react';
import { Car, MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface DriverSearchAnimationProps {
  onDriverFound: () => void;
}

const DriverSearchAnimation: React.FC<DriverSearchAnimationProps> = ({ onDriverFound }) => {
  const [searchProgress, setSearchProgress] = useState(0);
  const [driverFound, setDriverFound] = useState(false);
  const [showText, setShowText] = useState(0);
  
  const searchTexts = [
    "Searching for your driver...",
    "Finding the perfect match...",
    "Contacting nearby drivers...",
    "Almost there..."
  ];

  useEffect(() => {
    // Update search progress
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev < 100) return prev + 0.7;
        clearInterval(progressInterval);
        setDriverFound(true);
        return 100;
      });
    }, 50);
    
    // Cycle through search text messages
    const textInterval = setInterval(() => {
      setShowText(prev => (prev + 1) % searchTexts.length);
    }, 2000);
    
    // Driver found after search completes
    const driverTimer = setTimeout(() => {
      setDriverFound(true);
      setTimeout(() => onDriverFound(), 2000);
    }, 8000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearTimeout(driverTimer);
    };
  }, [onDriverFound]);
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {!driverFound ? (
        <>
          {/* Pulsing search animation */}
          <div className="relative h-32 w-32 mb-8">
            <motion.div 
              className="absolute inset-0 rounded-full bg-yellow-500/10"
              animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.div 
              className="absolute inset-0 rounded-full bg-yellow-500/20"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="bg-yellow-500 rounded-full p-4"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Car className="w-8 h-8 text-black" />
              </motion.div>
            </div>
          </div>
          
          {/* Search Progress Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <motion.p 
              key={showText}
              className="text-white text-xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {searchTexts[showText]}
            </motion.p>
          </motion.div>
          
          {/* Search Progress Bar */}
          <div className="w-4/5 bg-slate-700 rounded-full h-2 mb-8">
            <motion.div 
              className="h-full bg-yellow-500 rounded-full"
              style={{ width: `${searchProgress}%` }}
            />
          </div>
          
          {/* Map background */}
          <div className="absolute inset-0 -z-10 opacity-20 overflow-hidden">
            <motion.div 
              className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,1,0/1200x800?access_token=pk.placeholder')] bg-cover bg-center"
              animate={{ 
                scale: [1, 1.05, 1], 
                rotate: [0, 1, -1, 0],
                y: [0, -5, 5, 0]
              }}
              transition={{ repeat: Infinity, duration: 15 }}
            />
          </div>
          
          {/* Random car path animations */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-yellow-500/50 rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `-5%`
                }}
                animate={{
                  left: ['0%', '105%'],
                  top: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`]
                }}
                transition={{
                  duration: 6 + Math.random() * 8,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <motion.div
          className="w-full text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <motion.div
            className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 rgba(34, 197, 94, 0)",
                "0 0 30px rgba(34, 197, 94, 0.7)",
                "0 0 0 rgba(34, 197, 94, 0)"
              ] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Car className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Driver Found!</h2>
          <p className="text-slate-400">Connecting you with your driver...</p>
        </motion.div>
      )}
    </div>
  );
};

export default DriverSearchAnimation;
