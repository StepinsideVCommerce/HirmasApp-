import { Clock, MapPin, User, ExternalLink, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { hermasAdminSupabase } from "@/integrations/supabase/client";
import CallIcon from "@mui/icons-material/Call";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Car, Shield } from "lucide-react";

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
  const { data: rides = [], isLoading } = useQuery({
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
      location: hub?.address || "-",
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

  const getStatusConfig = (status: string) => {
    switch (status) {
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
      case "PENDING":
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: "📞",
          label: "Pending",
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

  const navigate = useNavigate();

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-10 px-2 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-extrabold gold-text mb-2 drop-shadow-lg tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
              📍 Trip Tracking Log
            </span>
          </h1>
          <p className="text-gray-300 text-lg font-medium">
            Real-time monitoring of ongoing and completed premium trips
          </p>
        </div>
      </div>

      {/* Dynamic Trip Statistics by Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueStatuses.map((status) => {
          const config = getStatusConfig(status);
          return (
            <Card
              key={status}
              className={`glass-card border-2 shadow-xl p-4 ${
                config.color.split(" ")[0]
              } backdrop-blur-md bg-opacity-70`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg ${
                    config.color.split(" ")[1]
                  }`}
                >
                  {config.icon}
                </div>
                <div>
                  <h3
                    className={`font-bold text-lg ${
                      config.color.split(" ")[1]
                    }`}
                  >
                    {config.label}
                  </h3>
                  <p className="text-3xl font-extrabold text-gray-100 drop-shadow">
                    {statusCounts[status]}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Trip List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-gray-400 text-center text-xl animate-pulse">
            Loading trips...
          </div>
        ) : trips.length === 0 ? (
          <div className="text-gray-400 text-center text-xl">
            No trips for this event.
          </div>
        ) : (
          trips.map((trip, index) => {
            const statusConfig = getStatusConfig(trip.status);
            return (
              <Card
                key={trip.id}
                className="glass-card hover:scale-[1.01] hover:shadow-2xl transition-all duration-300 border-gold-500/30 bg-slate-800/80 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center gap-8 p-8">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-full border-4 ${statusConfig.color
                        .replace("bg-", "border-")
                        .replace(
                          "-500/20",
                          "-500/50"
                        )} bg-gray-900 flex items-center justify-center text-2xl gold-glow shadow-lg`}
                    >
                      {statusConfig.icon}
                    </div>
                    {index < trips.length - 1 && (
                      <div className="w-1 h-16 bg-gradient-to-b from-yellow-400/30 to-blue-500/30 mt-2"></div>
                    )}
                  </div>

                  {/* Trip details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-100 mb-1 flex items-center gap-2 text-xl">
                          {trip.name}
                          <Badge
                            variant="outline"
                            className="bg-gray-900 px-2 py-1 border-emerald-500/30 text-emerald-400 flex items-center gap-1 shadow"
                          >
                            <CallIcon
                              style={{ fontSize: 16 }}
                              className="mr-1"
                            />
                            {trip.clientPhone !== "-" ? trip.clientPhone : "-"}
                          </Badge>
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                          <Badge
                            variant="outline"
                            className="bg-gray-900 px-2 py-1 border-gold-500/30 text-gold-400 shadow"
                          >
                            {trip.id}
                          </Badge>
                          {trip.status != "PENDING" && (
                            <Badge
                              variant="outline"
                              className="bg-gray-900 px-2 py-1 border-gold-500/30 text-gold-400 shadow"
                            >
                              {trip.carNumber !== "-"
                                ? `VH-${trip.carNumber}`
                                : "-"}
                            </Badge>
                          )}
                          {trip.status != "PENDING" && (
                            <Badge
                              variant="outline"
                              className="bg-gray-900 px-2 py-1 border-blue-500/30 text-blue-400 shadow"
                            >
                              {trip.driverNumber !== "-"
                                ? `DR-${trip.driverNumber}`
                                : "-"}
                            </Badge>
                          )}
                          {trip.status != "PENDING" && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4 text-gold-400" />
                              {trip.driverName}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Car className="w-4 h-4 text-gold-400" />
                            {trip.carModel}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gold-400" />
                            {trip.dateTime}
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={`px-4 py-2 text-base font-bold border ${statusConfig.color} shadow`}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                        <div>
                          <p className="text-xs text-gray-400">
                            Pickup Location
                          </p>
                          <p className="text-base font-medium text-gray-200">
                            {trip.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div>
                          <p className="text-xs text-gray-400">Destination</p>
                          <p className="text-base font-medium text-gray-200">
                            {trip.destination}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold-400" />
                        <div>
                          <p className="text-xs text-gray-400">Pickup Time</p>
                          <p className="text-base font-medium text-gray-200">
                            {trip.pickupTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    {trip.status != "PENDING" && (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gold-500/30 text-gold-400 hover:bg-gray-800/50 shadow"
                          onClick={() => setDetailsRide(trip)}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
      <div className="flex justify-end mt-10">
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl shadow-xl text-lg transition-all duration-200"
          onClick={() => navigate("/")}
        >
          Book a new ride
        </Button>
      </div>

      <Dialog
        open={!!detailsRide}
        onOpenChange={(open) => !open && setDetailsRide(null)}
      >
        <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 border-0 shadow-2xl rounded-2xl p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
              Ride Details
            </DialogTitle>
          </DialogHeader>
          {detailsRide ? (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-extrabold text-yellow-400">
                    {detailsRide.driverName
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-blue-300">
                      {detailsRide.driverName}
                    </span>
                    <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded ml-2 shadow">
                      DR-{detailsRide.driverNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-blue-200 font-semibold">
                      {detailsRide.carModel}
                    </span>
                    <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded shadow">
                      {detailsRide.carId}
                    </span>
                    {detailsRide.car?.licensePlate && (
                      <span className="bg-slate-700 text-yellow-300 text-xs font-bold px-2 py-0.5 rounded shadow ml-2">
                        Plate: {detailsRide.car.licensePlate}
                      </span>
                    )}
                    {detailsRide.car?.color && (
                      <span
                        className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full border-2 border-slate-700 shadow"
                        style={{ backgroundColor: detailsRide.car.color }}
                        title={detailsRide.car.color}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white inline-block"
                          style={{ backgroundColor: detailsRide.car.color }}
                        ></span>
                        <span className="text-xs font-bold text-white drop-shadow">
                          Color
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="text-blue-200 text-base mt-2">
                    Phone:{" "}
                    <span className="text-white font-semibold">
                      {detailsRide.driver?.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-6 mb-4 shadow-lg">
                <h3 className="text-yellow-300 font-bold mb-3 text-xl">
                  Trip Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-blue-200 font-medium">
                        Estimated trip time
                      </span>
                    </div>
                    <span className="text-white font-bold">10 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-blue-200 font-medium">
                        Arrival time
                      </span>
                    </div>
                    <span className="text-white font-bold">
                      {detailsRide.raw.pickupTime || "-"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-800/80 to-slate-800/80 rounded-xl p-6 mb-4 flex items-center shadow-lg">
                <Shield className="w-6 h-6 text-yellow-400 mr-4" />
                <div>
                  <h4 className="text-white font-bold text-lg">
                    Trip Protected
                  </h4>
                  <p className="text-blue-200 text-base">
                    24/7 support & safety features
                  </p>
                </div>
              </div>
              <div className="text-center mt-3">
                <p className="text-blue-200 text-lg">
                  Trip ID:{" "}
                  <span className="text-yellow-300 font-mono font-bold">
                    {detailsRide.raw.id}
                  </span>
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
