
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';

interface RouteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickupLocation: string;
  dropoffLocation: string;
}

const RouteMapModal: React.FC<RouteMapModalProps> = ({
  isOpen,
  onClose,
  pickupLocation,
  dropoffLocation,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded } = useGoogleMapsApi();

  const initializeMap = useCallback(async () => {
    if (!isLoaded || !mapRef.current || !pickupLocation || !dropoffLocation) return;

    setIsLoading(true);
    setError(null);

    try {
      const mapInstance = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 40.7589, lng: -73.9851 }, // Default to NYC
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ color: '#1e293b' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0f172a' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#374151' }],
          },
        ],
      });

      setMap(mapInstance);

      // Geocode both locations
      const geocoder = new google.maps.Geocoder();
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: '#EAB308', // yellow-500
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
        markerOptions: {
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#EAB308',
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
          },
        },
      });

      directionsRenderer.setMap(mapInstance);

      // Calculate and display route
      const request: google.maps.DirectionsRequest = {
        origin: pickupLocation,
        destination: dropoffLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
          
          // Custom markers for pickup and dropoff
          const route = result.routes[0];
          const leg = route.legs[0];
          
          // Pickup marker
          new google.maps.Marker({
            position: leg.start_location,
            map: mapInstance,
            title: 'Pickup Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#10B981', // green-500
              fillOpacity: 1,
              strokeColor: '#000',
              strokeWeight: 2,
            },
          });
          
          // Dropoff marker
          new google.maps.Marker({
            position: leg.end_location,
            map: mapInstance,
            title: 'Dropoff Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#EF4444', // red-500
              fillOpacity: 1,
              strokeColor: '#000',
              strokeWeight: 2,
            },
          });
          
          setIsLoading(false);
        } else {
          setError('Unable to calculate route');
          setIsLoading(false);
        }
      });
    } catch (err) {
      setError('Failed to load map');
      setIsLoading(false);
    }
  }, [isLoaded, pickupLocation, dropoffLocation]);

  useEffect(() => {
    if (isOpen) {
      initializeMap();
    }
  }, [isOpen, initializeMap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-[95vw] h-[85vh] max-w-4xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Navigation className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Route Preview</h2>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Route Info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-300 truncate">{pickupLocation}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-300 truncate">{dropoffLocation}</span>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="absolute inset-0 pt-32">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Loading route...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-white text-lg font-semibold mb-2">Route Error</p>
                <p className="text-slate-300">{error}</p>
              </div>
            </div>
          )}
          
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default RouteMapModal;
