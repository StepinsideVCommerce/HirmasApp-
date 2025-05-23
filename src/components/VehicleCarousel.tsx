
import React, { useState } from 'react';
import { Car, Info } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Vehicle {
  id: string;
  name: string;
  description: string;
  image: string;
  eta: string;
  price: string;
}

interface VehicleCarouselProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onSelectVehicle: (id: string) => void;
  onContinue: () => void;
}

const VehicleCarousel: React.FC<VehicleCarouselProps> = ({ 
  vehicles, 
  selectedVehicle, 
  onSelectVehicle,
  onContinue 
}) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {vehicles.map((vehicle) => (
            <CarouselItem key={vehicle.id} className="md:basis-1/2 lg:basis-1/3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                animate={{ 
                  scale: selectedVehicle === vehicle.id ? 1.03 : 1,
                  y: selectedVehicle === vehicle.id ? -10 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => onSelectVehicle(vehicle.id)}
                className={`p-6 rounded-xl cursor-pointer h-full ${
                  selectedVehicle === vehicle.id
                    ? 'bg-yellow-500/20 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:bg-slate-700'
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="w-full h-40 bg-slate-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <Car className="w-20 h-20 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{vehicle.name}</h3>
                  <p className="text-slate-400 text-sm mb-3">{vehicle.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-yellow-500 font-semibold">{vehicle.price}</span>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Info className="w-4 h-4" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-slate-800 border-slate-700 text-white w-72">
                        <div className="flex justify-between space-x-4">
                          <div>
                            <h4 className="text-sm font-semibold">{vehicle.name}</h4>
                            <p className="text-sm text-slate-400">{vehicle.description}</p>
                            <div className="flex items-center mt-2">
                              <Car className="w-4 h-4 mr-1 text-yellow-500" />
                              <span className="text-sm text-slate-400">ETA: {vehicle.eta}</span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-2 mt-4">
          <CarouselPrevious className="relative static bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30 text-yellow-500" />
          <CarouselNext className="relative static bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30 text-yellow-500" />
        </div>
      </Carousel>
      
      <Button 
        onClick={onContinue}
        disabled={!selectedVehicle}
        className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity mt-6 disabled:opacity-50"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Continue to Review
        </motion.span>
      </Button>
    </div>
  );
};

export default VehicleCarousel;
