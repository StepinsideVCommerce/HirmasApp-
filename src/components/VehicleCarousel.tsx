
import React from 'react';
import { Car, Clock } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Vehicle {
  id: string;
  name: string;
  description: string;
  eta: string;
}

interface VehicleCarouselProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string) => void;
}

const VehicleCarousel: React.FC<VehicleCarouselProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
}) => {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {vehicles.map((vehicle) => (
          <CarouselItem key={vehicle.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <div
              onClick={() => onVehicleSelect(vehicle.id)}
              className={`relative overflow-hidden group cursor-pointer p-6 rounded-xl transition-all duration-300 h-full ${
                selectedVehicle === vehicle.id
                  ? "bg-yellow-500/20 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20"
                  : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent"
              }`}
            >
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-20 h-20 bg-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Car className="w-12 h-12 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {vehicle.name}
                  </h3>
                  <p className="text-slate-300 text-sm mb-3">{vehicle.description}</p>

                  <div className="flex items-center justify-center">
                    <div className="flex items-center text-slate-400">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{vehicle.eta}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedVehicle === vehicle.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600" />
      <CarouselNext className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600" />
    </Carousel>
  );
};

export default VehicleCarousel;
