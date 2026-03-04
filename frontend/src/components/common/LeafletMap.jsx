import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks
const LocationMarker = ({ onLocationSelect, position }) => {
    const map = useMapEvents({
        click(e) {
            if (onLocationSelect) {
                onLocationSelect(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
            }
        },
    });

    return position ? (
        <Marker position={position}>
            <Popup>Selected Location</Popup>
        </Marker>
    ) : null;
};

const LeafletMap = ({
    markers = [],
    center = [20.5937, 78.9629],
    zoom = 5,
    height = '400px',
    onLocationSelect = null, // Callback for picker mode
    selectedPosition = null  // Current selected position for picker mode
}) => {
    // Helper to safely parse coordinates
    const safeLat = (val) => {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 20.5937 : parsed;
    };
    const safeLng = (val) => {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 78.9629 : parsed;
    };

    // Determine center based on markers or selected position
    let mapCenter;
    if (selectedPosition) {
        mapCenter = [safeLat(selectedPosition.lat), safeLng(selectedPosition.lng)];
    } else if (markers.length > 0) {
        const firstMarker = markers[0];
        mapCenter = [
            safeLat(firstMarker.latitude || firstMarker.lat),
            safeLng(firstMarker.longitude || firstMarker.lng)
        ];
    } else {
        mapCenter = [safeLat(center[0]), safeLng(center[1])];
    }

    const mapZoom = (selectedPosition || markers.length > 0) ? 15 : zoom;

    return (
        <div style={{ height: height, width: '100%', borderRadius: '1rem', overflow: 'hidden', zIndex: 1, position: 'relative' }}>
            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render markers list */}
                {markers.map((marker) => (
                    <Marker key={marker.id} position={[
                        safeLat(marker.latitude || marker.lat),
                        safeLng(marker.longitude || marker.lng)
                    ]}>
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <h6 style={{ margin: '0 0 5px 0', color: '#FF6B00' }}>{marker.title || marker.name}</h6>
                                {marker.description && <p style={{ margin: 0, fontSize: '13px' }}>{marker.description}</p>}
                                {marker.link && (
                                    <a href={marker.link} style={{ display: 'block', marginTop: '5px', fontSize: '12px', color: '#007bff' }}>
                                        View Details
                                    </a>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Handle clicks for picker mode */}
                {onLocationSelect && (
                    <LocationMarker
                        onLocationSelect={onLocationSelect}
                        position={selectedPosition ? [safeLat(selectedPosition.lat), safeLng(selectedPosition.lng)] : null}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
