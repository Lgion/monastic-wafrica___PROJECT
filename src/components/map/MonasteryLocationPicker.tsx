'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2, MapPin } from 'lucide-react';

// Fix for default marker icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface LocationPickerProps {
    initialLocation?: string;
    initialLat?: number;
    initialLng?: number;
}

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

export default function MonasteryLocationPicker({ initialLocation, initialLat, initialLng }: LocationPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    );
    const [locationName, setLocationName] = useState(initialLocation || '');
    const [loading, setLoading] = useState(false);

    const handleLocationSelect = async (lat: number, lng: number) => {
        setPosition([lat, lng]);
        setLoading(true);

        try {
            // Use Nominatim API for reverse geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10`
            );
            const data = await response.json();

            // Try to get city, town, village or county
            const name = data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                data.address.state ||
                data.display_name.split(',')[0];

            const country = data.address.country;
            const finalName = country ? `${name}, ${country}` : name;

            setLocationName(finalName);
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            // Fallback to manual entry if API fails or keep lat/lng
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner group">
                <MapContainer
                    center={position || [5.36, -4.008]}
                    zoom={position ? 12 : 6}
                    className="h-full w-full z-0"
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents onLocationSelect={handleLocationSelect} />
                    {position && <Marker position={position} icon={DefaultIcon} />}
                    {position && <ChangeView center={position} />}
                </MapContainer>

                {!position && (
                    <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] flex items-center justify-center z-10 pointer-events-none group-hover:bg-transparent transition-all">
                        <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold text-slate-600">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            Cliquez sur la carte pour choisir un lieu
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur p-2 rounded-lg shadow-sm">
                        <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Ville / Région détectée</label>
                    <input
                        name="location"
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        placeholder="Cliquez sur la carte ou saisissez manuellement"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 font-medium"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Latitude</label>
                        <input
                            name="latitude"
                            type="number"
                            step="any"
                            value={position ? position[0].toFixed(6) : ''}
                            readOnly
                            required
                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 text-sm font-mono cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Longitude</label>
                        <input
                            name="longitude"
                            type="number"
                            step="any"
                            value={position ? position[1].toFixed(6) : ''}
                            readOnly
                            required
                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 text-sm font-mono cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
