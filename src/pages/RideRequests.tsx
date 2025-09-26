import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { hermasAdminSupabase } from "@/integrations/supabase/client";
import CallIcon from "@mui/icons-material/Call";
import { useNavigate } from "react-router-dom";
import bookRide from "../../public/images/bookRide.png";
import {
  Car,
  Clock,
  MapPin,
  User,
  Phone,
  Hash,
  ShieldCheck,
  Hourglass,
  CheckCircle,
  User2,
  CalendarDays,
  Route as RouteIcon,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Minimal types for related entities
interface Car {
  id: number;
  carNumber: number;
  driver_id: number;
  licensePlate?: string;
  color?: string; // Optional color field
}
interface Shift {
  id: number;
  date: string;
}
interface Hub {
  id: number;
  address: string;
}
interface Driver {
  id: number;
  name: string;
  driverNumber?: number | string; // Accept string or number
  phoneNumber?: string;
}

export function TripTracking() {
  const shiftManagerStr = sessionStorage.getItem("shiftManager");
  const shiftManager = shiftManagerStr ? JSON.parse(shiftManagerStr) : null;
  const shiftManagerId = shiftManager?.id || null;

  // Fetch all non-pending rides for this shift manager
  const {
    data: rides = [],
    isLoading,
    refetch: refetchRides,
  } = useQuery({
    queryKey: ["nonPendingRides", shiftManagerId],
    queryFn: async () => {
      if (!shiftManagerId) return [];
      const { data, error } = await hermasAdminSupabase
        .from("PendingRides")
        .select("*")
        .eq("shift_manager_id", shiftManagerId);
      if (error) throw error;
      return data;
    },
    enabled: !!shiftManagerId,
  });

  // Real-time subscription for PendingRides
  useEffect(() => {
    if (!shiftManagerId) return;
    const channel = hermasAdminSupabase
      .channel("realtime-pending-rides")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "PendingRides",
          filter: `shift_manager_id=eq.${shiftManagerId}`,
        },
        (payload) => {
          refetchRides();
        }
      )
      .subscribe();
    return () => {
      hermasAdminSupabase.removeChannel(channel);
    };
  }, [shiftManagerId, refetchRides]);

  // Fetch all cars, shifts, hubs, and drivers
  const { data: cars = [] } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const { data, error } = await hermasAdminSupabase
        .from("Cars")
        .select("id, carNumber, driver_id, licensePlate, color");
      if (error) throw error;
      return data;
    },
    enabled: true,
  });
  const { data: shifts = [] } = useQuery({
    queryKey: ["shifts"],
    queryFn: async () => {
      const { data, error } = await hermasAdminSupabase
        .from("Shifts")
        .select("id, date");
      if (error) throw error;
      return data;
    },
    enabled: true,
  });
  const { data: hubs = [] } = useQuery({
    queryKey: ["hubs"],
    queryFn: async () => {
      const { data, error } = await hermasAdminSupabase
        .from("Hub")
        .select("id, address");
      if (error) throw error;
      return data;
    },
    enabled: true,
  });
  const { data: drivers = [] } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await hermasAdminSupabase
        .from("Drivers")
        .select("id, name, driverNumber, phoneNumber");
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  const [detailsRide, setDetailsRide] = useState<any | null>(null);

  // Map rides to trip cards
  const trips = (rides || []).map((ride: any) => {
    const car = (cars as Car[]).find((c) => c.id === ride.car_id);
    const shift = (shifts as Shift[]).find((s) => s.id === ride.shift_id);
    const hub = (hubs as Hub[]).find((h) => h.id === ride.hub_id);
    const driver = (drivers as Driver[]).find((d) => d.id === car?.driver_id);
    return {
      id: `Tr-${ride.id}`,
      name: ride.guestName || "-",
      driverName: driver?.name || "-",
      driverNumber:
        driver &&
        driver.driverNumber !== undefined &&
        driver.driverNumber !== null &&
        driver.driverNumber !== ""
          ? driver.driverNumber
          : "-", // robust fallback
      carId: car?.carNumber ? `VH-${car.carNumber}` : "-",
      carNumber: car?.carNumber ?? "-",
      carModel: ride.carType || "-",
      status: ride.status || "-",
      dateTime: shift?.date ? `${shift.date}` : "",
      location: ride.pickupLocation || "-",
      destination: ride.dropOffLocation || "-",
      clientPhone: ride.phoneNumber || "-",
      pickupTime: ride.pickupTime || "-",
      raw: ride,
      car,
      driver,
      shift,
      hub,
    };
  });

  // Sort trips by desired status order
  const statusPriority: Record<string, number> = {
    ASSIGNED: 0,
    WAITING: 1,
    STARTED: 2,
    ARRIVED_TO_DESTINATION: 3,
    BACK: 4,
    End: 5, // Completed
    PENDING: 6,
  };

  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => {
      const aKey = (a.status || "").toString();
      const bKey = (b.status || "").toString();
      const aRank = statusPriority[aKey as keyof typeof statusPriority] ?? 99;
      const bRank = statusPriority[bKey as keyof typeof statusPriority] ?? 99;
      if (aRank !== bRank) return aRank - bRank;
      // Optional secondary sort: by date/time or id
      return (a.id || "").localeCompare(b.id || "");
    });
  }, [trips]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: "📞",
          label: "Pending",
        };
      case "STARTED":
        return {
          color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          icon: "🚀",
          label: "Started",
        };
      case "WAITING":
        return {
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: "⏳",
          label: "Waiting for Guest",
        };
      case "End":
        return {
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: "✅",
          label: "Completed",
        };
      case "BACK":
        return {
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: "🔙",
          label: "Back to Hub",
        };
      case "ASSIGNED":
        return {
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: "📋",
          label: "Assigned",
        };
      case "ARRIVED_TO_DESTINATION":
        return {
          color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
          icon: "📍",
          label: "Arrived at Destination",
        };
      default:
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: "❓",
          label: "Unknown",
        };
    }
  };

  // --- Dynamic statistics by status ---
  // Get all unique statuses from trips
  const statusCounts: Record<string, number> = {};
  trips.forEach((trip) => {
    const status = trip.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const uniqueStatuses = Object.keys(statusCounts);
  const GOLD = "#D4AF37";
  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-background text-foreground font-sans antialiased">
      {/* HERO */}
      <div className="rounded-2xl border border-border bg-card pt-0 pr-6 pb-4 pl-6 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left: title & icon inline */}
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg -mt-1">
                <RouteIcon
                  className="h-10 w-10"
                  aria-hidden="true"
                  color="hsl(var(--primary-foreground))"
                />
              </div>
              <div>
                <h2 className="relative text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight inline-block text-foreground">
                  <span className="shimmer-text">Trip Tracking Log</span>
                </h2>
                <p className="text-muted-foreground mt-2 text-base">
                  Keep tabs on rides in a clean, minimal view.
                </p>
              </div>
            </div>
          </div>

          {/* Right: image with button below */}
          <div className="flex flex-col h-full">
            <div className="relative flex-1 w-full overflow-hidden rounded-2xl border border-border mt-2 shadow-lg">
              <img
                src={bookRide}
                alt="Rides preview"
                className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>
            <Button
              className="mt-2 bg-primary text-primary-foreground h-11 rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_6px_hsl(var(--primary))] hover:scale-105"
              onClick={() => navigate("/select-shift")}
            >
              Book a ride
            </Button>
          </div>
        </div>

        {/* shimmer */}
        <style>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          .shimmer-text {
            background: linear-gradient(90deg, hsl(var(--foreground)) 25%, hsl(var(--primary)) 50%, hsl(var(--foreground)) 75%);
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 6s linear infinite;
          }
        `}</style>
      </div>

      {/* STATUS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {uniqueStatuses.map((status) => {
          const meta = getStatusConfig(status);
          const Icon = meta.icon;
          return (
            <Card
              key={status}
              className="border border-border bg-card shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{Icon}</span>
                    <span className="text-base font-semibold text-foreground">
                      {meta.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {statusCounts[status]}
                  </div>
                </div>
              </Card>
            </Card>
          );
        })}
      </div>

      {/* ACTIVE TRIPS */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <Car className="h-6 w-6" color="hsl(var(--primary-foreground))" />
            </div>
            <div>
              <CardTitle
                className="text-4xl font-extrabold tracking-tight text-foreground"
              >
                Active trips
              </CardTitle>
              <p className="text-sm text-muted-foreground -mt-0.5">
                Tap a trip for details, support, or follow-up.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {sortedTrips.map((trip) => {
              const meta = getStatusConfig(trip.status);
              const StatusIcon = meta.icon;
              return (
                <div
                  key={trip.id}
                  className="group p-5 bg-card border border-border rounded-xl shadow-sm transition-transform duration-300 ease-out hover:scale-[1.015] hover:shadow-xl"
                >
                  {/* Client box */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div className="bg-secondary border border-border rounded-2xl px-4 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="text-[11px] uppercase tracking-wide font-semibold text-primary"
                        >
                          Client
                        </span>
                        <span className="text-lg font-bold leading-tight text-foreground">
                          {trip.name}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-base text-secondary-foreground leading-tight">
                          {trip.clientPhone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Date chip */}
                      <div className="inline-flex items-center gap-1.5 text-sm text-secondary-foreground bg-secondary border border-border rounded-md px-2.5 py-1.5 font-normal">
                        <CalendarDays className="h-4 w-4" color="hsl(var(--primary))" />
                        <span>{trip.dateTime}</span>
                      </div>

                      {/* Status chip */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-border font-extrabold">
                        <span className="text-foreground">{meta.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex flex-col md:flex-row md:items-stretch gap-3 mb-3">
                    <div className="flex-1 border border-border rounded-lg p-3 bg-muted">
                      <div className="flex items-center gap-2 text-foreground text-base">
                        <MapPin className="h-4 w-4" color="hsl(var(--primary))" />
                        <span className="font-semibold">Pickup</span>
                      </div>
                      <p className="text-sm text-secondary-foreground mt-1">
                        {trip.location}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-secondary-foreground mt-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-medium">Pickup time:</span>
                        <span>{trip.pickupTime}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center px-1">
                      <ArrowRight className="h-5 w-5" color="hsl(var(--primary))" />
                    </div>
                    <div className="flex-1 border border-border rounded-lg p-3 bg-muted">
                      <div className="flex items-center gap-2 text-foreground text-base">
                        <MapPin className="h-4 w-4" color="hsl(var(--primary))" />
                        <span className="font-semibold">Destination</span>
                      </div>
                      <p className="text-sm text-secondary-foreground mt-1">
                        {trip.destination}
                      </p>
                    </div>
                  </div>

                  {/* Driver */}
                  <div className="flex items-center gap-2 text-base text-foreground">
                    <User className="h-5 w-5" color="hsl(var(--primary))" />
                    <span className="font-semibold">{trip.driverName}</span>
                    <span className="text-muted-foreground text-sm">
                      ({trip.driverNumber})
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <Phone className="h-5 w-5" color="hsl(var(--primary))" />
                    <a href={`tel:${trip.clientPhone}`} className="underline">
                      {trip.clientPhone}
                    </a>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-muted-foreground text-xs mt-3">
                    <div className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      <span className="font-medium">Trip ID:</span>
                      <span>{trip.id}</span>
                    </div>
                    <Button
                      size="sm"
                      className="h-9 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_6px_hsl(var(--primary))] hover:scale-105"
                      onClick={() => setDetailsRide(trip)}
                    >
                      More details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {detailsRide && (
        <Dialog open={true} onOpenChange={() => setDetailsRide(null)}>
          <DialogContent className="max-w-md bg-card text-foreground border border-border rounded-2xl shadow-xl">
            <DialogHeader className="border-b border-border pb-3 mb-3">
              <DialogTitle
                className="text-3xl font-extrabold tracking-tight text-foreground"
              >
                Trip details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-base">
              {/* Date & Status */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-base text-secondary-foreground bg-secondary border border-border rounded-lg px-3 py-1.5">
                  <CalendarDays className="h-4 w-4" color="hsl(var(--primary))" />
                  <span>{detailsRide.dateTime}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-base font-medium">
                  {(() => {
                    const Icon = getStatusConfig(detailsRide.status).icon;
                    return <span className="text-2xl">{Icon}</span>;
                  })()}
                  <span>{getStatusConfig(detailsRide.status).label}</span>
                </div>
              </div>

              {/* Client */}
              <div className="bg-muted border border-border rounded-xl p-3">
                <p
                  className="text-xs uppercase tracking-wide mb-1 text-primary"
                >
                  Client
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-bold text-foreground">{detailsRide.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-base text-secondary-foreground">
                    {detailsRide.clientPhone}
                  </span>
                </div>
              </div>

              {/* Driver */}
              <div className="bg-muted border border-border rounded-xl p-3">
                <p
                  className="text-xs uppercase tracking-wide mb-1 text-primary"
                >
                  Driver
                </p>
                <div className="flex items-center gap-2 text-base text-foreground">
                  <User className="h-4 w-4" color="hsl(var(--primary))" />
                  <span className="font-semibold">
                    {detailsRide.driverName} ({detailsRide.driverNumber})
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <Phone className="h-4 w-4" color="hsl(var(--primary))" />
                  <a
                    href={`tel:${detailsRide.clientPhone}`}
                    className="underline"
                  >
                    {detailsRide.clientPhone}
                  </a>
                </div>
              </div>

              {/* Vehicle */}
              <div className="bg-muted border border-border rounded-xl p-3">
                <p
                  className="text-xs uppercase tracking-wide mb-1 text-primary"
                >
                  Vehicle
                </p>
                <div className="flex items-center gap-2 text-base text-foreground font-medium">
                  <Car className="h-4 w-4" color="hsl(var(--primary))" />
                  <span>
                    {detailsRide.carModel} ({detailsRide.carId}) • Plate:{" "}
                    {detailsRide.carNumber}
                  </span>
                </div>
              </div>

              {/* Time info */}
              <div className="bg-muted border border-border rounded-xl p-3 space-y-1">
                <p
                  className="text-xs uppercase tracking-wide text-primary"
                >
                  Timing
                </p>
                <p className="text-base font-medium text-foreground">
                  Arrival time: {detailsRide.pickupTime}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border">
                <span>Trip ID: {detailsRide.id}</span>
                <Button
                  size="sm"
                  className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                  onClick={() => setDetailsRide(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
