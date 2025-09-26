import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { hermasAdminSupabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { format, addMinutes, isBefore, isAfter } from "date-fns";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CalendarDays,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
// ---- date helpers ----
function parseISO(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}
function fmtISO(d: Date) {
  const y = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, "0"),
    day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function inRange(d: Date, from: Date, to: Date) {
  const t = d.getTime();
  return t >= from.getTime() && t <= to.getTime();
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildMonthMatrix(viewMonth: Date) {
  const first = startOfMonth(viewMonth);
  const last = endOfMonth(viewMonth);
  const startOffset = first.getDay();

  const days: Date[] = [];
  // leading spill
  for (let i = 0; i < startOffset; i++)
    days.push(
      new Date(
        first.getFullYear(),
        first.getMonth(),
        first.getDate() - (startOffset - i)
      )
    );
  // month days
  for (let d = 1; d <= last.getDate(); d++)
    days.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
  // trailing spill to full 6 weeks (42 cells)
  while (days.length % 7 !== 0 || days.length < 42) {
    const tail = days[days.length - 1];
    days.push(
      new Date(tail.getFullYear(), tail.getMonth(), tail.getDate() + 1)
    );
  }
  return days;
}
const SelectShift = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const shiftManagerStr = sessionStorage.getItem("shiftManager");
  const shiftManager = shiftManagerStr ? JSON.parse(shiftManagerStr) : null;
  const shiftManagerEvent = shiftManager?.event || null;
  const event = location.state ? location.state.event : shiftManagerEvent;
  // get the event from shift manager session
  const { updateBookingData } = useBookingFlow();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [shifts, setShifts] = useState<any[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [showTimes, setShowTimes] = useState(false);
  // selectedTime for time pickers: { hour: string, minute: string } | null
  const [selectedTime, setSelectedTime] = useState<{
    hour: string;
    minute: string;
  } | null>(null);
  const [shiftCarCounts, setShiftCarCounts] = useState<Record<number, number>>(
    {}
  );

  // Parse event dates
  const [viewMonth, setViewMonth] = useState<Date>(
    startOfMonth(parseISO(event.startDate))
  );

  const startDate = event?.startDate ? parseISO(event.startDate) : null;
  const endDate = event?.endDate ? parseISO(event.endDate) : null;

  const minMonth = startOfMonth(startDate);
  const maxMonth = startOfMonth(endDate);

  const canPrev = addMonths(viewMonth, -1) >= minMonth;
  const canNext = addMonths(viewMonth, +1) <= maxMonth;
  useEffect(() => {
    setViewMonth(startOfMonth(parseISO(event.startDate)));
    setSelectedDate(null);
  }, [event.startDate]);

  function goPrevMonth() {
    const next = addMonths(viewMonth, -1);
    if (next >= minMonth) setViewMonth(next);
  }
  function goNextMonth() {
    const next = addMonths(viewMonth, +1);
    if (next <= maxMonth) setViewMonth(next);
  }

  // layout: 1 card (calendar) → 2 cards (calendar + shifts) after day selected
  const gridCols = selectedDate ? "lg:grid-cols-2" : "";
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

  // Compute shifts by date for calendar rendering
  const shiftsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    shifts.forEach((shift) => {
      if (!map[shift.date]) map[shift.date] = [];
      map[shift.date].push({
        ...shift,
        availableCars: shiftCarCounts[shift.id] || 0,
        start: shift.startTime,
        end: shift.endTime,
      });
    });
    return map;
  }, [shifts, shiftCarCounts]);

  // Fetch shifts and available car counts for selected date
  const fetchShifts = async (date: string) => {
    setLoadingShifts(true);
    setSelectedShift(null);
    setSelectedTime(null);
    setShowTimes(false);
    const { data: shiftsData, error } = await hermasAdminSupabase
      .from("Shifts")
      .select("*")
      .eq("event_id", event.id)
      .eq("date", date);
    setShifts(shiftsData || []);
    // For each shift, fetch available car count
    const carCounts: Record<number, number> = {};
    if (shiftsData && shiftsData.length > 0) {
      await Promise.all(
        shiftsData.map(async (shift: any) => {
          // 1. Get all drivers for the shift and event
          const { data: drivers } = await hermasAdminSupabase
            .from("Drivers")
            .select("id")
            .eq("shift_id", shift.id)
            .eq("event_id", event.id);
          if (!drivers || drivers.length === 0) {
            carCounts[shift.id] = 0;
            return;
          }
          const driverIds = drivers.map((d: any) => d.id);
          // 2. Get all cars for these drivers and event
          const { data: cars } = await hermasAdminSupabase
            .from("Cars")
            .select("id, type, carNumber, driver_id")
            .in("driver_id", driverIds)
            .eq("event_id", event.id);
          if (!cars) {
            carCounts[shift.id] = 0;
            return;
          }
          // 3. Get all PendingRides for this event and shift
          const { data: pendingRides } = await hermasAdminSupabase
            .from("PendingRides")
            .select("car_id, status")
            .eq("event_id", event.id)
            .eq("shift_id", shift.id);
          // 4. Filter cars: exclude cars assigned to a PendingRide unless status is 'End'
          const filteredCars = cars.filter((car: any) => {
            const assignedRide = pendingRides?.find(
              (r: any) => r.car_id === car.id
            );
            return !assignedRide || assignedRide.status === "End";
          });
          carCounts[shift.id] = filteredCars.length;
        })
      );
    }
    setShiftCarCounts(carCounts);
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
    updateBookingData({ event });
  };

  // Handle time selection
  const handleTimeSelect = async (timeObj: {
    hour: string;
    minute: string;
  }) => {
    console.log("Selected time:", timeObj);
    const time = `${timeObj.hour}:${timeObj.minute}`;
    updateBookingData({ pickupTime: time });
    // Delay navigation to ensure state is updated
    setTimeout(() => {
      navigate("/home", { state: { event } });
    }, 100);
  };

  // Continue to home page
  const handleContinue = () => {
    navigate("/home", { state: { event } });
  };

  return (
    <div className="space-y-6">
      {/* HERO with event info */}
      <div
        className="rounded-2xl p-5 bg-primary text-primary-foreground border border-primary"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center bg-card shadow-lg"
            >
              <CalendarIcon className="h-6 w-6" color="hsl(var(--primary))" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Book Your Ride
              </h2>
              <p className="text-sm text-primary">
                Select a day → choose a shift
              </p>
            </div>
          </div>

          {/* Selected Event info */}
          <div
            className="rounded-xl border border-primary px-4 py-3 flex items-center gap-3 bg-secondary/20 shadow-lg"
          >
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center bg-card border border-primary"
            >
              <CalendarDays className="h-5 w-5" color="hsl(var(--primary))" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-primary-foreground">{event.name}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{event.location}</span>
              </div>
              <div className="text-xs text-primary">
                {event.startDate} &rarr; {event.endDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar + (conditionally) Shifts */}
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {/* CALENDAR (more compact height) */}
        <Card
          className="border border-border bg-card shadow-lg"
        >
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" color="hsl(var(--primary))" />
                <span className="font-extrabold">Select a Day</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goPrevMonth}
                  disabled={!canPrev}
                  className={`h-8 w-8 rounded-lg text-primary border border-primary ${
                    !canPrev ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-semibold">
                  {viewMonth.toLocaleString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goNextMonth}
                  disabled={!canNext}
                  className={`h-8 w-8 rounded-lg text-primary border border-primary ${
                    !canNext ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Event window:{" "}
              <span className="font-semibold">{event.startDate}</span> →{" "}
              <span className="font-semibold">{event.endDate}</span>
            </p>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Weekday headers tighter */}
            <div className="grid grid-cols-7 text-[11px] sm:text-xs text-muted-foreground mb-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-0.5 text-center leading-none">
                  {d}
                </div>
              ))}
            </div>

            {/* Smaller day cells */}
            <div className="grid grid-cols-7 gap-[8px]">
              {buildMonthMatrix(viewMonth).map((day, idx) => {
                const inCurrentMonth = day.getMonth() === viewMonth.getMonth();
                const insideEvent = inRange(day, startDate, endDate);
                const iso = fmtISO(day);
                const hasShifts = !!shiftsByDate[iso];
                const isSelectable = inCurrentMonth && insideEvent;
                const selected =
                  !!selectedDate && isSameDay(day, parseISO(selectedDate));
                // Opacity logic: unavailable days are faded, available days are fully opaque
                let opacityClass = "";
                if (!inCurrentMonth || !insideEvent) {
                  opacityClass = "opacity-30";
                } else if (!hasShifts) {
                  opacityClass = "opacity-60";
                } else {
                  opacityClass = "opacity-100";
                }

                // Gold accent for all available days (with shifts)
                const goldDay = hasShifts && isSelectable;

                return (
                  <button
                    key={idx}
                    disabled={!isSelectable}
                    onClick={() => isSelectable && handleDateSelect(day)}
                    className={`relative w-full h-17 sm:h-18 md:h-19 lg:h-20 rounded-md flex items-center justify-center text-[12px] border transition-all ${opacityClass} ${
                      isSelectable ? "cursor-pointer" : "cursor-not-allowed"
                    } ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground shadow-lg"
                        : goldDay
                        ? "border-primary bg-primary/20 text-primary shadow-md hover:shadow-lg font-bold"
                        : "border-border bg-card text-foreground"
                    }`}
                    title={
                      isSelectable
                        ? hasShifts
                          ? "Shifts available"
                          : "No shifts"
                        : "Out of range"
                    }
                  >
                    <span className="leading-none">{day.getDate()}</span>
                    {goldDay && !selected && (
                      <span
                        className="absolute bottom-1 h-2 w-2 rounded-full bg-primary"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* SHIFTS — visible only after a day is selected */}
        {selectedDate && (
          <Card
            className="border border-border bg-card shadow-xl"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="h-5 w-5" color="hsl(var(--primary))" />
                <span className="font-extrabold">Available Shifts</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {parseISO(selectedDate).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </CardHeader>
            <CardContent>
              {(() => {
                const key = selectedDate;
                const shifts = shiftsByDate[key] || [];
                if (shifts.length === 0) {
                  return (
                    <div className="text-sm text-muted-foreground">
                      No shifts on this day.
                    </div>
                  );
                }
                return (
                  <div className="space-y-2">
                    {shifts.map((s, i) => {
                      const disabled = s.availableCars === 0;
                      // Format start and end time as HH:mm or localized
                      let startTime = "";
                      let endTime = "";
                      let startDateObj = new Date(s.start);
                      let endDateObj = new Date(s.end);
                      const startH = startDateObj.getHours();
                      const endH = endDateObj.getHours();
                      const hours = Array.from(
                        { length: endH - startH + 1 },
                        (_, idx) => String(startH + idx).padStart(2, "0")
                      );
                      const minutesForHour = (h, endH) => {
                        if (h === endH) return ["00"];
                        return [
                          "00",
                          "05",
                          "10",
                          "15",
                          "20",
                          "25",
                          "30",
                          "35",
                          "40",
                          "45",
                          "50",
                          "55",
                        ];
                      };
                      const active = selectedShift && selectedShift.id === s.id;
                      try {
                        startTime = startDateObj.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        endTime = endDateObj.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      } catch {
                        startTime = s.start;
                        endTime = s.end;
                      }
                      return (
                        <div
                          key={i}
                          className={`flex items-center justify-between rounded-xl border p-3 bg-card shadow-md ${
                            disabled 
                              ? "border-border opacity-50" 
                              : "border-primary shadow-lg"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-foreground">
                              {s.name}
                            </div>
                            <div className="text-sm text-secondary-foreground">
                              {startTime} – {endTime}
                            </div>
                            <div className="text-xs text-primary">
                              Available Cars: {s.availableCars}
                            </div>
                          </div>
                          {/* If active, show time picker and confirm button, else show Select button */}
                          {active ? (
                            <>
                              <hr
                                className="my-3 border-primary/20"
                              />
                              <div className="pt-3">
                                <div
                                  className="text-xs font-semibold mb-2 text-primary"
                                >
                                  Select time
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-end">
                                  {/* Hour */}
                                  <div className="col-span-1">
                                    <div className="text-xs text-muted-foreground mb-1">
                                      Hour
                                    </div>
                                    <select
                                      className="h-9 w-full rounded border border-border bg-background text-foreground px-2"
                                      value={selectedTime?.hour ?? ""}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        const vNum = parseInt(v, 10);
                                        const mustBe00 = vNum === endH;
                                        setSelectedTime({
                                          hour: v,
                                          minute: mustBe00
                                            ? "00"
                                            : selectedTime?.minute ?? "00",
                                        });
                                      }}
                                    >
                                      <option value="" disabled>
                                        HH
                                      </option>
                                      {hours.map((h) => (
                                        <option key={h} value={h}>
                                          {h}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Minute */}
                                  <div className="col-span-1">
                                    <div className="text-xs text-muted-foreground mb-1">
                                      Minute
                                    </div>
                                    <select
                                      className="h-9 w-full rounded border border-border bg-background text-foreground px-2"
                                      disabled={!selectedTime?.hour}
                                      value={selectedTime?.minute ?? ""}
                                      onChange={(e) =>
                                        setSelectedTime((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                minute: e.target.value,
                                              }
                                            : {
                                                hour: "",
                                                minute: e.target.value,
                                              }
                                        )
                                      }
                                    >
                                      <option value="" disabled>
                                        MM
                                      </option>
                                      {(selectedTime?.hour
                                        ? minutesForHour(
                                            parseInt(selectedTime.hour, 10),
                                            endH
                                          )
                                        : []
                                      ).map((m) => (
                                        <option key={m} value={m}>
                                          {m}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Confirm button */}
                                  <div className="col-span-1">
                                    <Button
                                      className="w-full h-9 rounded-lg transition-all duration-300 bg-primary text-primary-foreground border border-primary hover:shadow-lg hover:shadow-primary/20"
                                      disabled={
                                        !selectedTime?.hour ||
                                        !selectedTime?.minute
                                      }
                                      onClick={() => {
                                        if (selectedTime)
                                          handleTimeSelect(selectedTime);
                                      }}
                                    >
                                      Confirm
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <Button
                              disabled={disabled}
                              className={`rounded-lg px-4 h-9 transition-all duration-300 bg-card text-primary border border-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] hover:-translate-y-0.5 ${
                                disabled
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => handleShiftSelect(s)}
                            >
                              Select
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SelectShift;
