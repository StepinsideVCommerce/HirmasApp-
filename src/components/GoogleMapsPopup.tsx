
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

interface GoogleMapsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string, lat: number, lng: number) => void;
  title: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
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

  // Get user's current location
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(pos);
          setSelectedPosition(pos);
          
          // Get address for current location
          if (geocoder) {
            geocoder.geocode({ location: pos }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                setSelectedAddress(results[0].formatted_address);
              }
            });
          }
        },
        () => {
          console.log('Error getting current location, using default');
        }
      );
    }
  }, [isOpen, geocoder]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setGeocoder(new google.maps.Geocoder());
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedPosition({ lat, lng });

      // Reverse geocode to get address
      if (geocoder) {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setSelectedAddress(results[0].formatted_address);
          }
        });
      }
    }
  }, [geocoder]);

  const handleConfirm = () => {
    if (selectedPosition && selectedAddress) {
      onLocationSelect(selectedAddress, selectedPosition.lat, selectedPosition.lng);
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
          
          if (geocoder) {
            geocoder.geocode({ location: pos }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                setSelectedAddress(results[0].formatted_address);
              }
            });
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  // Note: In production, the API key should be loaded from Supabase secrets
  const googleMapsApiKey = "AIzaSyBcpe03_PGoaE9TsAcXMEomsCXzNlLu6KY";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700">
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

          <div className="rounded-lg overflow-hidden">
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
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
                {selectedPosition && (
                  <Marker
                    position={selectedPosition}
                    icon={{
                      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 2C10.4772 2 6 6.47715 6 12C6 20 16 30 16 30C16 30 26 20 26 12C26 6.47715 21.5228 2 16 2Z" fill="#FFD700" stroke="#000" stroke-width="2"/>
                          <circle cx="16" cy="12" r="4" fill="#000"/>
                        </svg>
                      `),
                      scaledSize: new google.maps.Size(32, 32),
                    }}
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
              disabled={!selectedPosition || !selectedAddress}
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
