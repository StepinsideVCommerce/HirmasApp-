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
  height: '100%',
  minHeight: '400px'
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
  const [isApiKeyLoaded, setIsApiKeyLoaded] = useState(false);
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
          setIsApiKeyLoaded(true);
          console.log('Google Maps API key loaded successfully');
        } else {
          console.log('No API key configured, using fallback map');
          setIsApiKeyLoaded(true);
        }
      } catch (error) {
        console.log('Failed to fetch API key, using fallback map', error);
        setIsApiKeyLoaded(true);
      }
    };

    fetchApiKey();
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    console.log('Map loaded successfully');
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const geocodeLocation = async (location: string) => {
    if (!map || !window.google?.maps?.Geocoder) {
      toast({
        title: "Error",
        description: "Map not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Geocoding location:', location);
    
    const geocoder = new window.google.maps.Geocoder();

    try {
      const geocodeResults = await new Promise<{results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus}>((resolve, reject) => {
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
            resolve({ results, status });
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      const result = geocodeResults.results[0];
      const position = result.geometry.location;
      const lat = position.lat();
      const lng = position.lng();

      console.log('Location found:', { lat, lng, address: result.formatted_address });

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
    } catch (error) {
      console.error('Geocoding error:', error);
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
    console.log('Searching for:', searchQuery);
    geocodeLocation(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearMarkers = () => {
    setMarkers([]);
    console.log('Markers cleared');
  };

  // Search Controls Component - Always render this
  const SearchControls = () => (
    <div className="absolute top-4 left-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location..."
              className="bg-white border-gray-300 text-gray-900 pl-10 h-12 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={handleKeyPress}
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              size="sm"
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
            >
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            {markers.length > 0 && (
              <Button
                onClick={clearMarkers}
                variant="outline"
                size="sm"
                className="h-12 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Results Info Component
  const ResultsInfo = () => {
    if (markers.length === 0) return null;
    
    return (
      <div className="absolute bottom-4 left-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h4 className="text-gray-900 font-medium text-sm">Found {markers.length} location{markers.length > 1 ? 's' : ''}</h4>
              <p className="text-gray-600 text-xs truncate">Latest: {markers[markers.length - 1]?.title}</p>
            </div>
            <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>
    );
  };

  // If API key is not loaded yet, show loading with search controls
  if (!isApiKeyLoaded) {
    return (
      <div className="relative w-full h-full min-h-[400px] bg-slate-800 flex items-center justify-center">
        <SearchControls />
        <div className="text-white">Loading map...</div>
      </div>
    );
  }

  // If no API key, show fallback with search controls
  if (!apiKey) {
    return (
      <div className="relative w-full h-full min-h-[400px] bg-slate-800 flex items-center justify-center">
        <SearchControls />
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
    <div className="relative w-full h-full min-h-[400px]">
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries}
        loadingElement={
          <div className="w-full h-full min-h-[400px] bg-slate-800 flex items-center justify-center">
            <SearchControls />
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

      {/* Always render search controls on top */}
      <SearchControls />
      
      {/* Results info */}
      <ResultsInfo />
    </div>
  );
};

export default MapComponent;
