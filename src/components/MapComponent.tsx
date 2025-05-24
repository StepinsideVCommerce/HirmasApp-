
import React, { useEffect, useRef, useState } from 'react';

interface MapComponentProps {
  pickupLocation?: string;
  dropoffLocation?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  pickupLocation,
  dropoffLocation
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState<string>("");
  
  // For demonstration purposes - in production, this would be stored securely
  useEffect(() => {
    // Initialize the map
    if (!mapRef.current) return;
    
    // Display a placeholder map with styling similar to map services
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      if (!mapRef.current) return;
      canvas.width = mapRef.current.offsetWidth;
      canvas.height = mapRef.current.offsetHeight;
      drawMap();
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Draw a simplified map representation
    function drawMap() {
      if (!ctx) return;
      
      // Background
      ctx.fillStyle = '#1a2c38';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw road network
      ctx.strokeStyle = '#2d4c6a';
      ctx.lineWidth = 2;
      
      // Horizontal roads
      for (let y = 20; y < canvas.height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y + Math.random() * 40);
        ctx.stroke();
      }
      
      // Vertical roads
      for (let x = 20; x < canvas.width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + Math.random() * 30, canvas.height);
        ctx.stroke();
      }
      
      // Draw pickup point if available
      if (pickupLocation) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(canvas.width / 3, canvas.height / 2, 10, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Draw destination if available
      if (dropoffLocation) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(canvas.width * 2/3, canvas.height / 2, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw route line between points
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 3, canvas.height / 2);
        
        // Create a curved path
        ctx.bezierCurveTo(
          canvas.width / 2, canvas.height / 3,
          canvas.width / 2, canvas.height * 2/3,
          canvas.width * 2/3, canvas.height / 2
        );
        ctx.stroke();
      }
      
      // Current location indicator (blue dot with pulsing effect)
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Pulsing circle
      const pulseSize = 8 + (Math.sin(Date.now() / 500) + 1) * 5;
      ctx.strokeStyle = '#3b82f680';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Append canvas to map container
    mapRef.current.appendChild(canvas);
    
    // Animation loop for pulsing effect
    const animate = () => {
      drawMap();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (mapRef.current && mapRef.current.contains(canvas)) {
        mapRef.current.removeChild(canvas);
      }
    };
  }, [pickupLocation, dropoffLocation]);
  
  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* Add API key input for production use */}
      {!apiKey && (
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-slate-800/90 backdrop-blur-md text-white text-xs rounded-lg p-3 max-w-xs">
            <p>This is a map simulation. For a real map integration, configure a map API key in your project settings.</p>
          </div>
        </div>
      )}
      
      {/* Map overlay controls - can be enabled when using real map APIs */}
      <div className="absolute top-20 right-4 z-10 flex flex-col space-y-2">
        <button className="bg-slate-800 text-white p-2 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button className="bg-slate-800 text-white p-2 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
