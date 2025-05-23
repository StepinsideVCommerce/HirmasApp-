
import React from 'react';
import { Car, Clock, Users, Info } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Vehicle {
  id: string;
  name: string;
  description: string;
  image: string;
  eta: string;
  price: string;
  capacity?: number;
}

interface EnhancedVehicleCarouselProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onSelectVehicle: (id: string) => void;
  onContinue: () => void;
}

const EnhancedVehicleCarousel: React.FC<EnhancedVehicleCarouselProps> = ({ 
  vehicles, 
  selectedVehicle, 
  onSelectVehicle,
  onContinue 
}) => {
  return (
    <div>
      {/* 3D-like carousel */}
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {vehicles.map((vehicle) => (
            <CarouselItem key={vehicle.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <motion.div 
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  scale: selectedVehicle === vehicle.id ? 1.03 : 1,
                  y: selectedVehicle === vehicle.id ? -8 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => onSelectVehicle(vehicle.id)}
                className={`rounded-xl cursor-pointer h-full perspective-card transform transition-all duration-300 ${
                  selectedVehicle === vehicle.id
                    ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-slate-500'
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex flex-col p-6 h-full">
                  {/* Vehicle Image Area */}
                  <motion.div 
                    className="w-full h-40 bg-slate-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative"
                    style={{ perspective: "1000px" }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      animate={{
                        rotateY: selectedVehicle === vehicle.id ? [0, 10, -10, 0] : 0
                      }}
                      transition={{
                        duration: 3,
                        repeat: selectedVehicle === vehicle.id ? Infinity : 0,
                        repeatDelay: 2
                      }}
                      style={{ width: "100%", height: "100%", transformStyle: "preserve-3d" }}
                    >
                      {/* Use Car icon for now, would be replaced with actual images */}
                      <Car 
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 ${
                          selectedVehicle === vehicle.id ? 'text-yellow-500' : 'text-slate-500'
                        }`} 
                      />
                    </motion.div>
                    
                    {/* 3D lighting effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-black/0 to-yellow-500/10 pointer-events-none" />
                  </motion.div>
                  
                  {/* Vehicle Info */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{vehicle.name}</h3>
                      <motion.div 
                        initial={{ opacity: 0.5, scale: 0.8 }}
                        animate={{ 
                          opacity: selectedVehicle === vehicle.id ? 1 : 0.5,
                          scale: selectedVehicle === vehicle.id ? 1 : 0.8
                        }}
                        className="h-6 w-6 rounded-full border border-yellow-500/50 flex items-center justify-center"
                      >
                        {selectedVehicle === vehicle.id ? (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-3 w-3 rounded-full bg-yellow-500"
                          />
                        ) : null}
                      </motion.div>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{vehicle.description}</p>
                  </div>
                  
                  {/* Vehicle Details */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{vehicle.eta}</span>
                      </div>
                      
                      <div className="flex items-center text-slate-400 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{vehicle.capacity || (vehicle.id === 'minibus' ? 12 : 4)}</span>
                      </div>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button 
                              whileHover={{ scale: 1.2, rotate: 15 }} 
                              whileTap={{ scale: 0.9 }}
                              className="rounded-full p-1 text-slate-400 hover:text-white"
                            >
                              <Info className="w-4 h-4" />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-slate-800 border-slate-700 text-white">
                            <p>{vehicle.price} pricing tier</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <motion.div 
                        className="ml-auto text-sm font-bold"
                        animate={{
                          color: selectedVehicle === vehicle.id ? '#eab308' : '#94a3b8'
                        }}
                      >
                        {vehicle.price}
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Selection Glow Effect */}
                {selectedVehicle === vehicle.id && (
                  <motion.div 
                    className="absolute -inset-0.5 rounded-xl bg-yellow-500 opacity-20 -z-10 blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Continue Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Button 
          onClick={onContinue}
          disabled={!selectedVehicle}
          className="w-full h-14 text-lg font-semibold relative overflow-hidden group"
          style={{
            background: 'linear-gradient(to right, #f59e0b, #eab308)'
          }}
        >
          <motion.span
            className="relative z-10 text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Continue
          </motion.span>
          
          {/* Button liquid animation effect */}
          <motion.div
            className="absolute inset-0 bg-yellow-300/50"
            initial={{ scale: 0, x: '-50%', y: '-50%', opacity: 0 }}
            whileHover={{ scale: 1.5, opacity: 0.3 }}
            whileTap={{ scale: 2, opacity: 0.5 }}
            transition={{ duration: 0.5 }}
            style={{ originX: 0.5, originY: 0.5, borderRadius: '50%' }}
          />
        </Button>
      </motion.div>
    </div>
  );
};

export default EnhancedVehicleCarousel;
