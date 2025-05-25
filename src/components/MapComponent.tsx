
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Search, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface MapComponentProps {
  pickupLocation?: string;
  dropoffLocation?: string;
}

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 40.7589, // New York City
  lng: -73.9851
};

const MapComponent: React.FC<MapComponentProps> = ({ 
  pickupLocation,
  dropoffLocation
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();

  // Fetch Google Maps API key
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/get-google-maps-key');
        if (response.ok) {
          const data = await response.json();
          setApiKey(data.apiKey);
        } else {
          console.log('No API key configured, using fallback map');
        }
      } catch (error) {
        console.log('Failed to fetch API key, using fallback map');
      }
    };

    fetchApiKey();
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const geocodeLocation = async (location: string) => {
    if (!map || !window.google) {
      toast({
        title: "Error",
        description: "Map not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const geocoder = new window.google.maps.Geocoder();

    try {
      const response = await new Promise<google.maps.GeocoderResponse>((resolve, reject) => {
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === 'OK' && results) {
            resolve({ results, status });
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      if (response.results && response.results[0]) {
        const result = response.results[0];
        const position = result.geometry.location;
        const lat = position.lat();
        const lng = position.lng();

        // Center map on the location
        map.setCenter({ lat, lng });
        map.setZoom(15);

        // Add marker
        const newMarker: MarkerData = {
          lat,
          lng,
          title: result.formatted_address || location
        };

        setMarkers(prev => [...prev, newMarker]);

        toast({
          title: "Location Found",
          description: `Found: ${result.formatted_address}`,
        });
      }
    } catch (error) {
      toast({
        title: "Location Not Found",
        description: "Please try a more specific address or landmark.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Empty Search",
        description: "Please enter a location to search.",
        variant: "destructive"
      });
      return;
    }
    geocodeLocation(searchQuery);
  };

  const clearMarkers = () => {
    setMarkers([]);
  };

  // If no API key, show fallback
  if (!apiKey) {
    return (
      <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Map Integration Required</h3>
          <p className="text-slate-300 text-sm max-w-md">
            To use the interactive map with search functionality, please configure your Google Maps API key in the project settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries}
        loadingElement={
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <div className="text-white">Loading map...</div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: [
              {
                featureType: "all",
                elementType: "geometry.fill",
                stylers: [{ color: "#1e293b" }]
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#0f172a" }]
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#374151" }]
              }
            ],
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.title}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Search Controls */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-slate-800/95 backdrop-blur-md rounded-xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location (e.g., Statue of Liberty)"
                className="bg-slate-700 border-slate-600 text-white pl-10 h-12"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 w-4 h-4" />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="h-12 px-6 gold-gradient text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
              {markers.length > 0 && (
                <Button
                  onClick={clearMarkers}
                  variant="outline"
                  className="h-12 border-slate-600 text-white hover:bg-slate-700"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {markers.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-slate-800/95 backdrop-blur-md rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold">Found {markers.length} location{markers.length > 1 ? 's' : ''}</h4>
                <p className="text-slate-300 text-sm">Latest: {markers[markers.length - 1]?.title}</p>
              </div>
              <MapPin className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
