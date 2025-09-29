import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "./items/ItemCard";
import L from "leaflet";
import { MdLocationPin } from "react-icons/md";
import ReactDOMServer from "react-dom/server";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --------------Simple custom markers for items (previous code)--------
// const createItemIcon = (status) => {
//   const color =
//     status === "Lost"
//       ? getComputedStyle(document.documentElement).getPropertyValue(
//           "--color-primary"
//         ) || "#E66240"
//       : getComputedStyle(document.documentElement).getPropertyValue(
//           "--color-success"
//         ) || "#7FD96C";
//   return L.divIcon({
//     className: "item-marker",
//     html: `<div style="background: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
//     iconSize: [24, 24],
//     iconAnchor: [12, 12],
//   });
// };

const createItemIcon = (status) => {
  let color;
  if (status === "Resolved") {
    color = "#000000";
  } else if (status === "Lost") {
    color =
      getComputedStyle(document.documentElement).getPropertyValue(
        "--color-primary"
      ) || "#E66240";
  } else {
    color =
      getComputedStyle(document.documentElement).getPropertyValue(
        "--color-success"
      ) || "#7FD96C";
  }
  return L.divIcon({
    className: "item-marker",
    html: `<div style="display: flex; align-items: center; justify-content: center;">
      ${iconHTML}
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32], // Anchor at bottom center of pin
    popupAnchor: [0, -32], // Popup appears above the pin
  });
};

export default function LocationMap({
  onSelect,
  items = [],
  mode = "select",
  center,
  radiusMiles,
  showCenterMarker = false,
}) {
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
    Array.isArray(center) && center.length === 2
      ? center
      : mode === "display" && validItems.length > 0
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

  function MapViewController({ center, radiusMiles }) {
    const map = useMap();
    const prevCenterRef = useRef(null);

    useEffect(() => {
      if (!Array.isArray(center) || center.length !== 2) {
        prevCenterRef.current = null;
        return;
      }

      const current = [Number(center[0]), Number(center[1])];
      const prev = prevCenterRef.current;
      const hasPrev = Array.isArray(prev) && prev.length === 2;
      const centerChanged =
        !hasPrev ||
        Math.abs(prev[0] - current[0]) > 1e-6 ||
        Math.abs(prev[1] - current[1]) > 1e-6;

      prevCenterRef.current = current;
      if (!centerChanged && hasPrev) {
        return;
      }

      if (Number.isFinite(radiusMiles) && radiusMiles > 0) {
        const meters = radiusMiles * 1609.34;
        try {
          const bounds = L.latLng(current[0], current[1]).toBounds(meters);
          map.fitBounds(bounds, { padding: [20, 20] });
        } catch (e) {
          map.setView(current, map.getZoom(), { animate: true });
        }
      } else {
        map.setView(current, map.getZoom(), { animate: true });
      }
    }, [center?.[0], center?.[1], radiusMiles, map]);
    return null;
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
        <MapViewController center={center} radiusMiles={radiusMiles} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />
        <LocationMarker />

        {showCenterMarker && Array.isArray(center) && center.length === 2 && (
          <Marker position={center} />
        )}

        {Array.isArray(center) &&
          center.length === 2 &&
          Number.isFinite(radiusMiles) &&
          radiusMiles > 0 && (
            <Circle
              center={center}
              radius={radiusMiles * 1609.34}
              pathOptions={{
                color: "#3B82F6",
                fillColor: "#93C5FD",
                fillOpacity: 0.15,
              }}
            />
          )}

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
            backgroundColor:
              item.status === "Lost"
                ? "#FEE2E2"
                : item.status === "Found"
                  ? "#D1FAE5"
                  : "#000000",
            color: item.status === "Resolved" ? "#FFFFFF" : "#000000",
          }}
        >
          {item.status}
        </span>
      </div>
    </div>
  );
}
