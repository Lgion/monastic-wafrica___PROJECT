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
        <div className="location-picker">
            <div className="location-picker__map-wrapper group">
                <MapContainer
                    center={position || [5.36, -4.008]}
                    zoom={position ? 12 : 6}
                    className="location-picker__container"
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
                    <div className="location-picker__overlay">
                        <div className="location-picker__overlay-badge">
                            <MapPin className="location-picker__badge-icon" />
                            Cliquez sur la carte pour choisir un lieu
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="location-picker__loader">
                        <Loader2 className="location-picker__loader-icon" />
                    </div>
                )}
            </div>

            <div className="location-picker__fields">
                <div className="location-picker__field-group">
                    <label className="location-picker__label">Ville / Région détectée</label>
                    <input
                        name="location"
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        placeholder="Cliquez sur la carte ou saisissez manuellement"
                        required
                        className="location-picker__input"
                    />
                </div>

                <div className="location-picker__row">
                    <div className="location-picker__field-group">
                        <label className="location-picker__label">Latitude</label>
                        <input
                            name="latitude"
                            type="number"
                            step="any"
                            value={position ? position[0].toFixed(6) : ''}
                            readOnly
                            required
                            className="location-picker__input-readonly"
                        />
                    </div>
                    <div className="location-picker__field-group">
                        <label className="location-picker__label">Longitude</label>
                        <input
                            name="longitude"
                            type="number"
                            step="any"
                            value={position ? position[1].toFixed(6) : ''}
                            readOnly
                            required
                            className="location-picker__input-readonly"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
