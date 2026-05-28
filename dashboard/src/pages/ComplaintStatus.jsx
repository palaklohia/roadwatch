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
  pending: "#c0392b",
  acknowledged: "#2d6a2d",
  in_progress: "#e67e22",
  resolved: "#27ae60",
  rejected: "#5a7a5a",
};

const statusSteps = ["pending", "acknowledged", "in_progress", "resolved"];

export default function ComplaintStatus() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a complaint ID.");
      return;
    }
    const found = DUMMY_COMPLAINTS[trimmed];
    if (found) {
      setResult(found);
      setError("");
    } else {
      setResult(null);
      setError("No complaint found. Try RW-001, RW-002, or RW-003.");
    }
  };

  const currentStep = result ? statusSteps.indexOf(result.status) : -1;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1a2e1a" }}>
        🔍 Complaint Status
      </h1>
      <p style={{ color: "#5a7a5a", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Enter your complaint ID to track its current status
      </p>

      {/* Search */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          placeholder="Enter complaint ID (e.g. RW-001)"
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #c8d8c8",
            background: "#ffffff",
            color: "#1a2e1a",
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
            background: "#2d6a2d",
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
        <div style={{ background: "#fdf0ef", border: "1px solid #c0392b", borderRadius: "8px", padding: "1rem", color: "#c0392b", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #c8d8c8", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #c8d8c8", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#e8f0e8" }}>
            <div>
              <span style={{ color: "#5a7a5a", fontSize: "0.85rem" }}>Complaint ID</span>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1a2e1a" }}>{result.id}</h2>
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

          {/* Details grid */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #c8d8c8", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { label: "Type", value: result.type.replace("_", " ") },
              { label: "Severity", value: `${result.severity}/5` },
              { label: "Location", value: result.location },
              { label: "Authority", value: result.authority },
              { label: "Reported By", value: result.reporter_name },
              { label: "Filed On", value: result.created_at },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ color: "#5a7a5a", fontSize: "0.8rem" }}>{label}</p>
                <p style={{ fontWeight: 500, textTransform: "capitalize", color: "#1a2e1a" }}>{value}</p>
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <p style={{ color: "#5a7a5a", fontSize: "0.8rem" }}>Description</p>
              <p style={{ color: "#1a2e1a" }}>{result.description}</p>
            </div>
          </div>

          {/* Progress steps */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #c8d8c8" }}>
            <p style={{ color: "#5a7a5a", fontSize: "0.85rem", marginBottom: "1rem" }}>Progress</p>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {statusSteps.map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: i <= currentStep ? "#2d6a2d" : "#c8d8c8",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 700, color: "white",
                      flexShrink: 0
                    }}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <span style={{
                      fontSize: "0.7rem",
                      color: i <= currentStep ? "#1a2e1a" : "#5a7a5a",
                      textTransform: "capitalize",
                      textAlign: "center",
                      whiteSpace: "nowrap"
                    }}>
                      {step.replace("_", " ")}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: "2px",
                      background: i < currentStep ? "#2d6a2d" : "#c8d8c8",
                      margin: "0 4px",
                      marginBottom: "20px"
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity log */}
          <div style={{ padding: "1.25rem 1.5rem" }}>
            <p style={{ color: "#5a7a5a", fontSize: "0.85rem", marginBottom: "1rem" }}>Activity Log</p>
            {result.log.map((entry, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: statusColor[entry.status], marginTop: "4px", flexShrink: 0 }} />
                  {i < result.log.length - 1 && (
                    <div style={{ width: "2px", flex: 1, background: "#c8d8c8", margin: "4px 0" }} />
                  )}
                </div>
                <div style={{ paddingBottom: "0.5rem" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "capitalize", color: statusColor[entry.status] }}>
                    {entry.status.replace("_", " ")}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#1a2e1a" }}>{entry.note}</p>
                  <p style={{ fontSize: "0.75rem", color: "#5a7a5a", marginTop: "0.2rem" }}>{entry.date}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}