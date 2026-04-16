import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import type { Place } from '../../data/mockData';

interface SimpleMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  center?: [number, number];
  zoom?: number;
  routeTo?: Place | null;
  locateTrigger?: number;
}

export const SimpleMapView: React.FC<SimpleMapViewProps> = ({
  places, selectedPlace, onPlaceSelect, center = [24.4672, 39.6111], zoom = 13, routeTo = null, locateTrigger = 0
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = L.map(mapRef.current, { zoomControl: false, attributionControl: false, keyboard: false }).setView(center, zoom);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', subdomains: 'abcd', maxZoom: 20 }).addTo(mapInstanceRef.current);
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, []);

  useEffect(() => {
    if (locateTrigger > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.locate().on('locationfound', (e) => {
        const { lat, lng } = e.latlng;
        if (userMarkerRef.current) userMarkerRef.current.remove();
        userMarkerRef.current = L.marker([lat, lng], { icon: L.divIcon({ html: '<div style="background: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(59,130,246,0.3);"></div>', className: 'user-location-marker', iconSize: [20, 20], iconAnchor: [10, 10] }) }).bindPopup('📍 You are here').addTo(mapInstanceRef.current!);
        mapInstanceRef.current?.setView([lat, lng], 15);
      });
    }
  }, [locateTrigger]);

  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      const { lat, lng } = selectedPlace;
      if (lat && lng) mapInstanceRef.current.setView([lat, lng], 15);
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    places.forEach(place => {
      const { lat, lng } = place;
      if (!lat || !lng) return;
      const marker = L.marker([lat, lng], { icon: L.divIcon({ html: `<div style="background: #3B82F6; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="font-size: 18px;">📍</span></div>`, className: 'custom-marker', iconSize: [36, 36], iconAnchor: [18, 18] }) });
      marker.bindPopup(`<div style="min-width: 160px;"><h3 style="font-weight: 600; margin-bottom: 4px;">${place.name}</h3><p style="font-size: 12px; color: #666; margin-bottom: 8px;">${place.category}</p><div style="display: flex; align-items: center; gap: 4px;"><span style="color: #F59E0B;">★</span><span>${place.rating}</span></div></div>`);
      marker.on('click', () => onPlaceSelect(place));
      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });
  }, [places, onPlaceSelect]);

  useEffect(() => {
    if (!mapInstanceRef.current || !routeTo || !userMarkerRef.current) return;
    const userPos = userMarkerRef.current.getLatLng();
    if (routingControlRef.current) mapInstanceRef.current.removeControl(routingControlRef.current);
    routingControlRef.current = L.Routing.control({
      waypoints: [userPos, L.latLng(routeTo.lat, routeTo.lng)],
      routeWhileDragging: false,
      lineOptions: { styles: [{ color: '#3B82F6', weight: 5 }] },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false
    }).addTo(mapInstanceRef.current);
    return () => { if (routingControlRef.current) mapInstanceRef.current?.removeControl(routingControlRef.current); };
  }, [routeTo]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};
