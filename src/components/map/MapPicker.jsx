import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const defaultCenter = {
  lng: 8.6753, // Nigeria's approximate center
  lat: 9.0820
};

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: initialLocation || defaultCenter,
        zoom: initialLocation ? 15 : 6
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      marker.current = new mapboxgl.Marker({
        color: '#3B82F6'
      });

      if (initialLocation) {
        marker.current.setLngLat(initialLocation).addTo(map.current);
        reverseGeocode(initialLocation);
      }

      map.current.on('click', (e) => {
        const lngLat = {
          lng: e.lngLat.lng,
          lat: e.lngLat.lat
        };
        marker.current.setLngLat(lngLat).addTo(map.current);
        reverseGeocode(lngLat);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialLocation]);

  const reverseGeocode = async (lngLat) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name;
        setAddress(address);
        onLocationSelect(lngLat, address);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      toast.error('Failed to get address for selected location');
    }
  };

  const handleSearch = async () => {
    if (!address) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const lngLat = { lng, lat };
        
        marker.current.setLngLat(lngLat).addTo(map.current);
        map.current.flyTo({
          center: lngLat,
          zoom: 15,
          essential: true
        });
        
        setAddress(data.features[0].place_name);
        onLocationSelect(lngLat, data.features[0].place_name);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      toast.error('Failed to search location');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a location..."
          className="w-full p-2 pl-10 border rounded-md"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Search 
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer" 
          onClick={handleSearch}
        />
      </div>

      <div 
        ref={mapContainer} 
        className="w-full h-[400px] rounded-lg overflow-hidden border"
      />

      <div className="flex items-center text-sm text-gray-600">
        <MapPin className="w-4 h-4 mr-2" />
        {address || 'Click on the map to select a location'}
      </div>
    </div>
  );
};

export { MapPicker };
