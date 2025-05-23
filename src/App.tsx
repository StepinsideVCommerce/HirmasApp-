
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VehicleSelection from "./pages/VehicleSelection";
import ReviewConfirm from "./pages/ReviewConfirm";
import DriverSearch from "./pages/DriverSearch";
import RideTracking from "./pages/RideTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-slate-900">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vehicles" element={<VehicleSelection />} />
            <Route path="/review" element={<ReviewConfirm />} />
            <Route path="/searching" element={<DriverSearch />} />
            <Route path="/tracking" element={<RideTracking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
