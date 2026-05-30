// ai/routingModel.js
const db = require('./db');

class RoutingModel {
  // Find authority based on complaint type
  static async findAuthority(hazardType) {
    const authorityMap = {
      'pothole': 'Road Maintenance Dept',
      'waterlogging': 'Water Management',
      'broken streetlight': 'Municipal Corporation',
      'fallen tree': 'Forest Dept',
      'accident': 'Traffic Police',
      'roadkill': 'Animal Control',
      'missing sign': 'Public Works',
      'heat issue': 'Emergency Services',
      'fire hazard': 'Emergency Services'
    };

    const authorityName = authorityMap[hazardType.toLowerCase()] || 'Public Works';

    try {
      const [rows] = await db.query(
        'SELECT * FROM authorities WHERE name LIKE ?',
        [`%${authorityName}%`]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Authority lookup error:', error);
      return null;
    }
  }

  // Update complaint with classification and authority
  static async routeComplaint(complaintId, classification, authorityId) {
    try {
      await db.query(
        `UPDATE complaints 
         SET complaint_type = ?, severity = ?, authority_id = ?, status = 'acknowledged'
         WHERE id = ?`,
        [classification.type, classification.severity, authorityId, complaintId]
      );

      // Log the routing
      await db.query(
        `INSERT INTO complaint_status_log 
         (complaint_id, old_status, new_status, updated_by, reason)
         VALUES (?, ?, ?, ?, ?)`,
        [complaintId, 'pending', 'acknowledged', 'System', `Auto-routed to authority. Type: ${classification.type}`]
      );

      return true;
    } catch (error) {
      console.error('Routing error:', error);
      return false;
    }
  }
}

module.exports = RoutingModel;