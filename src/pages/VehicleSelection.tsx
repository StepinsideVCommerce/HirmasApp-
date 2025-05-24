
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const VehicleSelection = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFlow();
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const vehicles = [
    {
      id: 'luxury-sedan',
      name: 'Luxury Sedan',
      description: 'Mercedes S-Class or equivalent',
      image: '',
      eta: '3-5 min',
      price: '$45'
    },
    {
      id: 'suv',
      name: 'Premium SUV',
      description: 'BMW X7 or equivalent',
      image: '',
      eta: '5-8 min',
      price: '$65'
    },
    {
      id: 'minibus',
      name: 'Executive Minibus',
      description: 'Mercedes Sprinter - Up to 12 passengers',
      image: '',
      eta: '8-12 min',
      price: '$85'
    },
    {
      id: 'other',
      name: 'Custom Request',
      description: 'Special vehicle requirements',
      image: '',
      eta: 'On request',
      price: 'Quote'
    }
  ];

  const handleContinue = () => {
    if (!selectedVehicle) {
      alert('Please select a vehicle');
      return;
    }
    updateBookingData({ carType: selectedVehicle });
    navigate('/review');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Map Background (Simulated) */}
      <div className="relative w-full h-1/3 bg-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
        
        {/* Pickup/Dropoff Summary */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <p className="text-white truncate">{bookingData.pickupLocation || 'Current Location'}</p>
            </div>
            <div className="w-0.5 h-3 bg-slate-600 ml-1"></div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white border border-yellow-500 rounded-full mr-2"></div>
              <p className="text-white truncate">{bookingData.dropoffLocation || 'Destination'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 px-4 py-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="bg-slate-800/50 backdrop-blur-sm text-white hover:bg-slate-700/50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Bottom Sheet */}
      <div className="relative flex-1 bg-slate-900 rounded-t-3xl -mt-6 z-10 px-4 pt-6">
        <div className="w-16 h-1 bg-slate-700 mx-auto mb-6 rounded-full"></div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Choose your ride</h1>

        {/* Vehicle Carousel */}
        <Carousel className="w-full mb-6">
          <CarouselContent className="-ml-2 md:-ml-4">
            {vehicles.map((vehicle) => (
              <CarouselItem key={vehicle.id} className="pl-2 md:pl-4 basis-full lg:basis-1/2">
                <div 
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className={`relative overflow-hidden group cursor-pointer p-6 rounded-xl transition-all duration-300 ${
                    selectedVehicle === vehicle.id 
                      ? 'bg-yellow-500/20 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20' 
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Car className="w-12 h-12 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{vehicle.name}</h3>
                      <p className="text-slate-400">{vehicle.description}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center text-slate-400">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{vehicle.eta}</span>
                        </div>
                        <span className="text-yellow-500 font-semibold text-lg">{vehicle.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {selectedVehicle === vehicle.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white hover:bg-slate-700 border-none" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white hover:bg-slate-700 border-none" />
        </Carousel>

        {/* Ride Options Summary */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-2">Trip Details</h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-slate-300">Passengers</span>
            </div>
            <span className="text-white">1-4</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-slate-300">Estimated arrival</span>
            </div>
            <span className="text-white">{selectedVehicle ? vehicles.find(v => v.id === selectedVehicle)?.eta || '—' : '—'}</span>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={!selectedVehicle}
          className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity disabled:opacity-50 mb-6"
        >
          Confirm {selectedVehicle ? vehicles.find(v => v.id === selectedVehicle)?.name : 'Ride'}
        </Button>
      </div>
    </div>
  );
};

export default VehicleSelection;
