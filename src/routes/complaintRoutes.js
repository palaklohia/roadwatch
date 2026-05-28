// src/routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const ComplaintModel = require('../models/complaintModel');

// Get all complaint categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await ComplaintModel.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await ComplaintModel.getAllComplaints(req.query);
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get complaint by ID
router.get('/:id', async (req, res) => {
  try {
    const complaint = await ComplaintModel.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new complaint
router.post('/', async (req, res) => {
  try {
    const complaintData = req.body;
    const complaintId = await ComplaintModel.createComplaint(complaintData);
    
    // Get the created complaint
    const complaint = await ComplaintModel.getComplaintById(complaintId);
    
    res.status(201).json({
      message: 'Complaint created successfully',
      complaint_id: complaintId,
      complaint: complaint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update complaint status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, reason } = req.body;
    await ComplaintModel.updateComplaintStatus(req.params.id, status, reason);
    
    const complaint = await ComplaintModel.getComplaintById(req.params.id);
    res.json({
      message: 'Status updated',
      complaint: complaint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get repeat offenders
router.get('/dashboard/repeat-offenders', async (req, res) => {
  try {
    const offenders = await ComplaintModel.getRepeatOffenders();
    res.json(offenders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;