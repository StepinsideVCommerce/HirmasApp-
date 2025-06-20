import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Car } from "lucide-react";

const DriverSearch = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/ride-requests");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 drop-shadow-lg text-center animate-pulse">
          We are assigning you a driver, please wait
        </h1>
        {/* Car animation */}
        <div className="relative w-64 h-32 flex items-center justify-center">
          <div
            className="absolute left-0 right-0 top-1/2 h-2 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 rounded-full blur-sm opacity-70"
            style={{ zIndex: 1 }}
          ></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-400 shadow-lg animate-pulse"
            style={{ zIndex: 2 }}
          ></div>
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-400 shadow-lg animate-pulse"
            style={{ zIndex: 2 }}
          ></div>
          <div
            className="absolute top-1/2 -translate-y-1/2 animate-car-move"
            style={{ left: 0, zIndex: 3 }}
          >
            <Car className="w-16 h-16 text-yellow-300 drop-shadow-2xl" />
          </div>
        </div>
        <style>{`
          @keyframes car-move {
            0% { left: 0; }
            100% { left: 13rem; }
          }
          .animate-car-move {
            animation: car-move 5s linear forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default DriverSearch;
