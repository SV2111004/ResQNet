import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

function EmergencyMap({ emergencies, routeCoordinates }) {
  const center =
    emergencies.length > 0
      ? [emergencies[0].location.lat, emergencies[0].location.lng]
      : [28.6139, 77.209];
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{
        height: "500px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {emergencies.map((emergency) => (
        <Marker
          key={emergency._id}
          position={[emergency.location.lat, emergency.location.lng]}
        >
          <Popup>
            <div>
              <h3>{emergency.emergencyType}</h3>

              <p>
                Priority:
                {emergency.priorityScore}
              </p>

              <p>
                Status:
                {emergency.status}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
      {routeCoordinates && routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: "blue",
            weight: 6,
          }}
        />
      )}
    </MapContainer>
  );
}

export default EmergencyMap;
