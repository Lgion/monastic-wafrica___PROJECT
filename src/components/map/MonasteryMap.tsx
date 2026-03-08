'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet with Webpack/Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MonasteryMapProps {
    monasteries: any[];
}

export default function MonasteryMap({ monasteries }: MonasteryMapProps) {
    return (
        <div className="monastery-map">
            <MapContainer
                center={[5.36, -4.008]} // Centered on Abidjan/Ivory Coast approximately
                zoom={7}
                scrollWheelZoom={false}
                className="monastery-map__container"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {monasteries.filter(m => m.latitude && m.longitude).map((m) => (
                    <Marker key={m.id} position={[m.latitude, m.longitude]}>
                        <Popup>
                            <div className="monastery-map__popup">
                                <h3 className="monastery-map__popup-title">{m.name}</h3>
                                <p className="monastery-map__popup-location">{m.location}</p>
                                <a
                                    href={`#${m.id}`}
                                    className="monastery-map__popup-link"
                                >
                                    Voir détails
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
