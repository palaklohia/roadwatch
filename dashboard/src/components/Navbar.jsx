import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      background: "#2d6a2d",
      borderBottom: "3px solid #f5a623",
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      height: "64px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.5rem" }}>🛣️</span>
        <span style={{ fontWeight: 800, fontSize: "1.3rem", color: "#ffffff", letterSpacing: "0.5px" }}>
          Road<span style={{ color: "#f5a623" }}>Watch</span>
        </span>
      </div>

      <div style={{ width: "1px", height: "30px", background: "#4a9e4a", marginLeft: "0.5rem" }} />

      {[
        { to: "/", label: "🏠 Home" },
        { to: "/map", label: "🗺 Live Map" },
        { to: "/offenders", label: "🚨 Repeat Offenders" },
        { to: "/budget", label: "💰 Budget Tracker" },
        { to: "/status", label: "📋 Complaint Status" },
        { to: "/classify", label: "🤖 Classify" },
      ].map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            color: isActive ? "#f5a623" : "#c8e6c8",
            textDecoration: "none",
            fontWeight: isActive ? 700 : 400,
            fontSize: "0.9rem",
            padding: "0.4rem 0.75rem",
            borderRadius: "6px",
            background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
            transition: "all 0.2s"
          })}
        >
          {label}
        </NavLink>
      ))}

      <div style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#c8e6c8", background: "rgba(0,0,0,0.2)", padding: "0.3rem 0.75rem", borderRadius: "999px" }}>
        🟢 Live
      </div>
    </nav>
  );
}