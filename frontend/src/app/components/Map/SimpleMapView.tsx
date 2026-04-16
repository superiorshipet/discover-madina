import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Place } from '../../data/mockData';

interface SimpleMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  center?: [number, number];
  zoom?: number;
}

export const SimpleMapView: React.FC<SimpleMapViewProps> = ({
  places,
  selectedPlace,
  onPlaceSelect,
  center = [24.4672, 39.6111],
  zoom = 13,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      keyboard: false, // Disable keyboard on map
    }).setView(center, zoom);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapInstanceRef.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.locate().on('locationfound', (e) => {
      setUserLocation([e.latlng.lat, e.latlng.lng]);
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      const lat = selectedPlace.lat;
      const lng = selectedPlace.lng;
      if (lat && lng) {
        mapInstanceRef.current.setView([lat, lng], 15);
      }
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    places.forEach(place => {
      const lat = place.lat;
      const lng = place.lng;
      
      if (!lat || !lng) return;

      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          html: `<div style="background: #3B82F6; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="font-size: 18px;">📍</span></div>`,
          className: 'custom-marker',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        }),
      });

      marker.bindPopup(`
        <div style="min-width: 160px;">
          <h3 style="font-weight: 600; margin-bottom: 4px;">${place.name}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${place.category}</p>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: #F59E0B;">★</span>
            <span>${place.rating}</span>
            <span style="color: #999;">(${place.reviewCount})</span>
          </div>
        </div>
      `);

      marker.on('click', () => onPlaceSelect(place));
      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });
  }, [places, onPlaceSelect]);

  useEffect(() => {
    if (!userLocation || !mapInstanceRef.current) return;

    const userMarker = L.marker(userLocation, {
      icon: L.divIcon({
        html: '<div style="background: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(59,130,246,0.3);"></div>',
        className: 'user-location-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    }).bindPopup('📍 You are here').addTo(mapInstanceRef.current);

    return () => {
      userMarker.remove();
    };
  }, [userLocation]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};
