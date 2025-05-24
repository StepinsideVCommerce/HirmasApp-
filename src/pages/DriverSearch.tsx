
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Clock } from 'lucide-react';

const DriverSearch = () => {
  const navigate = useNavigate();
  const [searchStage, setSearchStage] = useState(0);

  useEffect(() => {
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
    <div className="min-h-screen luxury-gradient flex items-center justify-center">
      <div className="text-center space-y-8 px-6">
        {/* Animated Car Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
            <Car className="w-12 h-12 text-black" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-yellow-500/30 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
        </div>

        {/* Status Text */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">{stages[searchStage]}</h1>
          <p className="text-slate-400 text-lg">Please wait while we arrange your premium ride</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {stages.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                index <= searchStage ? 'bg-yellow-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* ETA */}
        <div className="glass-effect rounded-xl p-6 max-w-sm mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-white">Estimated arrival: 3-5 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverSearch;
