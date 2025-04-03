// src/routes/inquiries.js
const express = require('express');
const router = express.Router();
const InquiryController = require('../controllers/InquiryController');
const { authMiddleware, isAgent } = require('../middleware/auth');

// Public routes
// POST /inquiries - Create new inquiry
router.post('/', InquiryController.createInquiry);

// Protected routes
// GET /inquiries - Get all inquiries (admin/agent only)
router.get('/', authMiddleware, isAgent, InquiryController.getAllInquiries);

// GET /inquiries/:id - Get inquiry by ID
router.get('/:id', authMiddleware, InquiryController.getInquiryById);

// PUT /inquiries/:id - Update inquiry status
router.put('/:id', authMiddleware, isAgent, InquiryController.updateInquiry);

// DELETE /inquiries/:id - Delete inquiry
router.delete('/:id', authMiddleware, isAgent, InquiryController.deleteInquiry);

// GET /inquiries/property/:propertyId - Get inquiries for a property
router.get('/property/:propertyId', authMiddleware, isAgent, InquiryController.getInquiriesByProperty);

// GET /inquiries/user/:userId - Get inquiries by user
router.get('/user/:userId', authMiddleware, InquiryController.getInquiriesByUser);

// GET /inquiries/agent/:agentId - Get inquiries assigned to agent
router.get('/agent/:agentId', authMiddleware, isAgent, InquiryController.getInquiriesByAgent);

module.exports = router;
