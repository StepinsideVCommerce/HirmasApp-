
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';

const ReviewConfirm = () => {
  const navigate = useNavigate();
  const { bookingData } = useBookingFlow();

  const handleConfirm = async () => {
    console.log('Booking confirmed:', bookingData);
    
    // Simulate webhook call
    try {
      const response = await fetch('https://your-webhook-url.com/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          timestamp: new Date().toISOString(),
          status: 'confirmed'
        }),
      });
      
      console.log('Webhook response:', response);
    } catch (error) {
      console.error('Webhook error:', error);
    }
    
    navigate('/searching');
  };

  return (
    <div className="min-h-screen luxury-gradient">
      <div className="px-6 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/vehicles')}
            className="mr-4 text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Review & Confirm</h1>
            <p className="text-slate-400">Please verify your ride details</p>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Trip Summary */}
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Trip Summary</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Pick-up Location</p>
                <p className="text-white font-medium">{bookingData.pickupLocation || 'Not specified'}</p>
              </div>
              
              <div>
                <p className="text-slate-400 text-sm">Drop-off Location</p>
                <p className="text-white font-medium">{bookingData.dropoffLocation || 'Not specified'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Date</p>
                  <p className="text-white font-medium">{bookingData.pickupDate || 'Today'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Time</p>
                  <p className="text-white font-medium">{bookingData.pickupTime || 'ASAP'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Guest Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Guest Name</p>
                <p className="text-white font-medium">{bookingData.guestName}</p>
              </div>
              
              <div>
                <p className="text-slate-400 text-sm">Phone Number</p>
                <p className="text-white font-medium">{bookingData.phoneNumber}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Category</p>
                  <p className="text-white font-medium">{bookingData.guestCategory || 'Standard'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Service Type</p>
                  <p className="text-white font-medium">{bookingData.serviceType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Car className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Selected Vehicle</h2>
            </div>
            
            <div>
              <p className="text-white font-medium text-lg">{bookingData.carType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not selected'}</p>
              <p className="text-slate-400">Premium transportation service</p>
            </div>
          </div>

          {/* Confirm Button */}
          <Button 
            onClick={handleConfirm}
            className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity"
          >
            Confirm Ride Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirm;
