"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon paths broken by webpack/Next.js bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Addis Ababa neighbourhood coordinate lookup ──────────────────────────────
const ADDIS_LOCATIONS = {
  bole: [8.9937, 38.7876],
  "bole atlas": [8.9937, 38.7876],
  atlas: [8.9937, 38.7876],
  kazanchis: [9.019, 38.7618],
  piassa: [9.0284, 38.7421],
  gerji: [8.9832, 38.8112],
  ayat: [8.9741, 38.8386],
  megenagna: [9.0214, 38.8024],
  summit: [8.9636, 38.8222],
  sumit: [8.9636, 38.8222],
  "4 kilo": [9.0358, 38.7634],
  "6 kilo": [9.0302, 38.7624],
  "22 mazoria": [9.0118, 38.7985],
  saris: [8.9691, 38.7552],
  sarbet: [9.0049, 38.7565],
  kera: [8.9962, 38.7579],
  gotera: [9.0, 38.755],
  mexico: [9.0216, 38.7475],
  arat: [9.0051, 38.7812],
  "arat kilo": [9.0354, 38.7575],
  selam: [8.966, 38.7835],
  lideta: [9.009, 38.7426],
  merkato: [9.0239, 38.7359],
  lebu: [8.95, 38.735],
  jemo: [8.949, 38.726],
  kolfe: [9.0295, 38.7042],
  yeka: [9.034, 38.819],
  "nifas silk": [8.98, 38.795],
  lafto: [8.95, 38.768],
  akaki: [8.897, 38.797],
};

/** Resolve a free-text address to [lat, lng] or null */
export function resolveAddress(address) {
  if (!address) return null;
  const key = address.toLowerCase().trim();
  if (ADDIS_LOCATIONS[key]) return ADDIS_LOCATIONS[key];
  for (const [place, coords] of Object.entries(ADDIS_LOCATIONS)) {
    if (key.includes(place) || place.includes(key)) return coords;
  }
  return null;
}

// ── Haversine distance in km ─────────────────────────────────────────────────
function haversineKm([lat1, lng1], [lat2, lng2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Fixed origin ─────────────────────────────────────────────────────────────
const ORIGIN = ADDIS_LOCATIONS["bole"];

// ── Custom coloured drop-pin icons ───────────────────────────────────────────
const makeIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${color};border:3px solid #fff;
      transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });

const restaurantIcon = makeIcon("#c2410c"); // berbere red
const destinationIcon = makeIcon("#1d4ed8"); // blue

/** Auto-fit map to show both markers */
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
    }
  }, [map, points]);
  return null;
}

/**
 * DeliveryMap
 *
 * Props:
 *   deliveryAddress {string}  – free-text address from the order
 *   height          {string}  – CSS height (default "320px")
 */
export default function DeliveryMap({ deliveryAddress, height = "320px" }) {
  const dest = resolveAddress(deliveryAddress);
  const points = dest ? [ORIGIN, dest] : [ORIGIN];

  const distanceKm = dest ? haversineKm(ORIGIN, dest) : null;
  const distanceText = distanceKm
    ? distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${distanceKm.toFixed(1)} km`
    : null;

  return (
    <div>
      {/* Distance info bar */}
      {distanceText && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "10px",
            padding: "0.65rem 1rem",
            marginBottom: "0.75rem",
            fontSize: "0.875rem",
            flexWrap: "wrap",
          }}
        >
          <span>
            🏪 <strong>Addis Eats (Bole)</strong>
          </span>
          <span style={{ color: "#78716c" }}>──🛵──</span>
          <span>
            📦{" "}
            <strong style={{ textTransform: "capitalize" }}>
              {deliveryAddress}
            </strong>
          </span>
          <span
            style={{
              marginLeft: "auto",
              background: "#c2410c",
              color: "#fff",
              padding: "0.2rem 0.75rem",
              borderRadius: "9999px",
              fontWeight: 700,
            }}
          >
            📏 {distanceText} away
          </span>
        </div>
      )}

      {/* Map */}
      <div
        style={{
          height,
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e7e5e4",
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        }}
      >
        <MapContainer
          center={ORIGIN}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Auto-fit bounds when dest is known */}
          {dest && <FitBounds points={points} />}

          {/* Restaurant marker */}
          <Marker position={ORIGIN} icon={restaurantIcon}>
            <Popup>
              <strong>🌶️ Addis Eats</strong>
              <br />
              Bole Atlas, Addis Ababa
              <br />
              <span style={{ color: "#c2410c", fontWeight: 600 }}>
                Restaurant origin
              </span>
            </Popup>
          </Marker>

          {/* Destination marker */}
          {dest && (
            <Marker position={dest} icon={destinationIcon}>
              <Popup>
                <strong>📦 Delivery destination</strong>
                <br />
                <span style={{ textTransform: "capitalize" }}>
                  {deliveryAddress}
                </span>
                {distanceText && (
                  <>
                    <br />
                    <span style={{ color: "#c2410c", fontWeight: 600 }}>
                      {distanceText} from Bole
                    </span>
                  </>
                )}
              </Popup>
            </Marker>
          )}

          {/* Dashed route line */}
          {dest && (
            <Polyline
              positions={[ORIGIN, dest]}
              pathOptions={{
                color: "#c2410c",
                weight: 3,
                dashArray: "8 6",
                opacity: 0.85,
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
