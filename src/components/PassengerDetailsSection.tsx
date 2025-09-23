
import React, { useEffect, useMemo, useState } from 'react';
import { User, Briefcase, Crown, Phone } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BookingData } from '@/hooks/useBookingFlow';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countryDialCodes, defaultDialCode } from '@/data/countryDialCodes';

interface PassengerDetailsSectionProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
}

const PassengerDetailsSection = ({ 
  bookingData, 
  updateBookingData 
}: PassengerDetailsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [passengers, setPassengers] = useState(1);
  const [localPhoneNumber, setLocalPhoneNumber] = useState('');

  useEffect(() => {
    const code = bookingData.phoneCountryCode || defaultDialCode;
    if (bookingData.phoneNumber?.startsWith(code)) {
      setLocalPhoneNumber(bookingData.phoneNumber.slice(code.length));
    } else {
      setLocalPhoneNumber(bookingData.phoneNumber || '');
    }
  }, [bookingData.phoneCountryCode, bookingData.phoneNumber]);

  const countries = useMemo(() => {
    return [...countryDialCodes].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handleCountryCodeChange = (dialCode: string) => {
    updateBookingData({
      phoneCountryCode: dialCode,
      phoneNumber: localPhoneNumber ? `${dialCode}${localPhoneNumber}` : '',
    });
  };

  const handlePhoneNumberChange = (value: string) => {
    const normalized = value.replace(/[^0-9]/g, '');
    setLocalPhoneNumber(normalized);
    updateBookingData({
      phoneNumber: normalized
        ? `${bookingData.phoneCountryCode || defaultDialCode}${normalized}`
        : '',
    });
  };

  const handlePassengerCountChange = (change: number) => {
    const newCount = Math.min(Math.max(1, passengers + change), 10);
    setPassengers(newCount);
    updateBookingData({ passengerCount: newCount });
  };

  const guestCategories = [
    { value: 'minister', label: 'Minister', icon: <Crown className="w-4 h-4 text-yellow-500" /> },
    { value: 'ambassador', label: 'Ambassador', icon: <Briefcase className="w-4 h-4 text-yellow-500" /> },
    { value: 'vip', label: 'VIP Guest', icon: <Crown className="w-4 h-4 text-yellow-500" /> },
    { value: 'other', label: 'Other', icon: <User className="w-4 h-4 text-yellow-500" /> },
  ];

  const validateFields = () => {
    if (!bookingData.guestName || !bookingData.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please complete passenger details before submitting.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return (
    <div className="mb-6 bg-slate-800/80 rounded-xl backdrop-blur-sm">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >

        <CollapsibleContent className="p-4 space-y-4 border-t border-slate-700 animate-accordion-down">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="w-5 h-5 text-yellow-500" />
              </div>
              <span className="ml-3 text-white font-medium">You're booking for:</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="relative border-b border-slate-700 focus-within:border-yellow-500 transition-colors">
              <Input
                id="fullName"
                value={bookingData.guestName}
                onChange={(e) => updateBookingData({ guestName: e.target.value })}
                className="h-12 bg-transparent border-none shadow-none text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-2"
                placeholder=" "
              />
              <label 
                htmlFor="fullName" 
                className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                  bookingData.guestName ? 
                  'text-xs -top-2 text-yellow-500' : 
                  'text-slate-400 top-3'
                }`}
              >
                Full Name
              </label>
            </div>
          </div>
          
          <div className="mb-4 space-y-2">
            <label className="block text-sm text-slate-400 font-medium">Phone Number</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={bookingData.phoneCountryCode || defaultDialCode}
                onValueChange={handleCountryCodeChange}
              >
                <SelectTrigger className="h-12 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg sm:w-48">
                  <SelectValue placeholder="Country code" />
                </SelectTrigger>
                <SelectContent className="max-h-80 bg-slate-900 border border-slate-700 text-white shadow-xl">
                  {countries.map((country) => (
                    <SelectItem
                      key={country.isoCode}
                      value={country.dialCode}
                      className="text-white data-[highlighted]:bg-slate-700 data-[state=checked]:bg-slate-700 focus:bg-slate-700 focus:text-white"
                    >
                      {country.name} ({country.dialCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500" />
                <Input
                  id="phoneNumber"
                  value={localPhoneNumber}
                  onChange={(e) => handlePhoneNumberChange(e.target.value)}
                  className="h-12 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg pl-10"
                  placeholder="Enter phone number"
                  type="tel"
                  inputMode="tel"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">Guest Type</label>
            <div className="flex flex-wrap gap-2">
              {guestCategories.map((category) => (
                <div
                  key={category.value}
                  onClick={() => updateBookingData({ guestCategory: category.value })}
                  className={`flex items-center px-4 py-2 rounded-xl cursor-pointer transition-all ${
                    bookingData.guestCategory === category.value
                      ? 'bg-yellow-500/20 border border-yellow-500'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {category.icon}
                  <span className="ml-2 text-white text-sm">{category.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Number of Passengers</label>
            <div className="flex items-center justify-center">
              <button
                onClick={() => handlePassengerCountChange(-1)}
                disabled={passengers <= 1}
                className="w-10 h-10 rounded-l-lg bg-slate-700 flex items-center justify-center text-white text-xl border-y border-l border-yellow-500/50 disabled:opacity-50"
              >
                -
              </button>
              <div className="w-12 h-10 bg-slate-800 flex items-center justify-center text-white border-y border-yellow-500/50">
                {passengers}
              </div>
              <button
                onClick={() => handlePassengerCountChange(1)}
                disabled={passengers >= 10}
                className="w-10 h-10 rounded-r-lg bg-slate-700 flex items-center justify-center text-white text-xl border-y border-r border-yellow-500/50 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PassengerDetailsSection;
