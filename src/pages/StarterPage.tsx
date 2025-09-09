import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hermasAdminSupabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";
import { useBookingFlow } from "@/hooks/useBookingFlow";

// Use the Events row type from the generated types
// This ensures type safety and matches the schema

type Event = Database["public"]["Tables"]["Events"]["Row"];

const StarterPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateBookingData } = useBookingFlow();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      // Fetch all columns from Events table, order by startDate ascending
      const { data, error } = await hermasAdminSupabase
        .from("Events")
        .select("*")
        .order("startDate", { ascending: true });
      if (error) {
        setError("Failed to load events");
        setEvents([]);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleEventSelect = (event: Event) => {
    console.log("Selected event:", event);
    updateBookingData({ serviceType: "Trip0" });
    updateBookingData({ event });
    navigate("/select-shift", { state: { event } });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full bg-slate-800/50 backdrop-blur-md rounded-xl p-8 mt-12">
        <Button
          className="mb-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
          onClick={() => navigate("/ride-requests")}
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Choose an Event
        </h1>
        {loading && (
          <div className="text-slate-300 text-center py-8">
            Loading events...
          </div>
        )}
        {error && <div className="text-red-500 text-center py-8">{error}</div>}
        <div className="space-y-4">
          {events.map((event) => (
            <Button
              key={event.id}
              className="w-full py-6 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl shadow-lg transition-all duration-200"
              onClick={() => handleEventSelect(event)}
            >
              <div className="flex flex-row items-center justify-between w-full">
                <span className="font-bold text-lg truncate max-w-[60%]">
                  {event.name}
                </span>
                <span className="text-xs text-slate-800 font-medium ml-2 whitespace-nowrap">
                  {event.startDate} - {event.endDate}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarterPage;
