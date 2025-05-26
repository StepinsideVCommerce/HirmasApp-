
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, Users, ChevronRight, Star, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';

const Index = () => {
  const navigate = useNavigate();
  const { updateBookingData } = useBookingFlow();

  const handleSingleTrip = () => {
    updateBookingData({ serviceType: 'Single Trip' });
    navigate('/vehicles');
  };

  const handleMultipleTrip = () => {
    updateBookingData({ serviceType: 'Multiple Trip' });
    navigate('/vehicles');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="relative w-full h-2/3 bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-16 w-6 h-6 bg-yellow-500/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-yellow-500/50 rounded-full animate-ping"></div>
        
        <div className="relative z-10 text-center px-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <Star className="w-12 h-12 text-black" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Vip<span className="text-yellow-500"> Rides</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-md mx-auto">
              Experience luxury transportation with our premium fleet
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <Shield className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Safe</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Fast</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Luxury</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="relative flex-1 bg-slate-900 rounded-t-3xl -mt-6 z-10 px-4 pt-6">
        <div className="w-16 h-1 bg-slate-700 mx-auto mb-6 rounded-full"></div>
        
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Service</h2>

        {/* Service Options */}
        <div className="space-y-4 mb-6">
          <div onClick={handleSingleTrip} className="flex items-center bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-xl cursor-pointer hover:from-slate-700 hover:to-slate-600 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mr-4">
              <Route className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">Single Trip</h3>
              <p className="text-slate-400">Point to point transportation</p>
            </div>
            <ChevronRight className="w-6 h-6 text-yellow-500" />
          </div>
          
          <div onClick={handleMultipleTrip} className="flex items-center bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-xl cursor-pointer hover:from-slate-700 hover:to-slate-600 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">Multiple Trip</h3>
              <p className="text-slate-400">Multiple stops journey</p>
            </div>
            <ChevronRight className="w-6 h-6 text-yellow-500" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">24/7</div>
            <div className="text-slate-400 text-sm">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">100%</div>
            <div className="text-slate-400 text-sm">Professional</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">5★</div>
            <div className="text-slate-400 text-sm">Rated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
