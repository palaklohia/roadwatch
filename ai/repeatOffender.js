import db from "./db.js";

// ─────────────────────────────────────────────
// 1. Check if a location is a repeat offender stretch
// Looks for 3+ complaints within 500m in last 12 months
// ─────────────────────────────────────────────
export async function checkRepeatStretch(latitude, longitude) {
  const [rows] = await db.execute(
    `SELECT 
      COUNT(*) as complaint_count,
      AVG(severity) as avg_severity,
      MAX(created_at) as last_reported,
      GROUP_CONCAT(DISTINCT subcategory) as hazard_types
     FROM complaints
     WHERE (
       6371000 * acos(
         cos(radians(?)) * cos(radians(latitude)) *
         cos(radians(longitude) - radians(?)) +
         sin(radians(?)) * sin(radians(latitude))
       )
     ) <= 500
     AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)`,
    [latitude, longitude, latitude]
  );

  const data = rows[0];
  const isRepeatOffender = data.complaint_count >= 3;

  return {
    isRepeatOffender,
    complaintCount: data.complaint_count,
    avgSeverity: parseFloat(data.avg_severity) || 0,
    lastReported: data.last_reported,
    hazardTypes: data.hazard_types ? data.hazard_types.split(",") : [],
  };
}

// ─────────────────────────────────────────────
// 2. Flag a road as repeat offender in the DB
// Called automatically when complaint_count hits 3
// ─────────────────────────────────────────────
export async function flagRepeatOffender(infrastructureId, contractorId) {
  // Check if already exists
  const [existing] = await db.execute(
    `SELECT id, complaint_count FROM repeat_offenders 
     WHERE infrastructure_id = ? AND contractor_id = ?`,
    [infrastructureId, contractorId]
  );

  if (existing.length > 0) {
    // Update existing record
    await db.execute(
      `UPDATE repeat_offenders 
       SET complaint_count = complaint_count + 1,
           last_complaint_date = CURDATE(),
           is_flagged = TRUE,
           flagged_date = NOW()
       WHERE infrastructure_id = ? AND contractor_id = ?`,
      [infrastructureId, contractorId]
    );
  } else {
    // Insert new record
    await db.execute(
      `INSERT INTO repeat_offenders 
       (infrastructure_id, contractor_id, complaint_count, last_complaint_date, is_flagged, flagged_date)
       VALUES (?, ?, 1, CURDATE(), FALSE, NULL)`,
      [infrastructureId, contractorId]
    );
  }
}

// ─────────────────────────────────────────────
// 3. Calculate and update shame score for a contractor
// Shame score = total complaints / total km managed
// ─────────────────────────────────────────────
export async function updateContractorShameScore(contractorId) {
  const [complaints] = await db.execute(
    `SELECT COUNT(*) as total_complaints
     FROM complaints
     WHERE contractor_id = ?
     AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)`,
    [contractorId]
  );

  const [infra] = await db.execute(
    `SELECT COUNT(*) as road_count
     FROM infrastructure
     WHERE contractor_id = ?`,
    [contractorId]
  );

  const totalComplaints = complaints[0].total_complaints;
  const roadCount = infra[0].road_count || 1;
  const shameScore = parseFloat((totalComplaints / roadCount).toFixed(2));

  // Update the contractors table
  await db.execute(
    `UPDATE contractors 
     SET shame_score = ?, complaint_count = ?
     WHERE id = ?`,
    [shameScore, totalComplaints, contractorId]
  );

  return { contractorId, shameScore, totalComplaints, roadCount };
}

// ─────────────────────────────────────────────
// 4. Get top 10 worst roads leaderboard
// ─────────────────────────────────────────────
export async function getWorstRoads() {
  const [rows] = await db.execute(
    `SELECT 
      i.id,
      i.name as road_name,
      i.type as road_type,
      i.location,
      c.name as contractor_name,
      COUNT(comp.id) as complaint_count,
      AVG(comp.severity) as avg_severity,
      i.last_maintained,
      i.budget_sanctioned,
      i.budget_spent,
      MAX(ro.is_flagged) as is_flagged,
      MAX(ro.shame_score) as shame_score
     FROM infrastructure i
     LEFT JOIN contractors c ON i.contractor_id = c.id
     LEFT JOIN complaints comp ON comp.infrastructure_id = i.id
     LEFT JOIN repeat_offenders ro ON ro.infrastructure_id = i.id
     WHERE comp.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
     GROUP BY i.id, i.name, i.type, i.location, c.name, i.last_maintained, i.budget_sanctioned, i.budget_spent
     ORDER BY complaint_count DESC, avg_severity DESC
     LIMIT 10`
  );
  return rows.map((row) => ({
    ...row,
    avgSeverity: parseFloat(row.avg_severity || 0).toFixed(1),
    budgetUtilization:
      row.budget_sanctioned > 0
        ? ((row.budget_spent / row.budget_sanctioned) * 100).toFixed(1) + "%"
        : "N/A",
    shameFlag: row.complaint_count >= 3 || row.is_flagged,
    rating: getShameRating(row.shame_score),
  }));
}

// ─────────────────────────────────────────────
// 5. Get top 10 worst contractors leaderboard
// ─────────────────────────────────────────────
export async function getWorstContractors() {
  const [rows] = await db.execute(
    `SELECT 
      c.id,
      c.name as contractor_name,
      c.email,
      c.complaint_count,
      c.repair_count,
      c.shame_score,
      COUNT(DISTINCT i.id) as roads_managed,
      COUNT(comp.id) as recent_complaints,
      AVG(comp.severity) as avg_severity
     FROM contractors c
     LEFT JOIN infrastructure i ON i.contractor_id = c.id
     LEFT JOIN complaints comp ON comp.contractor_id = c.id
     WHERE comp.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        OR comp.id IS NULL
     GROUP BY c.id
     ORDER BY c.shame_score DESC, recent_complaints DESC
     LIMIT 10`
  );

  return rows.map((row) => ({
    ...row,
    avgSeverity: parseFloat(row.avg_severity || 0).toFixed(1),
    rating: getShameRating(row.shame_score),
  }));
}

// ─────────────────────────────────────────────
// 6. Get all flagged repeat offender stretches
// ─────────────────────────────────────────────
export async function getFlaggedStretches() {
  const [rows] = await db.execute(
    `SELECT 
      ro.*,
      i.name as road_name,
      i.type as road_type,
      i.location,
      i.latitude,
      i.longitude,
      c.name as contractor_name
     FROM repeat_offenders ro
     JOIN infrastructure i ON ro.infrastructure_id = i.id
     JOIN contractors c ON ro.contractor_id = c.id
     WHERE ro.is_flagged = TRUE
     ORDER BY ro.complaint_count DESC`
  );

  return rows;
}

// ─────────────────────────────────────────────
// Helper — converts shame score to a rating label
// ─────────────────────────────────────────────
function getShameRating(score) {
  if (score >= 5) return "🔴 Critical";
  if (score >= 3) return "🟠 Poor";
  if (score >= 1) return "🟡 Average";
  return "🟢 Good";
}