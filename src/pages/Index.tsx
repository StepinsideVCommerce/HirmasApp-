
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { motion } from 'framer-motion';
import EnhancedMapView from '@/components/EnhancedMapView';
import StepNavigation from '@/components/StepNavigation';

const Index = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFlow();
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  const handleContinue = () => {
    if (!bookingData.pickupLocation) {
      alert('Please select a pickup location');
      return;
    }
    navigate('/vehicles');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen luxury-gradient overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="px-6 py-8">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">VIP Ride</h1>
          <p className="text-slate-400 text-lg">Premium transportation experience</p>
        </motion.div>

        <StepNavigation currentStep={1} maxStep={1} />

        <div className="max-w-md mx-auto">
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-effect rounded-xl p-6 mb-6"
          >
            <EnhancedMapView 
              pickupLocation={bookingData.pickupLocation}
              dropoffLocation={bookingData.dropoffLocation}
              onPickupSelect={(location) => updateBookingData({ pickupLocation: location })}
              onDropoffSelect={(location) => updateBookingData({ dropoffLocation: location })}
            />

            <motion.div 
              className="flex items-center space-x-3 mt-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Checkbox 
                id="gps"
                checked={bookingData.useGPS}
                onCheckedChange={(checked) => updateBookingData({ useGPS: checked as boolean })}
              />
              <Label htmlFor="gps" className="text-white cursor-pointer">Use current location (GPS)</Label>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="w-full mb-4 bg-slate-800 hover:bg-slate-700 text-white h-14"
            >
              {detailsExpanded ? "Hide Additional Details" : "Add Guest Details & Schedule"}
            </Button>
          </motion.div>

          {/* Collapsible Guest Details */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: detailsExpanded ? 'auto' : 0,
              opacity: detailsExpanded ? 1 : 0
            }}
            className="overflow-hidden"
          >
            <div className="glass-effect rounded-xl p-6 mb-6 space-y-4">
              {/* Date & Time */}
              <div>
                <h3 className="text-white font-semibold flex items-center mb-3">
                  <Clock className="text-yellow-500 w-5 h-5 mr-2" /> Schedule
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white text-sm">Date</Label>
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
                    <Label className="text-white text-sm">Time</Label>
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
              </div>

              {/* Guest Information */}
              <div>
                <h3 className="text-white font-semibold flex items-center mb-3">
                  <User className="text-yellow-500 w-5 h-5 mr-2" /> Guest Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-white text-sm">Guest Name</Label>
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
                    <Label className="text-white text-sm">Phone Number</Label>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          value={bookingData.phoneNumber}
                          onChange={(e) => updateBookingData({ phoneNumber: e.target.value })}
                          placeholder="Enter phone number"
                          className="bg-slate-800 border-slate-700 text-white h-12 pl-10"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white text-sm">Guest Category</Label>
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
                      <Label className="text-white text-sm">Service Type</Label>
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
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible" 
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button 
              onClick={handleContinue}
              disabled={!bookingData.pickupLocation}
              className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity relative overflow-hidden"
            >
              <span className="relative z-10">Continue to Vehicle Selection</span>
              
              {/* Button liquid animation effect */}
              <motion.div
                className="absolute inset-0 bg-yellow-300/30"
                initial={{ scale: 0, x: '-50%', y: '-50%', opacity: 0 }}
                whileHover={{ scale: 2.5, opacity: 0.3 }}
                whileTap={{ scale: 3, opacity: 0.5 }}
                transition={{ duration: 0.6 }}
                style={{ originX: 0.5, originY: 0.5, borderRadius: '50%' }}
              />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Index;
