import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

function EmergencyMap({ emergencies }) {
  const center =
  emergencies.length > 0
    ? [
        emergencies[0].location.lat,
        emergencies[0].location.lng,
      ]
    : [28.6139, 77.2090];
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
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {emergencies.map((emergency) => (
        <Marker
          key={emergency._id}
          position={[
            emergency.location.lat,
            emergency.location.lng,
          ]}
        >
          <Popup>
            <div>
              <h3>
                {emergency.emergencyType}
              </h3>

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
    </MapContainer>
  );
}

export default EmergencyMap;