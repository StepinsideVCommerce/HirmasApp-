import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Users,
  Crown,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { useToast } from "@/hooks/use-toast";

const UserInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const { bookingData, updateBookingData } = useBookingFlow();
  const { toast } = useToast();
  const [passengers, setPassengers] = useState(bookingData.passengerCount || 1);

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

          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Passenger Details</h1>
            <p className="text-slate-400 text-sm">Tell us about your trip</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Trip Summary Card */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 backdrop-blur-md rounded-xl p-6 border border-yellow-500/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            Trip Overview
          </h2>

          <div className="space-y-3">
            {/* Pickup Location */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-slate-400">From:</span>
              </div>
              <span className="text-white font-medium text-right flex-1 ml-4 truncate">
                {bookingData.pickupLocation || "Not set"}
              </span>
            </div>

            {/* First Stop (only for multiple trips) */}
            {bookingData.serviceType === "Multiple Trip" && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-slate-400">First Stop:</span>
                </div>
                <span className="text-white font-medium text-right flex-1 ml-4 truncate">
                  {bookingData.firstStopLocation || "Not set"}
                </span>
              </div>
            )}

            {/* Final Destination */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-slate-400">
                  {bookingData.serviceType === "Multiple Trip"
                    ? "Final Destination:"
                    : "To:"}
                </span>
              </div>
              <span className="text-white font-medium text-right flex-1 ml-4 truncate">
                {bookingData.dropoffLocation || "Not set"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Vehicle:</span>
              <span className="text-white font-medium">
                {bookingData.carType
                  ? bookingData.carType
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())
                  : "Not selected"}
              </span>
            </div>
          </div>
        </div>

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
          <div className="mb-6">
            <div className="relative border-b-2 border-slate-700 focus-within:border-yellow-500 transition-all duration-300">
              <Input
                id="fullName"
                value={bookingData.guestName || ""}
                onChange={(e) =>
                  updateBookingData({ guestName: e.target.value })
                }
                className="h-14 bg-transparent border-none shadow-none text-white text-lg focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-2"
                placeholder=" "
              />
              <label
                htmlFor="fullName"
                className={`absolute left-2 transition-all duration-300 pointer-events-none ${
                  bookingData.guestName
                    ? "text-xs -top-2 text-yellow-500 font-medium"
                    : "text-slate-400 top-4 text-lg"
                }`}
              >
                Full Name
              </label>
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="mb-6">
            <div className="relative border-b-2 border-slate-700 focus-within:border-yellow-500 transition-all duration-300">
              <div className="absolute left-2 top-4 text-slate-400 font-medium">
                🇸🇦 +966
              </div>
              <Input
                id="phoneNumber"
                value={bookingData.phoneNumber || ""}
                onChange={(e) =>
                  updateBookingData({ phoneNumber: e.target.value })
                }
                className="h-14 bg-transparent border-none shadow-none text-white text-lg focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-[90px]"
                placeholder="501234567"
                type="tel"
              />
              <label
                htmlFor="phoneNumber"
                className={`absolute left-[90px] transition-all duration-300 pointer-events-none ${
                  bookingData.phoneNumber
                    ? "text-xs -top-2 text-yellow-500 font-medium"
                    : "text-slate-400 opacity-0"
                }`}
              >
                Phone Number
              </label>
            </div>
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
