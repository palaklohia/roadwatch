import { useState } from "react";

const DUMMY_ROADS = [
  { id: 1, road_name: "MG Road Stretch 4", road_type: "NH", location: "Delhi", contractor_name: "ABC Road Works", complaint_count: 8, avgSeverity: "4.2", last_maintained: "2024-03-01", budgetUtilization: "45%", shameFlag: true, rating: "🔴 Critical" },
  { id: 2, road_name: "Ring Road Sector 9", road_type: "SH", location: "Delhi", contractor_name: "XYZ Infrastructure", complaint_count: 6, avgSeverity: "3.8", last_maintained: "2024-05-15", budgetUtilization: "78%", shameFlag: true, rating: "🟠 Poor" },
  { id: 3, road_name: "Karol Bagh Link Road", road_type: "MDR", location: "Delhi", contractor_name: "Prime Builders", complaint_count: 4, avgSeverity: "3.1", last_maintained: "2024-07-20", budgetUtilization: "92%", shameFlag: true, rating: "🟠 Poor" },
  { id: 4, road_name: "Connaught Place Inner Circle", road_type: "street", location: "Delhi", contractor_name: "ABC Road Works", complaint_count: 3, avgSeverity: "2.5", last_maintained: "2024-09-10", budgetUtilization: "60%", shameFlag: true, rating: "🟡 Average" },
];

const DUMMY_CONTRACTORS = [
  { id: 1, contractor_name: "ABC Road Works", complaint_count: 11, roads_managed: 4, shame_score: "4.80", rating: "🔴 Critical" },
  { id: 2, contractor_name: "XYZ Infrastructure", complaint_count: 6, roads_managed: 3, shame_score: "3.20", rating: "🟠 Poor" },
  { id: 3, contractor_name: "Prime Builders", complaint_count: 4, roads_managed: 2, shame_score: "1.50", rating: "🟡 Average" },
];

export default function RepeatOffenders() {
  const [tab, setTab] = useState("roads");

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        🚨 Repeat Offender Tracker
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Roads and contractors with repeated complaints in the last 12 months
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        {["roads", "contractors"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              background: tab === t ? "#6366f1" : "#1e293b",
              color: tab === t ? "white" : "#94a3b8",
              cursor: "pointer",
              fontWeight: tab === t ? 600 : 400,
              textTransform: "capitalize"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Roads Table */}
      {tab === "roads" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1e293b", textAlign: "left" }}>
                {["Road", "Type", "Location", "Contractor", "Complaints", "Avg Severity", "Last Maintained", "Budget Used", "Status"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", color: "#94a3b8", fontSize: "0.85rem", borderBottom: "1px solid #334155" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DUMMY_ROADS.map((road, i) => (
                <tr key={road.id} style={{ background: i % 2 === 0 ? "#0f172a" : "#1e293b" }}>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>{road.road_name}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ background: "#334155", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem" }}>{road.road_type}</span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>{road.location}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{road.contractor_name}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ color: road.complaint_count >= 5 ? "#ef4444" : "#f59e0b", fontWeight: 700 }}>{road.complaint_count}</span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>{road.avgSeverity}/5</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>{road.last_maintained}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{road.budgetUtilization}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{road.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contractors Table */}
      {tab === "contractors" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1e293b", textAlign: "left" }}>
                {["Contractor", "Roads Managed", "Total Complaints", "Shame Score", "Rating"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", color: "#94a3b8", fontSize: "0.85rem", borderBottom: "1px solid #334155" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DUMMY_CONTRACTORS.map((c, i) => (
                <tr key={c.id} style={{ background: i % 2 === 0 ? "#0f172a" : "#1e293b" }}>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>{c.contractor_name}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{c.roads_managed}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ color: c.complaint_count >= 8 ? "#ef4444" : "#f59e0b", fontWeight: 700 }}>{c.complaint_count}</span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{c.shame_score}</span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>{c.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}