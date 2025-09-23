import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "./items/ItemCard";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createItemIcon = (status) => {
  const color =
    status === "Lost"
      ? getComputedStyle(document.documentElement).getPropertyValue(
          "--color-primary"
        ) || "#E66240"
      : getComputedStyle(document.documentElement).getPropertyValue(
          "--color-success"
        ) || "#7FD96C";
  return L.divIcon({
    className: "item-marker",
    html: `<div style="background: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function LocationMap({ onSelect, items = [], mode = "select" }) {
  const [position, setPosition] = useState([40.7128, -74.006]);

  const validItems = Array.isArray(items)
    ? items.filter(
        (it) =>
          typeof it?.lat === "number" &&
          !Number.isNaN(it.lat) &&
          typeof it?.lng === "number" &&
          !Number.isNaN(it.lng)
      )
    : [];
  const initialCenter =
    mode === "display" && validItems.length > 0
      ? [validItems[0].lat, validItems[0].lng]
      : position;

  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (mode === "select") {
          setPosition([e.latlng.lat, e.latlng.lng]);
          if (onSelect) onSelect(e.latlng);
        }
      },
    });
    return mode === "select" ? <Marker position={position} /> : null;
  }

  return (
    <>
      <style>{`.leaflet-item-map .leaflet-control-container, .leaflet-item-map .leaflet-top, .leaflet-item-map .leaflet-bottom { z-index: 10 !important; }`}</style>
      <MapContainer
        className="leaflet-item-map"
        center={initialCenter}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker />

        {mode === "display" &&
          validItems.map((item) => (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={createItemIcon(item.status)}
            >
              <Popup>
                <div style={{ minWidth: 260 }}>
                  <div style={{ padding: 8 }}>
                    <ItemCard item={item} readOnly={true} imageLoading="lazy" />
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </>
  );
}

function MapPopupContent({ item }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/items/${item.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/items/${item.id}`);
      }}
      style={{ minWidth: 220, cursor: "pointer" }}
    >
      {item.imageUrl && (
        <div
          style={{
            width: "100%",
            height: 120,
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      <h4 style={{ margin: "0 0 6px 0", fontWeight: "bold" }}>{item.title}</h4>
      <p style={{ margin: "0 0 6px 0", fontSize: 13 }}>{item.location}</p>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#666" }}>{item.date}</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 12,
            backgroundColor: item.status === "Lost" ? "#FEE2E2" : "#D1FAE5",
          }}
        >
          {item.status}
        </span>
      </div>
    </div>
  );
}
