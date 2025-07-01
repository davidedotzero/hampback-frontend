// src/components/dealers/MapComponent.tsx
"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Dealer } from '@/types/dealer';

// Fix for default Leaflet icon not showing up in Next.js
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// A helper component to control the map's view
function MapController({ dealer }: { dealer: Dealer | null }) {
    const map = useMap();
  
    useEffect(() => {
      if (dealer) {
        map.flyTo([dealer.coordinates.lat, dealer.coordinates.lng], 15, {
          animate: true,
          duration: 1.5,
        });
      }
    }, [dealer, map]);
  
    return null;
}

export default function MapComponent({ dealers, selectedDealer, onMarkerClick }: { dealers: Dealer[], selectedDealer: Dealer | null, onMarkerClick: (id: number) => void }) {
    if (typeof window === 'undefined') {
        return null;
    }

    const defaultPosition: [number, number] = [13.7563, 100.5018]; // Bangkok

    return (
        <>
            <style>{`.leaflet-container { width: 100%; height: 100%; }`}</style>
            <MapContainer center={defaultPosition} zoom={6} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {dealers.map(dealer => (
                    <Marker 
                        key={dealer.id}
                        position={[dealer.coordinates.lat, dealer.coordinates.lng]}
                        icon={customIcon}
                        eventHandlers={{ click: () => onMarkerClick(dealer.id) }}
                    >
                        <Popup>
                            <div className="font-bold">{dealer.name}</div>
                            {dealer.address}
                        </Popup>
                    </Marker>
                ))}
                <MapController dealer={selectedDealer} />
            </MapContainer>
        </>
    );
}
