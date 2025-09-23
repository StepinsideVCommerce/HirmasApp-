import React, { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, X, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoogleMapsApi } from "@/hooks/useGoogleMapsApi";
import { useToast } from "@/hooks/use-toast";

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (location: { address: string; lat?: number; lng?: number }) => void;
  placeholder: string;
  showCurrentLocation?: boolean;
}

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  label,
  value,
  onChange,
  placeholder,
  showCurrentLocation = false,
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const geocodeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const { isLoaded } = useGoogleMapsApi();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize the autocomplete service when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && window.google?.maps?.places?.AutocompleteService) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      geocoder.current = new window.google.maps.Geocoder();
    }
  }, [isLoaded]);

  useEffect(() => {
    return () => {
      if (geocodeDebounceRef.current) {
        clearTimeout(geocodeDebounceRef.current);
      }
    };
  }, []);

  const geocodeAddress = useCallback(
    (address: string) => {
      if (!geocoder.current || !address.trim()) {
        return;
      }

      geocoder.current.geocode({ address }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          if (inputRef.current && inputRef.current.value !== address) {
            return;
          }
          const loc = results[0].geometry.location;
          onChange({ address, lat: loc.lat(), lng: loc.lng() });
        }
      });
    },
    [onChange]
  );

  const handleInputChange = (inputValue: string) => {
    onChange({ address: inputValue });

    if (geocodeDebounceRef.current) {
      clearTimeout(geocodeDebounceRef.current);
    }

    if (!autocompleteService.current || !inputValue.trim()) {
      setIsLoading(false);
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    geocodeDebounceRef.current = setTimeout(() => {
      geocodeAddress(inputValue);
    }, 400);

    setIsLoading(true);

    autocompleteService.current.getPlacePredictions(
      {
        input: inputValue,
        types: ["establishment", "geocode"],
      },
      (predictions, status) => {
        setIsLoading(false);
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
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
    console.log("LocationPicker - handlePredictionSelect:", {
      label,
      value: prediction.description,
    });
    if (geocoder.current) {
      geocoder.current.geocode(
        { address: prediction.description },
        (results, status) => {
          if (status === "OK" && results?.[0]) {
            const loc = results[0].geometry.location;
            onChange({
              address: prediction.description,
              lat: loc.lat(),
              lng: loc.lng(),
            });
          } else {
            onChange({ address: prediction.description });
          }
        }
      );
    } else {
      onChange({ address: prediction.description });
    }
    setPredictions([]);
    setShowPredictions(false);
    inputRef.current?.blur();
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (geocoder.current) {
          geocoder.current.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              setIsGettingLocation(false);
              if (status === "OK" && results?.[0]) {
                onChange({
                  address: results[0].formatted_address,
                  lat: latitude,
                  lng: longitude,
                });
                toast({
                  title: "Location found",
                  description: "Current location has been set",
                });
              } else {
                // Fallback to coordinates if geocoding fails
                onChange({
                  address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                  lat: latitude,
                  lng: longitude,
                });
                toast({
                  title: "Location found",
                  description: "Current location coordinates have been set",
                });
              }
            }
          );
        } else {
          // Fallback if no geocoder
          setIsGettingLocation(false);
          onChange({
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            lat: latitude,
            lng: longitude,
          });
          toast({
            title: "Location found",
            description: "Current location coordinates have been set",
          });
        }
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "Location error",
          description: "Unable to get your current location",
          variant: "destructive",
        });
        console.error("Error getting location:", error);
      }
    );
  };

  const clearInput = () => {
    onChange({ address: "" });
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
    <div className="space-y-3 relative">
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
            className="bg-slate-800 border-slate-700 text-white pl-12 pr-20 h-14 text-lg"
          />
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5" />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {showCurrentLocation && (
              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                title="Use current location"
              >
                <Navigation
                  className={`w-4 h-4 ${
                    isGettingLocation ? "animate-spin" : ""
                  }`}
                />
              </Button>
            )}

            {value && (
              <Button
                type="button"
                onClick={clearInput}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Autocomplete Predictions Dropdown */}
        {showPredictions && (predictions.length > 0 || isLoading) && (
          <div className="fixed inset-x-4 top-auto z-[9999] mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl backdrop-blur-sm max-h-80 overflow-y-auto">
            {isLoading && (
              <div className="p-4 text-slate-300 text-center">Searching...</div>
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
