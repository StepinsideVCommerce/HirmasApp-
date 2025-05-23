
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { motion } from 'framer-motion';

const ReviewConfirm = () => {
  const navigate = useNavigate();
  const { bookingData } = useBookingFlow();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
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
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/searching');
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen luxury-gradient">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="px-6 py-8"
      >
        <motion.div variants={itemVariants} className="flex items-center mb-6">
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
        </motion.div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Trip Summary */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Trip Summary</h2>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-slate-400 text-sm">Pick-up Location</p>
                <p className="text-white font-medium">{bookingData.pickupLocation || 'Not specified'}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-slate-400 text-sm">Drop-off Location</p>
                <p className="text-white font-medium">{bookingData.dropoffLocation || 'Not specified'}</p>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-slate-400 text-sm">Date</p>
                  <p className="text-white font-medium">{bookingData.pickupDate || 'Today'}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-slate-400 text-sm">Time</p>
                  <p className="text-white font-medium">{bookingData.pickupTime || 'ASAP'}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Guest Details */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Guest Details</h2>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-slate-400 text-sm">Guest Name</p>
                <p className="text-white font-medium">{bookingData.guestName}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-slate-400 text-sm">Phone Number</p>
                <p className="text-white font-medium">{bookingData.phoneNumber}</p>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-slate-400 text-sm">Category</p>
                  <p className="text-white font-medium">{bookingData.guestCategory || 'Standard'}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-slate-400 text-sm">Service Type</p>
                  <p className="text-white font-medium">{bookingData.serviceType}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Vehicle Details */}
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Car className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Selected Vehicle</h2>
            </div>
            
            <div>
              <motion.p 
                className="text-white font-medium text-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                {bookingData.carType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not selected'}
              </motion.p>
              <p className="text-slate-400">Premium transportation service</p>
            </div>
          </motion.div>

          {/* Confirm Button */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button 
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-semibold gold-gradient text-black hover:opacity-90 transition-opacity relative overflow-hidden"
            >
              {isSubmitting ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Processing...
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Confirm Ride Request
                </motion.span>
              )}
              
              {isSubmitting && (
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1 }}
                />
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewConfirm;
