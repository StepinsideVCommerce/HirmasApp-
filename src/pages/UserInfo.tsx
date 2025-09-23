import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Users,
  Crown,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import {
  countryDialCodes,
  defaultDialCode,
} from "@/data/countryDialCodes";

const UserInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const { bookingData, updateBookingData } = useBookingFlow();
  const [passengers, setPassengers] = useState(bookingData.passengerCount || 1);
  const [localPhoneNumber, setLocalPhoneNumber] = useState<string>("");

  useEffect(() => {
    const code = bookingData.phoneCountryCode || defaultDialCode;
    if (bookingData.phoneNumber?.startsWith(code)) {
      setLocalPhoneNumber(bookingData.phoneNumber.slice(code.length));
    } else {
      setLocalPhoneNumber(bookingData.phoneNumber || "");
    }
  }, [bookingData.phoneCountryCode, bookingData.phoneNumber]);

  const groupedCountries = useMemo(() => {
    return [...countryDialCodes].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handleCountryCodeChange = (dialCode: string) => {
    updateBookingData({
      phoneCountryCode: dialCode,
      phoneNumber: localPhoneNumber
        ? `${dialCode}${localPhoneNumber}`
        : "",
    });
  };

  const handlePhoneChange = (value: string) => {
    const normalized = value.replace(/[^0-9]/g, "");
    setLocalPhoneNumber(normalized);
    updateBookingData({
      phoneNumber: normalized
        ? `${bookingData.phoneCountryCode || defaultDialCode}${normalized}`
        : "",
    });
  };

  const handlePassengerCountChange = (change: number) => {
    const newCount = Math.min(Math.max(1, passengers + change), 10);
    setPassengers(newCount);
    updateBookingData({ passengerCount: newCount });
  };

  const guestCategories = [
    {
      value: "minister",
      label: "Minister",
      icon: <Crown className="w-4 h-4 text-yellow-500" />,
    },
    {
      value: "ambassador",
      label: "Ambassador",
      icon: <Briefcase className="w-4 h-4 text-yellow-500" />,
    },
    {
      value: "vip",
      label: "VIP Guest",
      icon: <Crown className="w-4 h-4 text-yellow-500" />,
    },
    {
      value: "other",
      label: "Other",
      icon: <User className="w-4 h-4 text-yellow-500" />,
    },
  ];

  const handleContinue = () => {
    navigate("/review", { state: { event } });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/vehicles")}
            className="bg-slate-800/50 backdrop-blur-sm text-white hover:bg-slate-700/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 space-y-6">

        {/* Passenger Information Card */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Who's traveling?
                </h2>
                <p className="text-slate-400 text-sm">
                  Enter passenger details
                </p>
              </div>
            </div>
          </div>

          {/* Guest Name Input */}
          <div className="mb-6 space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 w-5 h-5" />
              <Input
                id="fullName"
                value={bookingData.guestName || ""}
                onChange={(e) =>
                  updateBookingData({ guestName: e.target.value })
                }
                className="h-16 bg-slate-900/60 border border-slate-600 text-white text-xl pl-12 pr-4 rounded-xl focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-0"
                placeholder="Enter full name"
              />
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="mb-6 space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-slate-300">
              Phone Number
            </label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <Select
                value={bookingData.phoneCountryCode || defaultDialCode}
                onValueChange={handleCountryCodeChange}
              >
                <SelectTrigger className="h-16 bg-slate-900/60 border border-slate-600 text-white text-lg rounded-xl sm:w-56">
                  <SelectValue placeholder="Country code" />
                </SelectTrigger>
                <SelectContent className="max-h-80 bg-slate-900 border border-slate-700 text-white shadow-xl">
                  {groupedCountries.map((country) => (
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
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 w-5 h-5" />
                <Input
                  id="phoneNumber"
                  value={localPhoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="h-16 bg-slate-900/60 border border-slate-600 text-white text-xl pl-12 pr-4 rounded-xl focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-0"
                  placeholder="Enter phone number"
                  type="tel"
                  inputMode="tel"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Stored number: {`${
                bookingData.phoneCountryCode || defaultDialCode
              }${localPhoneNumber ? ` ${localPhoneNumber}` : ""}`}
            </p>
          </div>

          {/* Guest Category */}
          <div className="mb-6">
            <label className="block text-slate-400 mb-3 font-medium">
              Guest Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {guestCategories.map((category) => (
                <div
                  key={category.value}
                  onClick={() =>
                    updateBookingData({ guestCategory: category.value })
                  }
                  className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    bookingData.guestCategory === category.value
                      ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500 scale-105"
                      : "bg-slate-700/50 hover:bg-slate-600/50 border-2 border-transparent"
                  }`}
                >
                  {category.icon}
                  <span className="ml-3 text-white font-medium">
                    {category.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Passenger Count */}
          {/* <div className="mb-6">
            <label className="block text-slate-400 mb-3 font-medium">
              Number of Passengers
            </label>
            <div className="flex items-center justify-center">
              <button
                onClick={() => handlePassengerCountChange(-1)}
                disabled={passengers <= 1}
                className="w-12 h-12 rounded-l-xl bg-slate-700 flex items-center justify-center text-white text-xl border-2 border-yellow-500/50 disabled:opacity-50 hover:bg-slate-600 transition-colors"
              >
                -
              </button>
              <div className="w-16 h-12 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 flex items-center justify-center text-white font-bold text-xl border-y-2 border-yellow-500/50">
                {passengers}
              </div>
              <button
                onClick={() => handlePassengerCountChange(1)}
                disabled={passengers >= 10}
                className="w-12 h-12 rounded-r-xl bg-slate-700 flex items-center justify-center text-white text-xl border-2 border-yellow-500/50 disabled:opacity-50 hover:bg-slate-600 transition-colors"
              >
                +
              </button>
            </div>
          </div> */}
        </div>

        {/* Service Type Card */}
        {/* <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            Service Details
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Service Type:</span>
              <span className="text-white font-medium">
                {bookingData.serviceType}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Category:</span>
              <span className="text-white font-medium capitalize">
                {bookingData.guestCategory}
              </span>
            </div>
          </div>
        </div> */}

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
