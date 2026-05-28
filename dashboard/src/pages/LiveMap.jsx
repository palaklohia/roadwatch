import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const severityColor = (severity) => {
  if (severity >= 4) return "🔴";
  if (severity >= 3) return "🟠";
  if (severity >= 2) return "🟡";
  return "🟢";
};

// Dummy data for now — will be replaced by API later
const DUMMY_COMPLAINTS = [
  { id: 1, type: "pothole", severity: 4, description: "Large pothole near signal", latitude: 28.6139, longitude: 77.209, status: "pending", location: "MG Road, Delhi" },
  { id: 2, type: "fallen_tree", severity: 5, description: "Tree blocking lane", latitude: 28.6200, longitude: 77.215, status: "acknowledged", location: "Ring Road, Delhi" },
  { id: 3, type: "streetlight", severity: 2, description: "Streetlight not working", latitude: 28.6100, longitude: 77.205, status: "pending", location: "Connaught Place, Delhi" },
  { id: 4, type: "waterlogging", severity: 3, description: "Water accumulated after rain", latitude: 28.6150, longitude: 77.220, status: "in_progress", location: "Karol Bagh, Delhi" },
];

export default function LiveMap() {
  const [complaints, setComplaints] = useState(DUMMY_COMPLAINTS);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? complaints
    : complaints.filter((c) => c.type === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
      {/* Filter bar */}
      <div style={{
        padding: "1rem 2rem",
        background: "#1e293b",
        borderBottom: "1px solid #334155",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center"
      }}>
        <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Filter:</span>
        {["all", "pothole", "fallen_tree", "streetlight", "waterlogging", "accident", "roadkill"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: "0.3rem 0.8rem",
              borderRadius: "999px",
              border: "1px solid #334155",
              background: filter === type ? "#6366f1" : "transparent",
              color: filter === type ? "white" : "#94a3b8",
              cursor: "pointer",
              fontSize: "0.8rem",
              textTransform: "capitalize"
            }}
          >
            {type.replace("_", " ")}
          </button>
        ))}
        <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "0.85rem" }}>
          {filtered.length} complaints
        </span>
      </div>

      {/* Map */}
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={13}
        style={{ flex: 1, width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        {filtered.map((complaint) => (
          <Marker
            key={complaint.id}
            position={[complaint.latitude, complaint.longitude]}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <strong>{severityColor(complaint.severity)} {complaint.type.replace("_", " ").toUpperCase()}</strong>
                <p style={{ margin: "0.5rem 0 0.25rem" }}>{complaint.description}</p>
                <p style={{ color: "#666", fontSize: "0.85rem" }}>{complaint.location}</p>
                <p style={{ marginTop: "0.5rem" }}>
                  <span style={{
                    background: complaint.status === "resolved" ? "#22c55e" : complaint.status === "pending" ? "#ef4444" : "#f59e0b",
                    color: "white",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem"
                  }}>
                    {complaint.status}
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}