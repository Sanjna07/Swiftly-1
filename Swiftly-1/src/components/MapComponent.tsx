import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  currentLocation: [number, number];
  destination: [number, number];
}

const MapComponent = ({ currentLocation, destination }: Props) => {
  return (
    <MapContainer
      center={currentLocation}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={currentLocation}>
        <Popup>Your Location</Popup>
      </Marker>

      <Marker position={destination}>
        <Popup>Destination</Popup>
      </Marker>

      <Polyline positions={[currentLocation, destination]} color="blue" />
    </MapContainer>
  );
};

export default MapComponent;