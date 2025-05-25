
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string, lat: number, lng: number) => void;
  title: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060, // New York City default
};

const GoogleMapsPopup: React.FC<GoogleMapsPopupProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  title
}) => {
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>(defaultCenter);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);

  // Get API key from Supabase secrets
  useEffect(() => {
    const getApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-google-maps-key');
        if (!error && data?.apiKey) {
          setApiKey(data.apiKey);
        }
      } catch (error) {
        console.error('Error fetching API key:', error);
      }
    };

    if (isOpen) {
      getApiKey();
    }
  }, [isOpen]);

  // Get user's current location
  useEffect(() => {
    if (isOpen && navigator.geolocation && isScriptLoaded && isGoogleMapsReady) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(pos);
          setSelectedPosition(pos);
          
          // Try to get address for current location, but don't require it
          if (geocoder) {
            geocoder.geocode({ location: pos }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                setSelectedAddress(results[0].formatted_address);
              } else {
                // Fallback address if geocoding fails
                setSelectedAddress(`${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
              }
            });
          } else {
            // Fallback address if no geocoder
            setSelectedAddress(`${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
          }
        },
        () => {
          console.log('Error getting current location, using default');
        }
      );
    }
  }, [isOpen, geocoder, isScriptLoaded, isGoogleMapsReady]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // Only create geocoder when script is loaded and google is available
    if (window.google && window.google.maps) {
      setGeocoder(new window.google.maps.Geocoder());
      setIsGoogleMapsReady(true);
    }
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setIsGoogleMapsReady(false);
  }, []);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedPosition({ lat, lng });

      // Try to reverse geocode to get address, but provide fallback
      if (geocoder) {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setSelectedAddress(results[0].formatted_address);
          } else {
            // Fallback to coordinates if geocoding fails
            setSelectedAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        });
      } else {
        // Fallback to coordinates if no geocoder
        setSelectedAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    }
  }, [geocoder]);

  const handleConfirm = () => {
    if (selectedPosition) {
      // Use selectedAddress if available, otherwise use coordinates
      const addressToUse = selectedAddress || `${selectedPosition.lat.toFixed(6)}, ${selectedPosition.lng.toFixed(6)}`;
      onLocationSelect(addressToUse, selectedPosition.lat, selectedPosition.lng);
      onClose();
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedPosition(pos);
          
          if (map) {
            map.panTo(pos);
          }
          
          // Try to get address, but provide fallback
          if (geocoder) {
            geocoder.geocode({ location: pos }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                setSelectedAddress(results[0].formatted_address);
              } else {
                setSelectedAddress(`${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
              }
            });
          } else {
            setSelectedAddress(`${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  // Create custom marker icon safely after Google Maps is ready
  const createCustomMarkerIcon = useCallback(() => {
    if (!window.google?.maps?.Size) {
      console.warn("Google Maps API not loaded yet");
      return undefined;
    }

    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C10.4772 2 6 6.47715 6 12C6 20 16 30 16 30C16 30 26 20 26 12C26 6.47715 21.5228 2 16 2Z" fill="#FFD700" stroke="#000" stroke-width="2"/>
          <circle cx="16" cy="12" r="4" fill="#000"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
    };
  }, []);

  if (!apiKey) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Loading Map...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-96">
            <div className="text-white">Loading Google Maps...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleUseCurrentLocation}
              variant="outline"
              className="flex items-center space-x-2 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              <Navigation className="w-4 h-4" />
              <span>Use Current Location</span>
            </Button>
            
            {selectedAddress && (
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-yellow-500" />
                <span className="text-sm max-w-md truncate">{selectedAddress}</span>
              </div>
            )}
          </div>

          <div className="rounded-lg overflow-hidden" style={{ height: '500px' }}>
            <LoadScript 
              googleMapsApiKey={apiKey}
              onLoad={handleScriptLoad}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={currentLocation}
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={onMapClick}
                options={{
                  styles: [
                    {
                      "featureType": "all",
                      "elementType": "geometry",
                      "stylers": [{"color": "#242f3e"}]
                    },
                    {
                      "featureType": "all",
                      "elementType": "labels.text.stroke",
                      "stylers": [{"lightness": -80}]
                    },
                    {
                      "featureType": "administrative",
                      "elementType": "labels.text.fill",
                      "stylers": [{"color": "#746855"}]
                    },
                    {
                      "featureType": "road",
                      "elementType": "geometry.fill",
                      "stylers": [{"color": "#2b3544"}]
                    },
                    {
                      "featureType": "water",
                      "elementType": "geometry",
                      "stylers": [{"color": "#17263c"}]
                    }
                  ]
                }}
              >
                {selectedPosition && isGoogleMapsReady && (
                  <Marker
                    position={selectedPosition}
                    icon={createCustomMarkerIcon()}
                  />
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedPosition}
              className="gold-gradient text-black font-semibold hover:opacity-90"
            >
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleMapsPopup;
