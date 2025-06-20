import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { hermasAdminSupabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import {
  format,
  addMinutes,
  isBefore,
  isAfter,
  parseISO,
  isSameDay,
} from "date-fns";

const SelectShift = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.event;
  const { updateBookingData } = useBookingFlow();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [shifts, setShifts] = useState<any[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [showTimes, setShowTimes] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Parse event dates
  const startDate = event?.startDate ? parseISO(event.startDate) : null;
  const endDate = event?.endDate ? parseISO(event.endDate) : null;

  // Calendar days between startDate and endDate
  const days = useMemo(() => {
    if (!startDate || !endDate) return [];
    const arr = [];
    let d = startDate;
    while (!isAfter(d, endDate)) {
      arr.push(new Date(d));
      d = addMinutes(d, 24 * 60); // add 1 day
    }
    return arr;
  }, [startDate, endDate]);

  // Fetch shifts for selected date
  const fetchShifts = async (date: string) => {
    setLoadingShifts(true);
    setSelectedShift(null);
    setSelectedTime(null);
    setShowTimes(false);
    const { data, error } = await hermasAdminSupabase
      .from("Shifts")
      .select("*")
      .eq("event_id", event.id)
      .eq("date", date);
    setShifts(data || []);
    setLoadingShifts(false);
  };

  // Generate time slots for a shift
  const getTimeSlots = (shift: any) => {
    const slots = [];
    let t = parseISO(shift.startTime);
    const end = parseISO(shift.endTime);
    while (!isAfter(t, end)) {
      slots.push(format(t, "HH:mm"));
      t = addMinutes(t, 5);
    }
    return slots;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDate(dateStr);
    fetchShifts(dateStr);
    updateBookingData({ pickupDate: dateStr });
  };

  // Handle shift selection
  const handleShiftSelect = (shift: any) => {
    setSelectedShift(shift);
    setShowTimes(true);
    updateBookingData({ shift });
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateBookingData({ pickupTime: time });
  };

  // Continue to home page
  const handleContinue = () => {
    navigate("/home", { state: { event } });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-slate-800/50 backdrop-blur-md rounded-xl p-8 mt-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Select Shift
        </h1>
        {/* Calendar */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-2">
            Choose a Day
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {days.map((d) => {
              const dateStr = format(d, "yyyy-MM-dd");
              return (
                <Button
                  key={dateStr}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedDate === dateStr
                      ? "bg-yellow-500 text-black"
                      : "bg-slate-700 text-white"
                  }`}
                  onClick={() => handleDateSelect(d)}
                >
                  {format(d, "MMM d, yyyy")}
                </Button>
              );
            })}
          </div>
        </div>
        {/* Shifts */}
        {selectedDate && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-2">
              Available Shifts
            </h2>
            {loadingShifts ? (
              <div className="text-slate-300 text-center py-4">
                Loading shifts...
              </div>
            ) : shifts.length === 0 ? (
              <div className="text-slate-400 text-center py-4">
                No shifts for this day.
              </div>
            ) : (
              <div className="space-y-3">
                {shifts.map((shift) => (
                  <div key={shift.id} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">
                          Shift #{shift.number}
                        </div>
                        <div className="text-slate-300 text-xs">
                          {shift.startTime && shift.endTime
                            ? `${format(
                                parseISO(shift.startTime),
                                "HH:mm"
                              )} - ${format(parseISO(shift.endTime), "HH:mm")}`
                            : `${shift.startTime} - ${shift.endTime}`}
                        </div>
                      </div>
                      <Button
                        className="bg-yellow-500 text-black px-4 py-2 rounded-lg"
                        onClick={() => handleShiftSelect(shift)}
                      >
                        Select
                      </Button>
                    </div>
                    {/* Dropdown for times */}
                    {selectedShift?.id === shift.id && showTimes && (
                      <div className="mt-4">
                        <div className="mb-2 text-slate-200 font-medium">
                          Choose Time
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getTimeSlots(shift).map((time) => (
                            <Button
                              key={time}
                              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                                selectedTime === time
                                  ? "bg-yellow-500 text-black"
                                  : "bg-slate-600 text-white"
                              }`}
                              onClick={() => handleTimeSelect(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Continue Button */}
        {selectedTime && (
          <Button
            className="w-full py-4 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl mt-4"
            onClick={handleContinue}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default SelectShift;
