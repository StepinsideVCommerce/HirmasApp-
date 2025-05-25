import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const LocationPicker: React.FC<LocationPickerProps> = ({ label, value, onChange, placeholder }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const { isLoaded } = useGoogleMapsApi();
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize the autocomplete service when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && window.google?.maps?.places?.AutocompleteService) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    
    if (!autocompleteService.current || !inputValue.trim()) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setIsLoading(true);
    
    autocompleteService.current.getPlacePredictions(
      {
        input: inputValue,
        types: ['establishment', 'geocode'],
      },
      (predictions, status) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      }
    );
  };

  const handlePredictionSelect = (prediction: Prediction) => {
    onChange(prediction.description);
    setPredictions([]);
    setShowPredictions(false);
    inputRef.current?.blur();
  };

  const clearInput = () => {
    onChange('');
    setPredictions([]);
    setShowPredictions(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (predictions.length > 0) {
      setShowPredictions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding predictions to allow for click events
    setTimeout(() => {
      setShowPredictions(false);
    }, 200);
  };

  return (
    <div className="space-y-3">
      <label className="text-white font-medium">{label}</label>
      <div className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className="bg-slate-800 border-slate-700 text-white pl-12 pr-12 h-14 text-lg"
          />
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5" />
          
          {value && (
            <Button
              type="button"
              onClick={clearInput}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Autocomplete Predictions Dropdown */}
        {showPredictions && (predictions.length > 0 || isLoading) && (
          <div className="absolute top-full left-0 right-0 z-[9999] mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl max-h-80 overflow-y-auto backdrop-blur-sm">
            {isLoading && (
              <div className="p-4 text-slate-400 text-center">
                Searching...
              </div>
            )}
            
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                onClick={() => handlePredictionSelect(prediction)}
                className="p-4 hover:bg-slate-700 cursor-pointer border-b border-slate-600 last:border-b-0 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-sm text-slate-400 truncate">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
