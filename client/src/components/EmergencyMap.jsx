import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const emergencyIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],
});

const shelterIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],
});

function EmergencyMap({
  emergencies,
  routeCoordinates,
  selectedEmergency,
  selectedShelter,
}) {
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
          icon={emergencyIcon}
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
      {selectedShelter && (
        <Marker
          position={[
            selectedShelter.location.lat,
            selectedShelter.location.lng,
          ]}
          icon={shelterIcon}
        >
          <Popup>
            <div>
              <h3>{selectedShelter.name}</h3>

              <p>
                Available Beds:
                {selectedShelter.availableBeds}
              </p>

              <p>
                Food:
                {selectedShelter.foodAvailable ? "Yes" : "No"}
              </p>

              <p>
                Water:
                {selectedShelter.waterAvailable ? "Yes" : "No"}
              </p>
            </div>
          </Popup>
        </Marker>
      )}
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
