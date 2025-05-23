
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ label, value, onChange, placeholder }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleMapSelect = () => {
    // Simulate map selection
    const locations = [
      "123 Luxury Hotel Drive, Downtown",
      "456 Conference Center Blvd",
      "789 VIP Terminal, Airport",
      "321 Executive Plaza, Business District"
    ];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    onChange(randomLocation);
    setIsMapOpen(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-white font-medium">{label}</label>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-slate-800 border-slate-700 text-white pl-12 h-14 text-lg"
        />
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5" />
        <Button
          type="button"
          onClick={handleMapSelect}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 gold-gradient text-black font-semibold hover:opacity-90 transition-opacity"
        >
          Map
        </Button>
      </div>
      
      {isMapOpen && (
        <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="h-48 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
            <p className="text-slate-400">Interactive Map (Simulated)</p>
          </div>
          <Button onClick={handleMapSelect} className="w-full gold-gradient text-black font-semibold">
            Select This Location
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
