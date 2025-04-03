import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibW10dWt1ciIsImEiOiJjbTEyZGk2dmwwbjZyMmtzMXFzb3V0cHRuIn0.pDgNHWd_o6u2NKVFib0EPQ';

const MapComponent = ({ coordinates = [7.492, 9.057], listings = [], onMarkerClick }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinates,
      zoom: 12,
    });

    // Add markers with property price
    listings.forEach((listing) => {
      const markerDiv = document.createElement('div');
      markerDiv.className = 'price-marker';
      markerDiv.innerHTML = `<span class="font-bold text-sm text-blue-500 bg-white px-2 py-1 rounded-lg shadow-md cursor-pointer">${listing.price}</span>`;

      // Add click event to the marker
      markerDiv.addEventListener('click', () => onMarkerClick(listing));

      // Add marker to the map
      new mapboxgl.Marker(markerDiv)
        .setLngLat(listing.coordinates)
        .addTo(map);
    });

    return () => map.remove(); // Cleanup map instance on unmount
  }, [coordinates, listings, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%' }}
      className="rounded-lg"
    />
  );
};

export default MapComponent;