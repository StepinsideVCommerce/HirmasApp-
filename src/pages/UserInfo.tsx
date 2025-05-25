
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Users, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { useToast } from '@/hooks/use-toast';
import PassengerDetailsSection from '@/components/PassengerDetailsSection';

const UserInfo = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFlow();
  const { toast } = useToast();

  const handleContinue = () => {
    // Validation
    if (!bookingData.guestName?.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter guest name",
        variant: "destructive"
      });
      return;
    }

    if (!bookingData.phoneNumber?.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter phone number",
        variant: "destructive"
      });
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
    if (!phoneRegex.test(bookingData.phoneNumber.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    navigate('/review');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/vehicles')}
            className="bg-slate-800/50 backdrop-blur-sm text-white hover:bg-slate-700/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-xl font-bold text-white">Passenger Details</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Trip Summary */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-yellow-500" />
            Trip Overview
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">From:</span>
              <span className="text-white font-medium text-right flex-1 ml-4">{bookingData.pickupLocation || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">To:</span>
              <span className="text-white font-medium text-right flex-1 ml-4">{bookingData.dropoffLocation || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Vehicle:</span>
              <span className="text-white font-medium">{bookingData.carType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not selected'}</span>
            </div>
          </div>
        </div>

        {/* Passenger Details Form */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-yellow-500" />
            Passenger Information
          </h2>
          
          <PassengerDetailsSection 
            bookingData={bookingData} 
            updateBookingData={updateBookingData} 
          />
        </div>

        {/* Service Details */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-500" />
            Service Details
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Service Type:</span>
              <span className="text-white font-medium">{bookingData.serviceType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Passengers:</span>
              <span className="text-white font-medium">{bookingData.passengerCount || 1}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Category:</span>
              <span className="text-white font-medium capitalize">{bookingData.guestCategory}</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity mb-6"
        >
          Review & Confirm
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;
