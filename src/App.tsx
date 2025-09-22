import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useState } from "react";
import Index from "./pages/Index";
import VehicleSelection from "./pages/VehicleSelection";
import MultipleTrip from "./pages/MultipleTrip";
import UserInfo from "./pages/UserInfo";
import ReviewConfirm from "./pages/ReviewConfirm";
import DriverSearch from "./pages/DriverSearch";
import RideTracking from "./pages/RideTracking";
import NotFound from "./pages/NotFound";
import StarterPage from "./pages/StarterPage";
import SelectShift from "./pages/SelectShift";
import AuthPage from "./pages/AuthPage";
import SignOutButton from "./components/SignOutButton";
import { TripTracking } from "./pages/RideRequests";
import { Header } from "./components/Header";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = React.useState(() => {
    const stored = sessionStorage.getItem("shiftManager");
    return stored ? JSON.parse(stored) : null;
  });

  const handleAuthSuccess = (user: any) => {
    setUser(user);
    sessionStorage.setItem("shiftManager", JSON.stringify(user));
  };

  const handleSignOut = () => {
    setUser(null);
    sessionStorage.removeItem("shiftManager");
  };

  // Auth-protected route wrapper
  function RequireAuth({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    if (!user) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-slate-900">
            <Routes>
              <Route
                path="/auth"
                element={<AuthPage onAuthSuccess={handleAuthSuccess} />}
              />
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <>
                      <Header onSignOut={handleSignOut} />
                      <Routes>
                        <Route path="/" element={<StarterPage />} />
                        <Route path="/select-shift" element={<SelectShift />} />
                        <Route path="/home" element={<Index />} />
                        <Route path="/vehicles" element={<VehicleSelection />} />
                        <Route path="/multiple-trip" element={<MultipleTrip />} />
                        <Route path="/user-info" element={<UserInfo />} />
                        <Route path="/review" element={<ReviewConfirm />} />
                        <Route path="/searching" element={<DriverSearch />} />
                        <Route path="/tracking" element={<RideTracking />} />
                        <Route path="ride-requests" element={<TripTracking />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </>
                  </RequireAuth>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
