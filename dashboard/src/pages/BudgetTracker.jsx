import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const DUMMY_BUDGET = [
  { road_name: "MG Road Stretch 4", road_type: "NH", contractor_name: "ABC Road Works", budget_sanctioned: 5000000, budget_spent: 2250000 },
  { road_name: "Ring Road Sector 9", road_type: "SH", contractor_name: "XYZ Infrastructure", budget_sanctioned: 3200000, budget_spent: 2496000 },
  { road_name: "Karol Bagh Link Road", road_type: "MDR", contractor_name: "Prime Builders", budget_sanctioned: 1500000, budget_spent: 1380000 },
  { road_name: "Connaught Place Inner", road_type: "street", contractor_name: "ABC Road Works", budget_sanctioned: 800000, budget_spent: 480000 },
  { road_name: "Rohini Sector 14 Road", road_type: "SH", contractor_name: "XYZ Infrastructure", budget_sanctioned: 2200000, budget_spent: 1980000 },
];

const fmt = (val) =>
  val >= 1000000
    ? `₹${(val / 1000000).toFixed(1)}M`
    : `₹${(val / 1000).toFixed(0)}K`;

const utilizationColor = (pct) => {
  if (pct >= 90) return "#22c55e";
  if (pct >= 60) return "#f59e0b";
  return "#ef4444";
};

export default function BudgetTracker() {
  const chartData = DUMMY_BUDGET.map((r) => ({
    name: r.road_name.length > 15 ? r.road_name.slice(0, 15) + "…" : r.road_name,
    Sanctioned: r.budget_sanctioned,
    Spent: r.budget_spent,
  }));

  const totalSanctioned = DUMMY_BUDGET.reduce((a, r) => a + r.budget_sanctioned, 0);
  const totalSpent = DUMMY_BUDGET.reduce((a, r) => a + r.budget_spent, 0);
  const overallPct = ((totalSpent / totalSanctioned) * 100).toFixed(1);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        💰 Budget Tracker
      </h1>
      <p style={{ color: "#5a7a5a", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Sanctioned vs actual spending per road — public accountability layer
      </p>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Sanctioned", value: fmt(totalSanctioned), color: "#2d6a2d" },
          { label: "Total Spent", value: fmt(totalSpent), color: "#22c55e" },
          { label: "Overall Utilization", value: overallPct + "%", color: utilizationColor(overallPct) },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#ffffff", borderRadius: "12px", padding: "1.25rem", border: "1px solid #c8d8c8" }}>
            <p style={{ color: "#5a7a5a", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{label}</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "1.5rem", border: "1px solid #c8d8c8", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Sanctioned vs Spent per Road</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fill: "#5a7a5a", fontSize: 12 }} />
            <YAxis tickFormatter={fmt} tick={{ fill: "#5a7a5a", fontSize: 12 }} />
            <Tooltip formatter={(val) => fmt(val)} contentStyle={{ background: "#f0f4f0", border: "1px solid #c8d8c8", borderRadius: "8px" }} />
            <Legend />
            <Bar dataKey="Sanctioned" fill="#2d6a2d" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Spent" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#ffffff", textAlign: "left" }}>
              {["Road", "Type", "Contractor", "Sanctioned", "Spent", "Utilization", "Status"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1rem", color: "#5a7a5a", fontSize: "0.85rem", borderBottom: "1px solid #c8d8c8" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DUMMY_BUDGET.map((road, i) => {
              const pct = ((road.budget_spent / road.budget_sanctioned) * 100).toFixed(1);
              return (
                <tr key={i} style={{ background: i % 2 === 0 ? "#f0f4f0" : "#ffffff" }}>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>{road.road_name}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ background: "#c8d8c8", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem" }}>{road.road_type}</span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#5a7a5a" }}>{road.contractor_name}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{fmt(road.budget_sanctioned)}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{fmt(road.budget_spent)}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ flex: 1, background: "#c8d8c8", borderRadius: "999px", height: "6px" }}>
                        <div style={{ width: pct + "%", background: utilizationColor(pct), height: "100%", borderRadius: "999px" }} />
                      </div>
                      <span style={{ fontSize: "0.85rem", color: utilizationColor(pct) }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ color: pct < 60 ? "#ef4444" : pct < 90 ? "#f59e0b" : "#22c55e", fontSize: "0.85rem" }}>
                      {pct < 60 ? "⚠ Underspent" : pct < 90 ? "On Track" : "✓ Utilized"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}