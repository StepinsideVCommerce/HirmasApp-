
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Clock, MapPin } from 'lucide-react';

const DriverSearch = () => {
  const navigate = useNavigate();
  const [searchStage, setSearchStage] = useState(0);
  const [animatedDots, setAnimatedDots] = useState('');

  useEffect(() => {
    // Animation for the loading dots
    const dotsInterval = setInterval(() => {
      setAnimatedDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);
    
    // Stage progression
    const stagesInterval = setInterval(() => {
      setSearchStage(prev => {
        if (prev < 3) {
          return prev + 1;
        } else {
          setTimeout(() => navigate('/tracking'), 1000);
          return prev;
        }
      });
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(stagesInterval);
    };
  }, [navigate]);

  const stages = [
    "Looking for drivers",
    "Found nearby drivers",
    "Confirming availability",
    "Driver confirmed"
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Map Background (Simulated) */}
      <div className="relative w-full h-1/2 bg-slate-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_0%,rgba(15,23,42,0.7)_100%)]"></div>
        
        {/* Animated Search Ripple */}
        <div className="relative">
          <div className="absolute inset-0 w-32 h-32 bg-yellow-500/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 w-24 h-24 bg-yellow-500/30 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute inset-0 w-16 h-16 bg-yellow-500/40 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          <div className="relative w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <Car className="w-6 h-6 text-black" />
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="relative flex-1 bg-slate-900 rounded-t-3xl -mt-6 z-10 px-4 pt-6 flex flex-col">
        <div className="w-16 h-1 bg-slate-700 mx-auto mb-6 rounded-full"></div>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            {stages[searchStage]}{animatedDots}
          </h1>
          <p className="text-slate-400 mb-8">Please wait while we connect you with a driver</p>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {stages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                  index <= searchStage ? 'bg-yellow-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Estimated Time */}
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-xs">
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-white">Estimated arrival: 3-5 minutes</span>
            </div>
          </div>
          
          {/* Vehicle Moving Animation - Simple Version */}
          {searchStage >= 2 && (
            <div className="relative w-full h-20 mt-8">
              <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-700"></div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-500"></div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-500"></div>
              
              <div 
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                style={{ 
                  left: searchStage === 3 ? 'calc(100% - 2rem - 1.5rem)' : '2rem',
                }}
              >
                <Car className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverSearch;
