// src/models/complaintModel.js
const pool = require('../config/database');

class ComplaintModel {
  // Get all complaint categories
  static async getCategories() {
    const [rows] = await pool.query('SELECT * FROM complaint_categories');
    return rows;
  }

  // Get category by ID
  static async getCategoryById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM complaint_categories WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Get authority for a complaint category
  static async getAuthorityByCategory(categoryId) {
    const [rows] = await pool.query(
      'SELECT * FROM authorities WHERE category_id = ?',
      [categoryId]
    );
    return rows[0];
  }

  // Create a new complaint
  static async createComplaint(complaintData) {
    const {
      category_id,
      subcategory,
      description,
      location,
      latitude,
      longitude,
      infrastructure_id,
      photo_url,
      severity,
      reporter_name,
      reporter_phone,
      reporter_email
    } = complaintData;

    const [result] = await pool.query(
      `INSERT INTO complaints (
        category_id, subcategory, description, location, 
        latitude, longitude, infrastructure_id, photo_url, 
        severity, reporter_name, reporter_phone, reporter_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        subcategory,
        description,
        location,
        latitude,
        longitude,
        infrastructure_id,
        photo_url,
        severity,
        reporter_name,
        reporter_phone,
        reporter_email
      ]
    );

    return result.insertId; // Return the complaint ID
  }

  // Get complaint by ID
  static async getComplaintById(id) {
    const [rows] = await pool.query(
      `SELECT c.*, 
              cat.name as category_name,
              a.name as authority_name, a.email as authority_email
       FROM complaints c
       LEFT JOIN complaint_categories cat ON c.category_id = cat.id
       LEFT JOIN authorities a ON c.authority_id = a.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Get all complaints (with filters)
  static async getAllComplaints(filters = {}) {
    let query = `
      SELECT c.*, 
             cat.name as category_name,
             a.name as authority_name
      FROM complaints c
      LEFT JOIN complaint_categories cat ON c.category_id = cat.id
      LEFT JOIN authorities a ON c.authority_id = a.id
      WHERE 1=1
    `;

    const params = [];

    if (filters.status) {
      query += ' AND c.status = ?';
      params.push(filters.status);
    }

    if (filters.category_id) {
      query += ' AND c.category_id = ?';
      params.push(filters.category_id);
    }

    query += ' ORDER BY c.created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }

  // Update complaint status
  static async updateComplaintStatus(complaintId, newStatus, reason = '') {
    const complaint = await this.getComplaintById(complaintId);
    const oldStatus = complaint.status;

    // Update complaint status
    await pool.query(
      'UPDATE complaints SET status = ? WHERE id = ?',
      [newStatus, complaintId]
    );

    // Log the status change
    await pool.query(
      `INSERT INTO complaint_status_log 
       (complaint_id, old_status, new_status, reason) 
       VALUES (?, ?, ?, ?)`,
      [complaintId, oldStatus, newStatus, reason]
    );

    return true;
  }

  // Get repeat offenders
  static async getRepeatOffenders() {
    const [rows] = await pool.query(
      `SELECT r.*, 
              i.name as infrastructure_name,
              c.name as contractor_name
       FROM repeat_offenders r
       LEFT JOIN infrastructure i ON r.infrastructure_id = i.id
       LEFT JOIN contractors c ON r.contractor_id = c.id
       WHERE r.is_flagged = TRUE
       ORDER BY r.shame_score DESC`
    );
    return rows;
  }
}

module.exports = ComplaintModel;