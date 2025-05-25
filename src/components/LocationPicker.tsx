
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GoogleMapsPopup from './GoogleMapsPopup';

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ label, value, onChange, placeholder }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    onChange(address);
    console.log('Selected location:', { address, lat, lng });
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
          onClick={() => setIsMapOpen(true)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 gold-gradient text-black font-semibold hover:opacity-90 transition-opacity"
        >
          Map
        </Button>
      </div>
      
      <GoogleMapsPopup
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={handleLocationSelect}
        title={`Select ${label}`}
      />
    </div>
  );
};

export default LocationPicker;
