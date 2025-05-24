
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import LocationPicker from '@/components/LocationPicker';

const Index = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFlow();
  
  const handleContinue = () => {
    if (!bookingData.pickupLocation) {
      alert('Please enter your pickup location');
      return;
    }
    navigate('/vehicles');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Map Background (Simulated) */}
      <div className="relative w-full h-1/2 bg-slate-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900"></div>
        <MapPin className="w-16 h-16 text-yellow-500 animate-bounce" />
      </div>

      {/* Bottom Sheet */}
      <div className="relative flex-1 bg-slate-900 rounded-t-3xl -mt-6 z-10 px-4 pt-6">
        <div className="w-16 h-1 bg-slate-700 mx-auto mb-6 rounded-full"></div>
        
        <h1 className="text-2xl font-bold text-white mb-6">Where to?</h1>

        {/* Location Inputs */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-yellow-500 my-12"></div>
          
          <div className="relative z-10 mb-4">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            <LocationPicker
              label=""
              value={bookingData.pickupLocation}
              onChange={(value) => updateBookingData({ pickupLocation: value })}
              placeholder="Current location"
            />
          </div>
          
          <div className="relative z-10">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-yellow-500 flex items-center justify-center">
              <MapPin className="w-3 h-3 text-yellow-500" />
            </div>
            <LocationPicker
              label=""
              value={bookingData.dropoffLocation}
              onChange={(value) => updateBookingData({ dropoffLocation: value })}
              placeholder="Where to?"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 mb-6">
          <div onClick={() => navigate('/vehicles')} className="flex items-center bg-slate-800 p-4 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">Book for later</h3>
              <p className="text-slate-400 text-sm">Schedule a ride</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
          
          <div onClick={() => navigate('/vehicles')} className="flex items-center bg-slate-800 p-4 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">Guest booking</h3>
              <p className="text-slate-400 text-sm">Book for someone else</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity mb-6"
        >
          Find a ride
        </Button>
      </div>
    </div>
  );
};

export default Index;
