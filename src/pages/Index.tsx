
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { motion } from 'framer-motion';
import AnimatedMap from '@/components/AnimatedMap';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen luxury-gradient">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="px-6 py-8"
      >
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-white mb-2">VIP Ride Service</h1>
          <p className="text-slate-400 text-lg">Premium transportation for distinguished guests</p>
        </motion.div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Location Section */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6 space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Trip Details</h2>
            </div>
            
            <div className="space-y-4">
              <Label className="text-white font-medium">Pick-up Location</Label>
              <AnimatedMap 
                onLocationSelect={(location) => updateBookingData({ pickupLocation: location })}
                placeholder={bookingData.pickupLocation || "Enter pick-up address"}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-white font-medium">Drop-off Location</Label>
              <AnimatedMap 
                onLocationSelect={(location) => updateBookingData({ dropoffLocation: location })}
                placeholder={bookingData.dropoffLocation || "Enter destination"}
              />
            </div>

            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Checkbox 
                id="gps"
                checked={bookingData.useGPS}
                onCheckedChange={(checked) => updateBookingData({ useGPS: checked as boolean })}
              />
              <Label htmlFor="gps" className="text-white">Use current location (GPS)</Label>
            </motion.div>
          </motion.div>

          {/* Date & Time */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">When</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Date</Label>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Input
                    type="date"
                    value={bookingData.pickupDate}
                    onChange={(e) => updateBookingData({ pickupDate: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </motion.div>
              </div>
              <div>
                <Label className="text-white">Time</Label>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Input
                    type="time"
                    value={bookingData.pickupTime}
                    onChange={(e) => updateBookingData({ pickupTime: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Guest Information */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Guest Information</h2>
            </div>
            
            <div>
              <Label className="text-white">Guest Name *</Label>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Input
                  value={bookingData.guestName}
                  onChange={(e) => updateBookingData({ guestName: e.target.value })}
                  placeholder="Enter guest name"
                  className="bg-slate-800 border-slate-700 text-white h-12"
                />
              </motion.div>
            </div>

            <div>
              <Label className="text-white">Phone Number *</Label>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Input
                  value={bookingData.phoneNumber}
                  onChange={(e) => updateBookingData({ phoneNumber: e.target.value })}
                  placeholder="Enter phone number"
                  className="bg-slate-800 border-slate-700 text-white h-12"
                />
              </motion.div>
            </div>

            <div>
              <Label className="text-white">Guest Category</Label>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
              </motion.div>
            </div>

            <div>
              <Label className="text-white">Service Type</Label>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Select onValueChange={(value) => updateBookingData({ serviceType: value })} defaultValue="Single Trip">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Single Trip">Single Trip</SelectItem>
                    <SelectItem value="Round Trip">Round Trip</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button 
              onClick={handleContinue}
              className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity"
            >
              Select Vehicle
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
