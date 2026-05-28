import { useState } from "react";

const DUMMY_COMPLAINTS = {
  "RW-001": {
    id: "RW-001",
    type: "pothole",
    description: "Large pothole near MG Road signal",
    location: "MG Road, Delhi",
    severity: 4,
    status: "in_progress",
    reporter_name: "Rahul Sharma",
    created_at: "2026-05-10",
    updated_at: "2026-05-15",
    authority: "PWD Delhi",
    log: [
      { status: "pending", date: "2026-05-10", note: "Complaint received and logged" },
      { status: "acknowledged", date: "2026-05-12", note: "PWD Delhi has acknowledged the complaint" },
      { status: "in_progress", date: "2026-05-15", note: "Repair crew dispatched to location" },
    ],
  },
  "RW-002": {
    id: "RW-002",
    type: "fallen_tree",
    description: "Tree blocking Ring Road lane",
    location: "Ring Road Sector 9, Delhi",
    severity: 5,
    status: "resolved",
    reporter_name: "Priya Singh",
    created_at: "2026-05-08",
    updated_at: "2026-05-09",
    authority: "Forest Department",
    log: [
      { status: "pending", date: "2026-05-08", note: "Complaint received and logged" },
      { status: "acknowledged", date: "2026-05-08", note: "Forest Department notified" },
      { status: "in_progress", date: "2026-05-09", note: "Team sent to clear the tree" },
      { status: "resolved", date: "2026-05-09", note: "Tree cleared, road reopened" },
    ],
  },
  "RW-003": {
    id: "RW-003",
    type: "streetlight",
    description: "Streetlight not working near park",
    location: "Connaught Place, Delhi",
    severity: 2,
    status: "pending",
    reporter_name: "Amit Kumar",
    created_at: "2026-05-20",
    updated_at: "2026-05-20",
    authority: "Electricity Board",
    log: [
      { status: "pending", date: "2026-05-20", note: "Complaint received and logged" },
    ],
  },
};

const statusColor = {
  pending: "#ef4444",
  acknowledged: "#6366f1",
  in_progress: "#f59e0b",
  resolved: "#22c55e",
  rejected: "#94a3b8",
};

const statusSteps = ["pending", "acknowledged", "in_progress", "resolved"];

export default function ComplaintStatus() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const found = DUMMY_COMPLAINTS[input.toUpperCase().trim()];
    if (found) {
      setResult(found);
      setError("");
    } else {
      setResult(null);
      setError("No complaint found with this ID. Try RW-001, RW-002, or RW-003.");
    }
  };

  const currentStep = result ? statusSteps.indexOf(result.status) : -1;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        🔍 Complaint Status
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Enter your complaint ID to track its current status
      </p>

      {/* Search */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter complaint ID (e.g. RW-001)"
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#1e293b",
            color: "white",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            background: "#6366f1",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Track
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#450a0a", border: "1px solid #ef4444", borderRadius: "8px", padding: "1rem", color: "#ef4444", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Complaint ID</span>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{result.id}</h2>
            </div>
            <span style={{
              background: statusColor[result.status],
              color: "white",
              padding: "0.35rem 0.9rem",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: "0.85rem",
              textTransform: "capitalize"
            }}>
              {result.status.replace("_", " ")}
            </span>
          </div>

          {/* Details */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #334155", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { label: "Type", value: result.type.replace("_", " ") },
              { label: "Severity", value: `${result.severity}/5` },
              { label: "Location", value: result.location },
              { label: "Authority", value: result.authority },
              { label: "Reported By", value: result.reporter_name },
              { label: "Filed On", value: result.created_at },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{label}</p>
                <p style={{ fontWeight: 500, textTransform: "capitalize" }}>{value}</p>
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Description</p>
              <p>{result.description}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #334155" }}>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1rem" }}>Progress</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
              {statusSteps.map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: i <= currentStep ? "#6366f1" : "#334155",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 700, color: "white"
                    }}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: i <= currentStep ? "#e2e8f0" : "#94a3b8", textTransform: "capitalize", textAlign: "center" }}>
                      {step.replace("_", " ")}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div style={{ flex: 1, height: "2px", background: i < currentStep ? "#6366f1" : "#334155", margin: "0 0.25rem", marginBottom: "1.2rem" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline log */}
          <div style={{ padding: "1.25rem 1.5rem" }}>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1rem" }}>Activity Log</p>
            {result.log.map((entry, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: statusColor[entry.status], marginTop: "4px" }} />
                  {i < result.log.length - 1 && <div style={{ width: "2px", flex: 1, background: "#334155", margin: "4px 0" }} />}
                </div>
                <div style={{ paddingBottom: "0.5rem" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "capitalize", color: statusColor[entry.status] }}>
                    {entry.status.replace("_", " ")}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{entry.note}</p>
                  <p style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.2rem" }}>{entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}