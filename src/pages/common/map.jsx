import React, { useEffect, useRef, useState } from 'react';

const GoogleMapComponent = ({ locationLong, locationLat, setLocationLong, setLocationLat }) => {


    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [location, setLocation] = useState({ lat: +locationLat || null, lng: +locationLong || null });
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (!window.google && !mapLoaded) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBkSTcxeZU3zF9mPWRptzmSS8r9x7x22d8`;
            script.async = true;
            script.onload = () => setMapLoaded(true);
            document.head.appendChild(script);
        } else {
            setMapLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (mapLoaded && window.google && mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: {
                    lat: +locationLat || 10.762622,
                    lng: +locationLong || 106.660172
                },
                zoom: 14,
            });

            if (location.lat && location.lng) {
                // Nếu đã có tọa độ truyền xuống thì tạo Marker
                markerRef.current = new window.google.maps.Marker({
                    position: { lat: location.lat, lng: location.lng },
                    map: map,
                });

                map.setCenter({ lat: location.lat, lng: location.lng });
            }

            map.addListener('click', (event) => {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();

                setLocation({ lat, lng });
                setLocationLong(lng);
                setLocationLat(lat);

                // Xóa Marker cũ nếu tồn tại
                if (markerRef.current) {
                    markerRef.current.setMap(null);
                }

                // Tạo Marker mới
                markerRef.current = new window.google.maps.Marker({
                    position: { lat, lng },
                    map: map,
                });
            });
        }
    }, [mapLoaded, +locationLat, +locationLong]);

    return (
        <div>
            <div
                ref={mapRef}
                style={{ width: '100%', height: '500px', borderRadius: '8px', marginBottom: '1rem' }}
            />
            {location.lat && location.lng && (
                <div>
                    <p><strong>Tọa độ đã chọn:</strong></p>
                    <p>Vĩ độ: {location.lat}</p>
                    <p>Kinh độ: {location.lng}</p>
                </div>
            )}
        </div>
    );
};

export default GoogleMapComponent;
