
import React from 'react';
import { MapPin, Clock, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RideTracking = () => {
  const driverInfo = {
    name: "Michael Chen",
    vehicle: "Mercedes S-Class",
    plate: "VIP-001",
    eta: "3 minutes",
    phone: "+1 (555) 123-4567"
  };

  return (
    <div className="min-h-screen luxury-gradient">
      <div className="px-6 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Ride Confirmed!</h1>
          <p className="text-slate-400 text-lg">Your premium driver is on the way</p>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Driver Information */}
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Your Driver</h2>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-500">MC</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{driverInfo.name}</h3>
                <p className="text-slate-400">{driverInfo.vehicle}</p>
                <p className="text-slate-400">Plate: {driverInfo.plate}</p>
              </div>
            </div>
          </div>

          {/* ETA */}
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-yellow-500" />
                <span className="text-white font-medium">Arrival Time</span>
              </div>
              <span className="text-yellow-500 font-bold text-xl">{driverInfo.eta}</span>
            </div>
          </div>

          {/* Simulated Route Map */}
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <MapPin className="w-5 h-5 text-yellow-500 mr-2" />
              Route Preview
            </h3>
            <div className="h-48 bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-slate-400">Live tracking map</p>
                <p className="text-slate-500 text-sm">(Simulated)</p>
              </div>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full h-12 gold-gradient text-black font-semibold hover:opacity-90 transition-opacity"
              onClick={() => window.open(`tel:${driverInfo.phone}`)}
            >
              Contact Driver
            </Button>
            
            <Button 
              variant="outline"
              className="w-full h-12 border-slate-600 text-white hover:bg-slate-800"
              onClick={() => window.open('tel:+1-555-SUPPORT')}
            >
              Contact Support
            </Button>
          </div>

          {/* Ride Status */}
          <div className="text-center">
            <p className="text-slate-400">
              Trip ID: <span className="text-white font-mono">VIP-{Date.now().toString().slice(-6)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideTracking;
