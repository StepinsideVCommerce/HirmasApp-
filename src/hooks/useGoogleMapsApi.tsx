
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapsApiState {
  isLoaded: boolean;
  isLoading: boolean;
  apiKey: string | null;
  error: string | null;
}

// Global state to prevent multiple API loads
let globalApiState: GoogleMapsApiState = {
  isLoaded: false,
  isLoading: false,
  apiKey: null,
  error: null,
};

let listeners: Array<(state: GoogleMapsApiState) => void> = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener(globalApiState));
};

export const useGoogleMapsApi = () => {
  const [apiState, setApiState] = useState<GoogleMapsApiState>(globalApiState);

  useEffect(() => {
    // Add this component as a listener
    const listener = (state: GoogleMapsApiState) => {
      setApiState({ ...state });
    };
    listeners.push(listener);

    // If not loaded and not loading, start loading
    if (!globalApiState.isLoaded && !globalApiState.isLoading) {
      loadGoogleMapsApi();
    }

    // Cleanup listener on unmount
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return apiState;
};

const loadGoogleMapsApi = async () => {
  if (globalApiState.isLoaded || globalApiState.isLoading) {
    return;
  }

  globalApiState.isLoading = true;
  notifyListeners();

  try {
    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      console.log('Google Maps API already loaded');
      globalApiState.isLoaded = true;
      globalApiState.isLoading = false;
      globalApiState.error = null;
      notifyListeners();
      return;
    }

    // Fetch API key
    const { data, error } = await supabase.functions.invoke('get-google-maps-key');
    
    if (error || !data?.apiKey) {
      throw new Error('Failed to get Google Maps API key');
    }

    globalApiState.apiKey = data.apiKey;

    // Load the Google Maps script manually
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      globalApiState.isLoaded = true;
      globalApiState.isLoading = false;
      globalApiState.error = null;
      notifyListeners();
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps API');
      globalApiState.isLoading = false;
      globalApiState.error = 'Failed to load Google Maps API';
      notifyListeners();
    };

    document.head.appendChild(script);

  } catch (error) {
    console.error('Error loading Google Maps API:', error);
    globalApiState.isLoading = false;
    globalApiState.error = error instanceof Error ? error.message : 'Unknown error';
    notifyListeners();
  }
};
