import React from "react";
import { Car } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Vehicle {
  type: string;
  count: number;
}

interface VehicleCarouselProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onVehicleSelect: (carType: string) => void;
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
          <CarouselItem
            key={vehicle.type}
            className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
          >
            <div
              onClick={() => onVehicleSelect(vehicle.type)}
              className={`relative overflow-hidden group cursor-pointer p-6 rounded-xl transition-all duration-300 h-full ${
                selectedVehicle === vehicle.type
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
                    {vehicle.type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </h3>
                  <p className="text-slate-300 text-lg mb-1">
                    {vehicle.count} available
                  </p>
                </div>
              </div>
              {selectedVehicle === vehicle.type && (
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
