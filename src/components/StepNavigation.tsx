
import React from 'react';
import { CheckIcon, MapPin, Car, Bookmark, Route } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepNavigationProps {
  currentStep: number;
  maxStep: number;
}

const steps = [
  { id: 1, title: "Location", icon: <MapPin className="w-5 h-5" /> },
  { id: 2, title: "Vehicle", icon: <Car className="w-5 h-5" /> },
  { id: 3, title: "Confirm", icon: <Bookmark className="w-5 h-5" /> },
  { id: 4, title: "Track", icon: <Route className="w-5 h-5" /> }
];

const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep, maxStep }) => {
  return (
    <div className="w-full py-4 mb-6">
      <div className="flex items-center justify-between relative">
        {/* Progress bar */}
        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-700 -translate-y-1/2 z-0">
          <motion.div 
            className="h-full bg-yellow-500"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Step indicators */}
        {steps.map((step) => (
          <div key={step.id} className="z-10">
            <motion.div 
              className={`w-12 h-12 rounded-full flex items-center justify-center 
                ${step.id === currentStep 
                  ? 'bg-yellow-500 text-black' 
                  : step.id < currentStep 
                    ? 'bg-green-500 text-white'
                    : step.id <= maxStep 
                      ? 'bg-slate-700 text-white' 
                      : 'bg-slate-800 text-slate-600'}`}
              whileHover={step.id <= maxStep ? { scale: 1.1 } : {}}
              whileTap={step.id <= maxStep ? { scale: 0.95 } : {}}
            >
              {step.id < currentStep ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </motion.div>
            <p className={`text-xs mt-1 text-center ${
              step.id === currentStep 
                ? 'text-yellow-500 font-medium'
                : step.id < currentStep 
                  ? 'text-green-500'
                  : step.id <= maxStep 
                    ? 'text-slate-400' 
                    : 'text-slate-600'
            }`}>
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepNavigation;
