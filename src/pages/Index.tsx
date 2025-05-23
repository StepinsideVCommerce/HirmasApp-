
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Car, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import LocationPicker from '@/components/LocationPicker';
import { useBookingFlow } from '@/hooks/useBookingFlow';

const Index = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFlow();
  
  const handleContinue = () => {
    if (!bookingData.guestName || !bookingData.phoneNumber || !bookingData.pickupLocation) {
      alert('Please fill in all required fields');
      return;
    }
    navigate('/vehicles');
  };

  return (
    <div className="min-h-screen luxury-gradient">
      {/* Header */}
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">VIP Ride Service</h1>
          <p className="text-slate-400 text-lg">Premium transportation for distinguished guests</p>
        </div>

        {/* Main Form */}
        <div className="max-w-md mx-auto space-y-6">
          {/* Location Section */}
          <div className="glass-effect rounded-xl p-6 space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Trip Details</h2>
            </div>
            
            <LocationPicker
              label="Pick-up Location"
              value={bookingData.pickupLocation}
              onChange={(value) => updateBookingData({ pickupLocation: value })}
              placeholder="Enter pick-up address"
            />

            <LocationPicker
              label="Drop-off Location"
              value={bookingData.dropoffLocation}
              onChange={(value) => updateBookingData({ dropoffLocation: value })}
              placeholder="Enter destination"
            />

            <div className="flex items-center space-x-3">
              <Checkbox 
                id="gps"
                checked={bookingData.useGPS}
                onCheckedChange={(checked) => updateBookingData({ useGPS: checked as boolean })}
              />
              <Label htmlFor="gps" className="text-white">Use current location (GPS)</Label>
            </div>
          </div>

          {/* Date & Time */}
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">When</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Date</Label>
                <Input
                  type="date"
                  value={bookingData.pickupDate}
                  onChange={(e) => updateBookingData({ pickupDate: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white h-12"
                />
              </div>
              <div>
                <Label className="text-white">Time</Label>
                <Input
                  type="time"
                  value={bookingData.pickupTime}
                  onChange={(e) => updateBookingData({ pickupTime: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white h-12"
                />
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Guest Information</h2>
            </div>
            
            <div>
              <Label className="text-white">Guest Name *</Label>
              <Input
                value={bookingData.guestName}
                onChange={(e) => updateBookingData({ guestName: e.target.value })}
                placeholder="Enter guest name"
                className="bg-slate-800 border-slate-700 text-white h-12"
              />
            </div>

            <div>
              <Label className="text-white">Phone Number *</Label>
              <Input
                value={bookingData.phoneNumber}
                onChange={(e) => updateBookingData({ phoneNumber: e.target.value })}
                placeholder="Enter phone number"
                className="bg-slate-800 border-slate-700 text-white h-12"
              />
            </div>

            <div>
              <Label className="text-white">Guest Category</Label>
              <Select onValueChange={(value) => updateBookingData({ guestCategory: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="speaker">Speaker</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="vvip">VVIP</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Service Type</Label>
              <Select onValueChange={(value) => updateBookingData({ serviceType: value })} defaultValue="Single Trip">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Single Trip">Single Trip</SelectItem>
                  <SelectItem value="Round Trip">Round Trip</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={handleContinue}
            className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity"
          >
            Select Vehicle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
