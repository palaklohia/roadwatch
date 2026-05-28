import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      background: "#1e293b",
      borderBottom: "1px solid #334155",
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      height: "60px"
    }}>
      <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#6366f1" }}>
        🛣 RoadWatch
      </span>
      {[
        { to: "/map", label: "Live Map" },
        { to: "/offenders", label: "Repeat Offenders" },
        { to: "/budget", label: "Budget Tracker" },
        { to: "/status", label: "Complaint Status" },
      ].map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            color: isActive ? "#6366f1" : "#94a3b8",
            textDecoration: "none",
            fontWeight: isActive ? 600 : 400,
            fontSize: "0.95rem"
          })}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}