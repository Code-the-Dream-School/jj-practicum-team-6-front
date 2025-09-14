import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import L from "leaflet";

// Fixing the default method of markers by updating the URLs of the default marker images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  // URL for the standard (non-retina) marker icon
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

  // URL for the retina (high-DPI) marker icon
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

  // URL for the marker's shadow image (the shadow that appears below the marker)
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Simple custom markers for items
const createItemIcon = (status) => {
  const color = status === "Lost" ? "#E66240" : "#7FD96C";
  return L.divIcon({
    className: "item-marker",
    html: `<div style="background: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function LocationMap({
  onSelect,
  items = [], // ADD: support for displaying items
  mode = "select", // ADD: mode prop ("select" or "display")
}) {
  const [position, setPosition] = useState([40.7128, -74.006]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (mode === "select") {
          // Only allow selection in select mode -- This code requires advice on functionaloty
          setPosition([e.latlng.lat, e.latlng.lng]);
          if (onSelect) onSelect(e.latlng);
        }
      },
    });
    return mode === "select" ? <Marker position={position} /> : null;
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker />

      {/* ADD: Display items when in display mode */}
      {mode === "display" &&
        items.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={createItemIcon(item.status)}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                  {item.title}
                </h4>
                <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>
                  {item.location}
                </p>
                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  {item.date}
                </p>
                <span
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    backgroundColor:
                      item.status === "Lost" ? "#FEE2E2" : "#D1FAE5",
                    color: item.status === "Lost" ? "#E66240" : "#7FD96C",
                  }}
                >
                  {item.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
