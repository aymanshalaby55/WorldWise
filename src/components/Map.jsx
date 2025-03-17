import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect } from "react";
import { useCities } from "../context/CitiesContext";
import useGeolocation from "../hooks/useGeolocation";
import Button from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";

function Map() {
  const [mapLat, mapLng] = useUrlPosition();
  const [mapPosition, setMapPosition] = useState([
    38.727881642324164, -9.140900099907554,
  ]);
  const { isLoading, position, getPosition } = useGeolocation();
  const { cities } = useCities();

  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([parseFloat(mapLat), parseFloat(mapLng)]);
    }
  }, [mapLat, mapLng]);

  useEffect(
    function () {
      if (position) {
        setMapPosition([position.lat, position.lng]);
      }
    },
    [position]
  );

  return (
    <div className={styles.mapContainer}>
      {!position && (
        <Button type="position" onClick={getPosition}>
          {isLoading ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        className={styles.mapContainer}
        zoom={15}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              {city.cityName}, {city.country} <br /> {city.notes}
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}

export default Map;
